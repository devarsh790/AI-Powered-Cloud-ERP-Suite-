import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  getInvoices,
  getInvoiceDetail,
  createInvoice,
  updateInvoice,
  sendInvoice,
  recordPayment,
  deleteInvoice,
} from './invoiceController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Invoices list and creation
router.get('/', getInvoices);
router.post('/', createInvoice);

// Individual invoice operations
router.get('/:id', getInvoiceDetail);
router.patch('/:id', updateInvoice);
router.post('/:id/send', sendInvoice);
router.post('/:id/payment', recordPayment);
router.delete('/:id', deleteInvoice);

export default router;
