import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  tenantId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subType?: string;
  parentId?: mongoose.Types.ObjectId;
  currency: string;
  balance: number;
  isActive: boolean;
  description?: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['asset', 'liability', 'equity', 'revenue', 'expense'], required: true },
    subType: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: 'Account' },
    currency: { type: String, default: 'USD' },
    balance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

AccountSchema.index({ tenantId: 1, code: 1 }, { unique: true });

export default mongoose.model<IAccount>('Account', AccountSchema);

// Journal Entry
export interface IJournalEntry extends Document {
  tenantId: mongoose.Types.ObjectId;
  entryNumber: string;
  date: Date;
  description: string;
  lines: {
    accountId: mongoose.Types.ObjectId;
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
    description?: string;
  }[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  postedBy?: mongoose.Types.ObjectId;
  postedAt?: Date;
  reference?: string;
  periodLocked: boolean;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    entryNumber: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    lines: [
      {
        accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
        accountCode: { type: String, required: true },
        accountName: { type: String, required: true },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        description: { type: String },
      },
    ],
    totalDebit: { type: Number, required: true },
    totalCredit: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'posted', 'reversed'], default: 'draft' },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    postedAt: { type: Date },
    reference: { type: String },
    periodLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

JournalEntrySchema.index({ tenantId: 1, entryNumber: 1 }, { unique: true });

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

// Invoice (AP & AR)
export interface IInvoice extends Document {
  tenantId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  type: 'payable' | 'receivable';
  vendorOrCustomer: string;
  contactEmail?: string;
  date: Date;
  dueDate: Date;
  currency: string;
  exchangeRate: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    amount: number;
  }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  purchaseOrderId?: mongoose.Types.ObjectId;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    invoiceNumber: { type: String, required: true },
    type: { type: String, enum: ['payable', 'receivable'], required: true },
    vendorOrCustomer: { type: String, required: true },
    contactEmail: { type: String },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    currency: { type: String, default: 'USD' },
    exchangeRate: { type: Number, default: 1 },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        taxRate: { type: Number, default: 0 },
        amount: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'pending', 'approved', 'paid', 'overdue', 'cancelled'], default: 'draft' },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

InvoiceSchema.index({ tenantId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ tenantId: 1, type: 1, status: 1 });

export const Invoice = (mongoose.models && (mongoose.models as any).Invoice)
  ? (mongoose.models as any).Invoice as mongoose.Model<IInvoice>
  : mongoose.model<IInvoice>('Invoice', InvoiceSchema);

// Payment
export interface IPayment extends Document {
  tenantId: mongoose.Types.ObjectId;
  paymentNumber: string;
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'bank_transfer' | 'check' | 'card' | 'cash' | 'wire';
  date: Date;
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedBy: mongoose.Types.ObjectId;
}

const PaymentSchema = new Schema<IPayment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    paymentNumber: { type: String, required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, enum: ['bank_transfer', 'check', 'card', 'cash', 'wire'], required: true },
    date: { type: Date, required: true },
    reference: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Payment = (mongoose.models && (mongoose.models as any).Payment)
  ? (mongoose.models as any).Payment as mongoose.Model<IPayment>
  : mongoose.model<IPayment>('Payment', PaymentSchema);
