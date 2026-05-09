import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  tenantId: mongoose.Types.ObjectId;
  vendorCode: string;
  name: string;
  email: string;
  phone?: string;
  address?: { street: string; city: string; state: string; zip: string; country: string };
  contactPerson?: string;
  paymentTerms: string;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  totalOrders: number;
  totalSpent: number;
}

const VendorSchema = new Schema<IVendor>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    vendorCode: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { street: String, city: String, state: String, zip: String, country: String },
    contactPerson: { type: String },
    paymentTerms: { type: String, default: 'Net 30' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['active', 'inactive', 'blacklisted'], default: 'active' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VendorSchema.index({ tenantId: 1, vendorCode: 1 }, { unique: true });

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);

// Purchase Order
export interface IPurchaseOrder extends Document {
  tenantId: mongoose.Types.ObjectId;
  poNumber: string;
  vendorId: mongoose.Types.ObjectId;
  items: {
    inventoryItemId?: mongoose.Types.ObjectId;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    receivedQty: number;
  }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'draft' | 'submitted' | 'approved' | 'partially_received' | 'received' | 'cancelled';
  approvedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    poNumber: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [
      {
        inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
        receivedQty: { type: Number, default: 0 },
      },
    ],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    orderDate: { type: Date, required: true },
    expectedDelivery: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'submitted', 'approved', 'partially_received', 'received', 'cancelled'], default: 'draft' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

PurchaseOrderSchema.index({ tenantId: 1, poNumber: 1 }, { unique: true });

export const PurchaseOrder = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);

// Inventory Item
export interface IInventoryItem extends Document {
  tenantId: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  reorderQty: number;
  costPrice: number;
  sellingPrice: number;
  warehouseLocation?: string;
  lastRestocked?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, default: 'pcs' },
    currentStock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    reorderQty: { type: Number, default: 50 },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    warehouseLocation: { type: String },
    lastRestocked: { type: Date },
    status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], default: 'in-stock' },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
