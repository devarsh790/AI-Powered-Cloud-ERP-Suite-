import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Account, { JournalEntry, Payment } from '../../models/finance';
import InvoiceModel from '../../models/finance/Invoice';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

// ===== Chart of Accounts =====
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, search } = req.query;
    const filter: any = { tenantId: req.user?.tenantId };
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const accounts = await Account.find(filter).sort({ code: 1 });
    sendSuccess(res, accounts);
  } catch (error: any) { sendError(res, error.message); }
};

export const createAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await Account.create({ ...req.body, tenantId: req.user?.tenantId });
    sendSuccess(res, account, 'Account created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body, { new: true }
    );
    if (!account) { sendError(res, 'Account not found', 404); return; }
    sendSuccess(res, account, 'Account updated');
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Journal Entries =====
export const getJournalEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.status) filter.status = req.query.status;
    const total = await JournalEntry.countDocuments(filter);
    const entries = await JournalEntry.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, entries, total, page, limit);
  } catch (error: any) { sendError(res, error.message); }
};

export const createJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lines, ...rest } = req.body;
    const totalDebit = lines.reduce((sum: number, l: any) => sum + (l.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, l: any) => sum + (l.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      sendError(res, 'Debit and Credit must be equal (double-entry)', 400); return;
    }
    const count = await JournalEntry.countDocuments({ tenantId: req.user?.tenantId });
    const entry = await JournalEntry.create({
      ...rest, lines, totalDebit, totalCredit,
      tenantId: req.user?.tenantId,
      entryNumber: `JE-${String(count + 1).padStart(5, '0')}`,
    });
    sendSuccess(res, entry, 'Journal entry created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const postJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId, status: 'draft' },
      { status: 'posted', postedBy: req.user?.userId, postedAt: new Date() },
      { new: true }
    );
    if (!entry) { sendError(res, 'Entry not found or already posted', 404); return; }
    // Update account balances
    for (const line of entry.lines) {
      await Account.findByIdAndUpdate(line.accountId, { $inc: { balance: line.debit - line.credit } });
    }
    sendSuccess(res, entry, 'Journal entry posted');
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Invoices (AR) =====
export const getInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user.tenantId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
        { customerName: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const total = await InvoiceModel.countDocuments(filter);
    const invoices = await InvoiceModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, invoices, total, page, limit);
  } catch (error: any) { sendError(res, error.message); }
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const { customerName, customerEmail, lineItems, dueDate, notes, terms } = req.body;
    
    const latestInvoice = await InvoiceModel.findOne({ tenantId: req.user.tenantId }).sort({ createdAt: -1 }).lean();
    const lastNum = latestInvoice ? parseInt(latestInvoice.invoiceNumber.split('-')[1] || '0') : 0;
    const invoiceNumber = `INV-${String(lastNum + 1).padStart(6, '0')}`;
    
    const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum: number, item: any) => sum + (item.tax || 0), 0);
    const total = subtotal + taxAmount;
    
    const invoice = await InvoiceModel.create({
      tenantId: req.user.tenantId,
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
      createdBy: req.user.userId,
      status: 'draft',
    });
    sendSuccess(res, invoice, 'Invoice created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const invoice = await InvoiceModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { ...req.body, updatedBy: req.user.userId },
      { new: true }
    );
    if (!invoice) { sendError(res, 'Invoice not found', 404); return; }
    sendSuccess(res, invoice, 'Invoice updated');
  } catch (error: any) { sendError(res, error.message); }
};

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const invoice = await InvoiceModel.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
      status: 'draft'
    });
    if (!invoice) { sendError(res, 'Invoice not found or cannot be deleted', 404); return; }
    sendSuccess(res, null, 'Invoice deleted');
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Payments =====
export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { tenantId: req.user?.tenantId };
    const payments = await Payment.find(filter).populate('invoiceId', 'invoiceNumber vendorOrCustomer').sort({ date: -1 });
    sendSuccess(res, payments);
  } catch (error: any) { sendError(res, error.message); }
};

export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const count = await Payment.countDocuments({ tenantId: req.user.tenantId });
    const payment = await Payment.create({
      ...req.body, tenantId: req.user.tenantId, processedBy: req.user.userId,
      paymentNumber: `PAY-${String(count + 1).padStart(5, '0')}`,
    });
    // Update invoice paid amount
    if (req.body.invoiceId) {
      await InvoiceModel.findByIdAndUpdate(req.body.invoiceId, {
        $inc: { amountPaid: payment.amount },
      });
      const invoice = await InvoiceModel.findById(req.body.invoiceId);
      if (invoice && invoice.amountPaid >= invoice.total) {
        invoice.status = 'paid';
        await invoice.save();
      }
    }
    sendSuccess(res, payment, 'Payment recorded', 201);
  } catch (error: any) { sendError(res, error.message); }
};

// ===== Finance Summary =====
export const getFinanceSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendError(res, 'Unauthorized', 401); return; }
    const tenantId = req.user.tenantId;
    const [totalAR, accounts, recentEntries] = await Promise.all([
      InvoiceModel.aggregate([
        { $match: { tenantId: tenantId as any, status: { $nin: ['paid', 'cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' }, paid: { $sum: '$amountPaid' } } },
      ]),
      Account.aggregate([
        { $match: { tenantId: tenantId as any, isActive: true } },
        { $group: { _id: '$type', totalBalance: { $sum: '$balance' }, count: { $sum: 1 } } },
      ]),
      InvoiceModel.find({ tenantId }).sort({ createdAt: -1 }).limit(5),
    ]);

    sendSuccess(res, {
      receivables: totalAR[0] || { total: 0, paid: 0 },
      accountsByType: accounts,
      recentInvoices: recentEntries,
    });
  } catch (error: any) { sendError(res, error.message); }
};
