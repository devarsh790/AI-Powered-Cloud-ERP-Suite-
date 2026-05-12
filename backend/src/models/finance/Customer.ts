import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  status: 'active' | 'inactive' | 'prospect';
  billingAddress?: string;
  shippingAddress?: string;
  taxId?: string;
  creditLimit?: number;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    website: String,
    industry: String,
    status: { type: String, enum: ['active', 'inactive', 'prospect'], default: 'active' },
    billingAddress: String,
    shippingAddress: String,
    taxId: String,
    creditLimit: Number,
    outstandingBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CustomerSchema.index({ tenantId: 1, email: 1 });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
