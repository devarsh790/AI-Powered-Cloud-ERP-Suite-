import { Request, Response } from 'express';
import User from '../models/User';
import Tenant from '../models/Tenant';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, tenantName, tenantSlug } = req.body;

    // Create or find tenant
    let tenant = await Tenant.findOne({ slug: tenantSlug || tenantName.toLowerCase().replace(/\s+/g, '-') });
    if (!tenant) {
      tenant = await Tenant.create({
        name: tenantName || 'Default Organization',
        slug: tenantSlug || tenantName?.toLowerCase().replace(/\s+/g, '-') || 'default',
      });
    }

    // Check if user exists in tenant
    const existingUser = await User.findOne({ email, tenantId: tenant._id });
    if (existingUser) {
      sendError(res, 'User already exists in this organization', 409);
      return;
    }

    // Create user (first user in tenant is TenantAdmin)
    const userCount = await User.countDocuments({ tenantId: tenant._id });
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      tenantId: tenant._id,
      role: userCount === 0 ? 'TenantAdmin' : 'Viewer',
    });

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: tenant._id.toString(),
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: tenant._id,
        tenantName: tenant.name,
      },
      accessToken,
      refreshToken,
    }, 'Registration successful', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, tenantSlug } = req.body;

    // Find tenant
    let tenantQuery: any = {};
    if (tenantSlug) {
      tenantQuery = { slug: tenantSlug };
    }

    const tenant = tenantSlug
      ? await Tenant.findOne(tenantQuery)
      : await Tenant.findOne();

    if (!tenant) {
      sendError(res, 'Organization not found', 404);
      return;
    }

    // Find user with password
    const user = await User.findOne({ email, tenantId: tenant._id }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account is deactivated', 403);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: tenant._id.toString(),
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update user
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    sendSuccess(res, {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        tenantId: tenant._id,
        tenantName: tenant.name,
      },
      accessToken,
      refreshToken,
    }, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, 'Refresh token is required', 400);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      sendError(res, 'Invalid refresh token', 401);
      return;
    }

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId.toString(),
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = newRefreshToken;
    await user.save();

    sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    sendError(res, 'Invalid refresh token', 401);
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).populate('tenantId', 'name slug logo');
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndUpdate(req.user?.userId, { refreshToken: null });
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
