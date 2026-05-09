import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import * as fc from './financeController';

const router = Router();

router.use(authenticate);

// Chart of Accounts
router.get('/accounts', fc.getAccounts);
router.post('/accounts', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.createAccount);
router.put('/accounts/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.updateAccount);

// Journal Entries
router.get('/journal-entries', fc.getJournalEntries);
router.post('/journal-entries', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.createJournalEntry);
router.post('/journal-entries/:id/post', authorize('SuperAdmin', 'TenantAdmin'), fc.postJournalEntry);

// Invoices
router.get('/invoices', fc.getInvoices);
router.post('/invoices', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.createInvoice);
router.put('/invoices/:id', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.updateInvoice);
router.delete('/invoices/:id', authorize('SuperAdmin', 'TenantAdmin'), fc.deleteInvoice);

// Payments
router.get('/payments', fc.getPayments);
router.post('/payments', authorize('SuperAdmin', 'TenantAdmin', 'Manager'), fc.createPayment);

// Summary
router.get('/summary', fc.getFinanceSummary);

export default router;
