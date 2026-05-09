import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import Account, { JournalEntry, Invoice, Payment } from '../../models/finance';
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

// ===== Invoices (AP/AR) =====
export const getInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter: any = { tenantId: req.user?.tenantId };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.vendorOrCustomer = { $regex: req.query.search, $options: 'i' };
    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    sendPaginated(res, invoices, total, page, limit);
  } catch (error: any) { sendError(res, error.message); }
};

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const type = req.body.type || 'receivable';
    const prefix = type === 'payable' ? 'AP' : 'AR';
    const count = await Invoice.countDocuments({ tenantId: req.user?.tenantId, type });
    const invoice = await Invoice.create({
      ...req.body, tenantId: req.user?.tenantId, createdBy: req.user?.userId,
      invoiceNumber: `${prefix}-${String(count + 1).padStart(5, '0')}`,
    });
    sendSuccess(res, invoice, 'Invoice created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body, { new: true }
    );
    if (!invoice) { sendError(res, 'Invoice not found', 404); return; }
    sendSuccess(res, invoice, 'Invoice updated');
  } catch (error: any) { sendError(res, error.message); }
};

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId, status: 'draft' });
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
    const count = await Payment.countDocuments({ tenantId: req.user?.tenantId });
    const payment = await Payment.create({
      ...req.body, tenantId: req.user?.tenantId, processedBy: req.user?.userId,
      paymentNumber: `PAY-${String(count + 1).padStart(5, '0')}`,
    });
    // Update invoice paid amount
    if (req.body.invoiceId) {
      await Invoice.findByIdAndUpdate(req.body.invoiceId, {
        $inc: { paidAmount: payment.amount },
      });
      const invoice = await Invoice.findById(req.body.invoiceId);
      if (invoice && invoice.paidAmount >= invoice.totalAmount) {
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
    const tenantId = req.user?.tenantId;
    const [totalAR, totalAP, accounts, recentEntries] = await Promise.all([
      Invoice.aggregate([
        { $match: { tenantId: tenantId as any, type: 'receivable', status: { $nin: ['paid', 'cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, paid: { $sum: '$paidAmount' } } },
      ]),
      Invoice.aggregate([
        { $match: { tenantId: tenantId as any, type: 'payable', status: { $nin: ['paid', 'cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, paid: { $sum: '$paidAmount' } } },
      ]),
      Account.aggregate([
        { $match: { tenantId: tenantId as any, isActive: true } },
        { $group: { _id: '$type', totalBalance: { $sum: '$balance' }, count: { $sum: 1 } } },
      ]),
      JournalEntry.find({ tenantId }).sort({ createdAt: -1 }).limit(5),
    ]);

    sendSuccess(res, {
      receivables: totalAR[0] || { total: 0, paid: 0 },
      payables: totalAP[0] || { total: 0, paid: 0 },
      accountsByType: accounts,
      recentEntries,
    });
  } catch (error: any) { sendError(res, error.message); }
};
