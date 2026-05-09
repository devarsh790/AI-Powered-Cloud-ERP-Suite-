import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: { street: string; city: string; state: string; zip: string; country: string };
  department: string;
  designation: string;
  reportingTo?: mongoose.Types.ObjectId;
  dateOfJoining: Date;
  dateOfLeaving?: Date;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  salary: { basic: number; hra: number; da: number; special: number; gross: number; currency: string };
  bankDetails?: { bankName: string; accountNumber: string; ifsc: string };
  status: 'active' | 'inactive' | 'terminated' | 'on-leave';
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    address: {
      street: String, city: String, state: String, zip: String, country: String,
    },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    reportingTo: { type: Schema.Types.ObjectId, ref: 'Employee' },
    dateOfJoining: { type: Date, required: true },
    dateOfLeaving: { type: Date },
    employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'], default: 'full-time' },
    salary: {
      basic: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      da: { type: Number, default: 0 },
      special: { type: Number, default: 0 },
      gross: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    bankDetails: {
      bankName: String, accountNumber: String, ifsc: String,
    },
    status: { type: String, enum: ['active', 'inactive', 'terminated', 'on-leave'], default: 'active' },
  },
  { timestamps: true }
);

EmployeeSchema.index({ tenantId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);

// Leave
export interface ILeave extends Document {
  tenantId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  type: 'annual' | 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: mongoose.Types.ObjectId;
}

const LeaveSchema = new Schema<ILeave>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: { type: String, enum: ['annual', 'sick', 'casual', 'maternity', 'paternity', 'unpaid'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Leave = mongoose.model<ILeave>('Leave', LeaveSchema);

// Attendance
export interface IAttendance extends Document {
  tenantId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  hoursWorked: number;
  overtime: number;
  status: 'present' | 'absent' | 'half-day' | 'weekend' | 'holiday';
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    clockIn: { type: Date },
    clockOut: { type: Date },
    hoursWorked: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    status: { type: String, enum: ['present', 'absent', 'half-day', 'weekend', 'holiday'], default: 'present' },
  },
  { timestamps: true }
);

AttendanceSchema.index({ tenantId: 1, employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);

// Payroll
export interface IPayroll extends Document {
  tenantId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicPay: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossPay: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  paidOn?: Date;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    basicPay: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    grossPay: { type: Number, required: true },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'processed', 'paid', 'cancelled'], default: 'draft' },
    paidOn: { type: Date },
  },
  { timestamps: true }
);

PayrollSchema.index({ tenantId: 1, employeeId: 1, month: 1, year: 1 }, { unique: true });

export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);
