import mongoose, { Schema, Document } from 'mongoose';

export interface ILineItem {
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  total: number;
}

export interface IInvoice extends Document {
  tenantId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  lineItems: ILineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  notes?: string;
  terms?: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema<ILineItem>(
  {
    itemId: String,
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      index: true,
    },
    lineItems: [LineItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, required: true, default: 0 },
    notes: String,
    terms: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

InvoiceSchema.index({ tenantId: 1, status: 1 });
InvoiceSchema.index({ tenantId: 1, dueDate: 1 });
InvoiceSchema.index({ tenantId: 1, createdAt: -1 });

// Avoid OverwriteModelError in watch/dev by reusing existing model if compiled
const InvoiceModel = (mongoose.models && (mongoose.models as any).Invoice)
  ? (mongoose.models as any).Invoice as mongoose.Model<IInvoice>
  : mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default InvoiceModel;
