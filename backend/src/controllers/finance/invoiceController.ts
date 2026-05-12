import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Invoice from '../../models/finance/Invoice';
import { sendSuccess, sendError } from '../../utils/response';

// Get all invoices with pagination and filtering
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const { page = 1, limit = 20, status, search, sortBy = '-createdAt' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const tenantId = req.user.tenantId;

    // Build filter
    const filter: any = { tenantId };
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const sortString = String(sortBy).trim() || '-createdAt';
    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .sort(sortString)
        .skip(skip)
        .limit(Number(limit))
        .select('invoiceNumber customerName total amountPaid status issueDate dueDate')
        .lean(),
      Invoice.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    sendError(res, 'Failed to fetch invoices');
  }
};

// Get single invoice detail
export const getInvoiceDetail = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const invoice = await Invoice.findOne({ _id: id, tenantId }).lean();
    if (!invoice) {
      return sendError(res, 'Invoice not found', 404);
    }

    sendSuccess(res, invoice);
  } catch (error) {
    console.error('Get invoice detail error:', error);
    sendError(res, 'Failed to fetch invoice');
  }
};

// Create new invoice
export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { customerName, customerEmail, lineItems, dueDate, notes, terms } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;

    // Generate invoice number
    const latestInvoice = await Invoice.findOne({ tenantId }).sort({ createdAt: -1 }).lean();
    const lastNum = latestInvoice ? parseInt(latestInvoice.invoiceNumber.split('-')[1] || '0') : 0;
    const invoiceNumber = `INV-${String(lastNum + 1).padStart(6, '0')}`;

    // Calculate totals
    const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum: number, item: any) => sum + (item.tax || 0), 0);
    const total = subtotal + taxAmount;

    const invoice = await Invoice.create({
      tenantId,
      invoiceNumber,
      customerName,
      customerEmail,
      lineItems,
      subtotal,
      taxAmount,
      total,
      dueDate: new Date(dueDate),
      notes,
      terms,
      createdBy: userId,
      status: 'draft',
    });

    sendSuccess(res, invoice, 'Invoice created successfully');
  } catch (error) {
    console.error('Create invoice error:', error);
    sendError(res, 'Failed to create invoice');
  }
};

// Update invoice
export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const { customerName, customerEmail, lineItems, dueDate, notes, terms, status } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;

    const invoice = await Invoice.findOne({ _id: id, tenantId });
    if (!invoice) {
      return sendError(res, 'Invoice not found', 404);
    }

    // Calculate new totals if lineItems changed
    let updates: any = { customerName, customerEmail, dueDate, notes, terms, status, updatedBy: userId };
    if (lineItems) {
      const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.total, 0);
      const taxAmount = lineItems.reduce((sum: number, item: any) => sum + (item.tax || 0), 0);
      const total = subtotal + taxAmount;
      updates = { ...updates, lineItems, subtotal, taxAmount, total };
    }

    const updated = await Invoice.findByIdAndUpdate(id, updates, { new: true });
    sendSuccess(res, updated);
  } catch (error) {
    console.error('Update invoice error:', error);
    sendError(res, 'Failed to update invoice');
  }
};

// Send invoice (change status to sent)
export const sendInvoice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, tenantId },
      { status: 'sent' },
      { new: true }
    );

    if (!invoice) {
      return sendError(res, 'Invoice not found', 404);
    }

    sendSuccess(res, invoice);
  } catch (error) {
    console.error('Send invoice error:', error);
    sendError(res, 'Failed to send invoice');
  }
};

// Mark invoice as paid (or partial payment)
export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const { amountPaid } = req.body;
    const tenantId = req.user.tenantId;

    const invoice = await Invoice.findOne({ _id: id, tenantId });
    if (!invoice) {
      return sendError(res, 'Invoice not found', 404);
    }

    const newAmountPaid = (invoice.amountPaid || 0) + amountPaid;
    const newStatus = newAmountPaid >= invoice.total ? 'paid' : 'partial';

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { amountPaid: newAmountPaid, status: newStatus },
      { new: true }
    );

    sendSuccess(res, updated);
  } catch (error) {
    console.error('Record payment error:', error);
    sendError(res, 'Failed to record payment');
  }
};

// Delete invoice (only if draft)
export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const invoice = await Invoice.findOne({ _id: id, tenantId });
    if (!invoice) {
      return sendError(res, 'Invoice not found', 404);
    }

    if (invoice.status !== 'draft') {
      return sendError(res, 'Cannot delete non-draft invoices', 400);
    }

    await Invoice.deleteOne({ _id: id });
    sendSuccess(res, { message: 'Invoice deleted' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    sendError(res, 'Failed to delete invoice');
  }
};
