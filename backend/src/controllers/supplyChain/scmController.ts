import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Vendor, PurchaseOrder, InventoryItem } from '../../models/supplyChain';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

export const getVendors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    const vendors = await Vendor.find(filter).sort({ name: 1 });
    sendSuccess(res, vendors);
  } catch (e: any) { sendError(res, e.message); }
};

export const createVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Vendor.countDocuments({ tenantId: req.user?.tenantId });
    const vendor = await Vendor.create({ ...req.body, tenantId: req.user?.tenantId, vendorCode: `VEN-${String(count + 1).padStart(4, '0')}` });
    sendSuccess(res, vendor, 'Vendor created', 201);
  } catch (e: any) { sendError(res, e.message); }
};

export const updateVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const v = await Vendor.findOneAndUpdate({ _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true });
    if (!v) { sendError(res, 'Vendor not found', 404); return; }
    sendSuccess(res, v, 'Vendor updated');
  } catch (e: any) { sendError(res, e.message); }
};

export const getPurchaseOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.status) filter.status = req.query.status;
    const total = await PurchaseOrder.countDocuments(filter);
    const pos = await PurchaseOrder.find(filter).populate('vendorId', 'name vendorCode').sort({ orderDate: -1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, pos, total, page, limit);
  } catch (e: any) { sendError(res, e.message); }
};

export const createPurchaseOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await PurchaseOrder.countDocuments({ tenantId: req.user?.tenantId });
    const po = await PurchaseOrder.create({ ...req.body, tenantId: req.user?.tenantId, createdBy: req.user?.userId, poNumber: `PO-${String(count + 1).padStart(5, '0')}` });
    sendSuccess(res, po, 'Purchase order created', 201);
  } catch (e: any) { sendError(res, e.message); }
};

export const updatePurchaseOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const po = await PurchaseOrder.findOneAndUpdate({ _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true });
    if (!po) { sendError(res, 'PO not found', 404); return; }
    sendSuccess(res, po, 'PO updated');
  } catch (e: any) { sendError(res, e.message); }
};

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    const items = await InventoryItem.find(filter).sort({ name: 1 });
    sendSuccess(res, items);
  } catch (e: any) { sendError(res, e.message); }
};

export const createInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.create({ ...req.body, tenantId: req.user?.tenantId });
    sendSuccess(res, item, 'Item created', 201);
  } catch (e: any) { sendError(res, e.message); }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await InventoryItem.findOneAndUpdate({ _id: req.params.id, tenantId: req.user?.tenantId }, req.body, { new: true });
    if (!item) { sendError(res, 'Item not found', 404); return; }
    if (item.currentStock <= 0) item.status = 'out-of-stock';
    else if (item.currentStock <= item.reorderLevel) item.status = 'low-stock';
    else item.status = 'in-stock';
    await item.save();
    sendSuccess(res, item, 'Item updated');
  } catch (e: any) { sendError(res, e.message); }
};

export const getSCMSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tid = req.user?.tenantId;
    const [vendorCount, poStats, lowStock, totalItems] = await Promise.all([
      Vendor.countDocuments({ tenantId: tid, status: 'active' }),
      PurchaseOrder.aggregate([{ $match: { tenantId: tid as any } }, { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }]),
      InventoryItem.countDocuments({ tenantId: tid, status: 'low-stock' }),
      InventoryItem.countDocuments({ tenantId: tid }),
    ]);
    sendSuccess(res, { vendorCount, poStats, lowStock, totalItems });
  } catch (e: any) { sendError(res, e.message); }
};
