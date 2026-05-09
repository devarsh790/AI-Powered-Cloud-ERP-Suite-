import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
    fiscalYearStart: number;
  };
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiresAt?: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    domain: { type: String },
    logo: { type: String },
    settings: {
      currency: { type: String, default: 'USD' },
      timezone: { type: String, default: 'UTC' },
      dateFormat: { type: String, default: 'YYYY-MM-DD' },
      fiscalYearStart: { type: Number, default: 1 },
    },
    subscription: {
      plan: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' },
      status: { type: String, enum: ['active', 'suspended', 'cancelled'], default: 'active' },
      expiresAt: { type: Date },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITenant>('Tenant', TenantSchema);
