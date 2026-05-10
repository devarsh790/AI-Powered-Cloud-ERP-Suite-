import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import env from '../config/env';
import Tenant from '../models/Tenant';
import User from '../models/User';
import Account from '../models/finance';
import { JournalEntry, Invoice } from '../models/finance';
import Employee, { Leave, Attendance, Payroll } from '../models/hr';
import { Vendor, PurchaseOrder, InventoryItem } from '../models/supplyChain';
import Project, { Task } from '../models/project';
import Notification from '../models/Notification';
import AuditLog from '../models/AuditLog';

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB. Seeding...');

  // Clear all
  await Promise.all([
    Tenant.deleteMany({}), User.deleteMany({}), Account.deleteMany({}),
    JournalEntry.deleteMany({}), Invoice.deleteMany({}),
    Employee.deleteMany({}), Leave.deleteMany({}), Attendance.deleteMany({}), Payroll.deleteMany({}),
    Vendor.deleteMany({}), PurchaseOrder.deleteMany({}), InventoryItem.deleteMany({}),
    Project.deleteMany({}), Task.deleteMany({}), Notification.deleteMany({}), AuditLog.deleteMany({}),
  ]);

  // Create tenant
  const tenant = await Tenant.create({
    name: 'Amdox Technologies', slug: 'amdox',
    settings: { currency: 'INR', timezone: 'Asia/Kolkata', dateFormat: 'DD/MM/YYYY', fiscalYearStart: 4 },
    subscription: { plan: 'enterprise', status: 'active' },
  });
  const tid = tenant._id;

  // Create users
  const admin = await User.create({
    tenantId: tid, email: 'admin@amdox.com', password: 'Admin@123',
    firstName: 'Sarah', lastName: 'Chen', role: 'TenantAdmin', department: 'Management',
  });
  const manager = await User.create({
    tenantId: tid, email: 'manager@amdox.com', password: 'Manager@123',
    firstName: 'James', lastName: 'Wilson', role: 'Manager', department: 'Finance',
  });
  await User.create({
    tenantId: tid, email: 'viewer@amdox.com', password: 'Viewer@123',
    firstName: 'Emily', lastName: 'Davis', role: 'Viewer', department: 'HR',
  });

  // Chart of Accounts
  const accts = await Account.insertMany([
    { tenantId: tid, code: '1000', name: 'Cash', type: 'asset', balance: 250000 },
    { tenantId: tid, code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 85000 },
    { tenantId: tid, code: '1200', name: 'Inventory', type: 'asset', balance: 120000 },
    { tenantId: tid, code: '1500', name: 'Equipment', type: 'asset', balance: 75000 },
    { tenantId: tid, code: '2000', name: 'Accounts Payable', type: 'liability', balance: 45000 },
    { tenantId: tid, code: '2100', name: 'Accrued Expenses', type: 'liability', balance: 15000 },
    { tenantId: tid, code: '3000', name: 'Common Stock', type: 'equity', balance: 200000 },
    { tenantId: tid, code: '3100', name: 'Retained Earnings', type: 'equity', balance: 170000 },
    { tenantId: tid, code: '4000', name: 'Sales Revenue', type: 'revenue', balance: 450000 },
    { tenantId: tid, code: '4100', name: 'Service Revenue', type: 'revenue', balance: 120000 },
    { tenantId: tid, code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 180000 },
    { tenantId: tid, code: '5100', name: 'Salaries Expense', type: 'expense', balance: 95000 },
    { tenantId: tid, code: '5200', name: 'Rent Expense', type: 'expense', balance: 24000 },
    { tenantId: tid, code: '5300', name: 'Utilities Expense', type: 'expense', balance: 8000 },
  ]);

  // Journal Entries
  await JournalEntry.insertMany([
    { tenantId: tid, entryNumber: 'JE-00001', date: new Date('2026-01-15'), description: 'Monthly salary payment', lines: [{ accountId: accts[11]._id, accountCode: '5100', accountName: 'Salaries Expense', debit: 15000, credit: 0 }, { accountId: accts[0]._id, accountCode: '1000', accountName: 'Cash', debit: 0, credit: 15000 }], totalDebit: 15000, totalCredit: 15000, status: 'posted', postedBy: admin._id, postedAt: new Date() },
    { tenantId: tid, entryNumber: 'JE-00002', date: new Date('2026-02-01'), description: 'Client payment received', lines: [{ accountId: accts[0]._id, accountCode: '1000', accountName: 'Cash', debit: 25000, credit: 0 }, { accountId: accts[1]._id, accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: 25000 }], totalDebit: 25000, totalCredit: 25000, status: 'posted', postedBy: admin._id, postedAt: new Date() },
    { tenantId: tid, entryNumber: 'JE-00003', date: new Date('2026-03-10'), description: 'Equipment purchase', lines: [{ accountId: accts[3]._id, accountCode: '1500', accountName: 'Equipment', debit: 12000, credit: 0 }, { accountId: accts[0]._id, accountCode: '1000', accountName: 'Cash', debit: 0, credit: 12000 }], totalDebit: 12000, totalCredit: 12000, status: 'posted', postedBy: manager._id, postedAt: new Date() },
  ]);

  // Invoices
  await Invoice.insertMany([
    { tenantId: tid, invoiceNumber: 'AR-00001', type: 'receivable', vendorOrCustomer: 'Acme Corp', date: new Date('2026-01-10'), dueDate: new Date('2026-02-10'), items: [{ description: 'ERP Implementation', quantity: 1, unitPrice: 50000, taxRate: 10, amount: 55000 }], subtotal: 50000, taxAmount: 5000, totalAmount: 55000, paidAmount: 55000, status: 'paid', createdBy: admin._id },
    { tenantId: tid, invoiceNumber: 'AR-00002', type: 'receivable', vendorOrCustomer: 'TechStart Inc', date: new Date('2026-03-01'), dueDate: new Date('2026-04-01'), items: [{ description: 'Cloud Migration', quantity: 1, unitPrice: 35000, taxRate: 10, amount: 38500 }], subtotal: 35000, taxAmount: 3500, totalAmount: 38500, paidAmount: 0, status: 'pending', createdBy: admin._id },
    { tenantId: tid, invoiceNumber: 'AP-00001', type: 'payable', vendorOrCustomer: 'AWS Services', date: new Date('2026-02-15'), dueDate: new Date('2026-03-15'), items: [{ description: 'Cloud hosting Q1', quantity: 3, unitPrice: 4500, taxRate: 0, amount: 13500 }], subtotal: 13500, taxAmount: 0, totalAmount: 13500, paidAmount: 13500, status: 'paid', createdBy: manager._id },
    { tenantId: tid, invoiceNumber: 'AP-00002', type: 'payable', vendorOrCustomer: 'Office Supplies Co', date: new Date('2026-04-01'), dueDate: new Date('2026-05-01'), items: [{ description: 'Office furniture', quantity: 10, unitPrice: 850, taxRate: 8, amount: 9180 }], subtotal: 8500, taxAmount: 680, totalAmount: 9180, paidAmount: 0, status: 'pending', createdBy: manager._id },
  ]);

  // Employees
  const depts = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations', 'Sales'];
  const empData = [
    { firstName: 'Arjun', lastName: 'Mehta', dept: 'Engineering', desig: 'Senior Developer', salary: { basic: 80000, hra: 32000, da: 16000, special: 22000, gross: 150000, currency: 'INR' } },
    { firstName: 'Priya', lastName: 'Sharma', dept: 'Engineering', desig: 'Tech Lead', salary: { basic: 100000, hra: 40000, da: 20000, special: 40000, gross: 200000, currency: 'INR' } },
    { firstName: 'Rahul', lastName: 'Varma', dept: 'Finance', desig: 'Financial Analyst', salary: { basic: 70000, hra: 28000, da: 14000, special: 18000, gross: 130000, currency: 'INR' } },
    { firstName: 'Anjali', lastName: 'Nair', dept: 'HR', desig: 'HR Manager', salary: { basic: 75000, hra: 30000, da: 15000, special: 20000, gross: 140000, currency: 'INR' } },
    { firstName: 'Vikram', lastName: 'Singh', dept: 'Marketing', desig: 'Marketing Director', salary: { basic: 90000, hra: 36000, da: 18000, special: 26000, gross: 170000, currency: 'INR' } },
    { firstName: 'Kavita', lastName: 'Patel', dept: 'Operations', desig: 'Operations Manager', salary: { basic: 85000, hra: 34000, da: 17000, special: 24000, gross: 160000, currency: 'INR' } },
    { firstName: 'Michael', lastName: 'Fernandes', dept: 'Sales', desig: 'Sales Director', salary: { basic: 95000, hra: 38000, da: 19000, special: 28000, gross: 180000, currency: 'INR' } },
    { firstName: 'Sneha', lastName: 'Gupta', dept: 'Engineering', desig: 'Frontend Developer', salary: { basic: 70000, hra: 28000, da: 14000, special: 18000, gross: 130000, currency: 'INR' } },
    { firstName: 'Amit', lastName: 'Jain', dept: 'Engineering', desig: 'Fullstack Developer', salary: { basic: 75000, hra: 30000, da: 15000, special: 20000, gross: 140000, currency: 'INR' } },
    { firstName: 'Pooja', lastName: 'Iyer', dept: 'Finance', desig: 'Accounts Head', salary: { basic: 120000, hra: 48000, da: 24000, special: 38000, gross: 230000, currency: 'INR' } },
  ];

  const employees = [];
  for (let i = 0; i < empData.length; i++) {
    const e = empData[i];
    const emp = await Employee.create({
      tenantId: tid, employeeId: `EMP-${String(i + 1).padStart(4, '0')}`,
      firstName: e.firstName, lastName: e.lastName, email: `${e.firstName.toLowerCase()}@amdox.com`,
      department: e.dept, designation: e.desig, dateOfJoining: new Date('2024-01-15'),
      employmentType: 'full-time', salary: e.salary, status: 'active',
    });
    employees.push(emp);
  }

  // Leave records
  await Leave.insertMany([
    { tenantId: tid, employeeId: employees[0]._id, type: 'annual', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-05'), days: 5, reason: 'Family vacation', status: 'approved', approvedBy: admin._id },
    { tenantId: tid, employeeId: employees[2]._id, type: 'sick', startDate: new Date('2026-05-10'), endDate: new Date('2026-05-11'), days: 2, reason: 'Medical appointment', status: 'pending' },
    { tenantId: tid, employeeId: employees[4]._id, type: 'casual', startDate: new Date('2026-05-15'), endDate: new Date('2026-05-15'), days: 1, reason: 'Personal errands', status: 'pending' },
  ]);

  // Vendors
  const vendors = await Vendor.insertMany([
    { tenantId: tid, vendorCode: 'VEN-0001', name: 'Reliance Digital', email: 'sales@reliance.com', contactPerson: 'John Smith', paymentTerms: 'Net 30', rating: 4.5, status: 'active', totalOrders: 12, totalSpent: 7800000 },
    { tenantId: tid, vendorCode: 'VEN-0002', name: 'Tata Communications', email: 'orders@tata.com', contactPerson: 'Amy Chen', paymentTerms: 'Net 45', rating: 4.2, status: 'active', totalOrders: 8, totalSpent: 4500000 },
    { tenantId: tid, vendorCode: 'VEN-0003', name: 'Infosys BPM', email: 'procurement@infosys.com', contactPerson: 'Mark Johnson', paymentTerms: 'Net 30', rating: 3.8, status: 'active', totalOrders: 5, totalSpent: 3200000 },
  ]);

  // Inventory items
  await InventoryItem.insertMany([
    { tenantId: tid, sku: 'SRV-001', name: 'Server Rack Unit', category: 'Hardware', unit: 'pcs', currentStock: 15, reorderLevel: 5, reorderQty: 20, costPrice: 2500, sellingPrice: 3500, warehouseLocation: 'A1-01', status: 'in-stock' },
    { tenantId: tid, sku: 'NET-001', name: 'Network Switch 48-Port', category: 'Networking', unit: 'pcs', currentStock: 3, reorderLevel: 5, reorderQty: 10, costPrice: 800, sellingPrice: 1200, warehouseLocation: 'B2-03', status: 'low-stock' },
    { tenantId: tid, sku: 'CAB-001', name: 'Cat6 Ethernet Cable (100m)', category: 'Cables', unit: 'rolls', currentStock: 50, reorderLevel: 20, reorderQty: 100, costPrice: 45, sellingPrice: 75, warehouseLocation: 'C3-01', status: 'in-stock' },
    { tenantId: tid, sku: 'SSD-001', name: 'Enterprise SSD 1TB', category: 'Storage', unit: 'pcs', currentStock: 0, reorderLevel: 10, reorderQty: 30, costPrice: 150, sellingPrice: 250, warehouseLocation: 'A2-05', status: 'out-of-stock' },
    { tenantId: tid, sku: 'MON-001', name: '27" 4K Monitor', category: 'Peripherals', unit: 'pcs', currentStock: 22, reorderLevel: 5, reorderQty: 15, costPrice: 350, sellingPrice: 550, warehouseLocation: 'D1-02', status: 'in-stock' },
  ]);

  // Projects
  const proj1 = await Project.create({
    tenantId: tid, projectCode: 'PRJ-0001', name: 'ERP Platform v2.0',
    description: 'Next-gen enterprise resource planning platform with AI capabilities',
    client: 'Internal', managerId: employees[1]._id,
    startDate: new Date('2026-01-01'), endDate: new Date('2026-06-30'),
    budget: { planned: 2500000, actual: 1450000, currency: 'INR' },
    status: 'active', priority: 'critical', progress: 62,
    teamMembers: [employees[0]._id, employees[7]._id],
    milestones: [
      { name: 'Architecture Design', dueDate: new Date('2026-01-15'), completed: true, completedAt: new Date('2026-01-14') },
      { name: 'Core Backend', dueDate: new Date('2026-03-01'), completed: true, completedAt: new Date('2026-02-28') },
      { name: 'Frontend Development', dueDate: new Date('2026-04-15'), completed: true, completedAt: new Date('2026-04-10') },
      { name: 'Testing & QA', dueDate: new Date('2026-05-30'), completed: false },
      { name: 'Production Release', dueDate: new Date('2026-06-30'), completed: false },
    ],
  });

  const proj2 = await Project.create({
    tenantId: tid, projectCode: 'PRJ-0002', name: 'Mobile App Launch',
    description: 'React Native mobile app for field operations',
    client: 'Internal', managerId: employees[5]._id,
    startDate: new Date('2026-03-01'), endDate: new Date('2026-09-30'),
    budget: { planned: 1800000, actual: 420000, currency: 'INR' },
    status: 'active', priority: 'high', progress: 28,
    teamMembers: [employees[0]._id, employees[7]._id],
    milestones: [
      { name: 'Design System', dueDate: new Date('2026-03-30'), completed: true, completedAt: new Date('2026-03-28') },
      { name: 'MVP Build', dueDate: new Date('2026-06-15'), completed: false },
      { name: 'Beta Release', dueDate: new Date('2026-08-01'), completed: false },
    ],
  });

  await Project.create({
    tenantId: tid, projectCode: 'PRJ-0003', name: 'Data Analytics Pipeline',
    description: 'Real-time BI and analytics data pipeline',
    client: 'Internal', managerId: employees[2]._id,
    startDate: new Date('2026-04-01'), endDate: new Date('2026-08-31'),
    budget: { planned: 95000, actual: 12000, currency: 'USD' },
    status: 'planning', priority: 'medium', progress: 5,
    teamMembers: [employees[0]._id],
  });

  // Tasks for project 1
  await Task.insertMany([
    { tenantId: tid, projectId: proj1._id, title: 'Set up CI/CD pipeline', assigneeId: employees[0]._id, startDate: new Date('2026-01-05'), dueDate: new Date('2026-01-10'), status: 'done', priority: 'high', estimatedHours: 16, actualHours: 14, order: 1 },
    { tenantId: tid, projectId: proj1._id, title: 'Design database schema', assigneeId: employees[1]._id, startDate: new Date('2026-01-08'), dueDate: new Date('2026-01-15'), status: 'done', priority: 'critical', estimatedHours: 24, actualHours: 20, order: 2 },
    { tenantId: tid, projectId: proj1._id, title: 'Implement auth module', assigneeId: employees[0]._id, startDate: new Date('2026-01-16'), dueDate: new Date('2026-01-25'), status: 'done', priority: 'high', estimatedHours: 32, actualHours: 30, order: 3 },
    { tenantId: tid, projectId: proj1._id, title: 'Build finance module', assigneeId: employees[7]._id, startDate: new Date('2026-02-01'), dueDate: new Date('2026-03-01'), status: 'done', priority: 'high', estimatedHours: 80, actualHours: 85, order: 4 },
    { tenantId: tid, projectId: proj1._id, title: 'Build HR module', assigneeId: employees[0]._id, startDate: new Date('2026-03-01'), dueDate: new Date('2026-04-01'), status: 'in-progress', priority: 'medium', estimatedHours: 60, actualHours: 45, order: 5 },
    { tenantId: tid, projectId: proj1._id, title: 'Integration testing', assigneeId: employees[1]._id, startDate: new Date('2026-05-01'), dueDate: new Date('2026-05-30'), status: 'todo', priority: 'high', estimatedHours: 40, actualHours: 0, order: 6 },
    { tenantId: tid, projectId: proj1._id, title: 'Performance optimization', assigneeId: employees[0]._id, dueDate: new Date('2026-06-15'), status: 'todo', priority: 'medium', estimatedHours: 24, actualHours: 0, order: 7 },
  ]);

  const auditRows: Array<Record<string, unknown>> = [];
  let prevHash: string | undefined;
  const pushAudit = (action: string, module: string, details: Record<string, unknown>) => {
    const at = new Date();
    const payload = `${prevHash || 'genesis'}|${tid}|${action}|${module}|${at.toISOString()}`;
    const entryHash = crypto.createHash('sha256').update(payload).digest('hex');
    auditRows.push({
      tenantId: tid,
      actorId: admin._id,
      actorEmail: admin.email,
      action,
      module,
      details,
      prevHash,
      entryHash,
      createdAt: at,
    });
    prevHash = entryHash;
  };
  pushAudit('tenant.seed', 'system', { message: 'Database seeded' });
  pushAudit('user.login', 'auth', { email: admin.email });
  pushAudit('journal.post', 'finance', { entryNumber: 'JE-00001' });
  pushAudit('invoice.create', 'finance', { invoiceNumber: 'AR-00002' });
  pushAudit('inventory.adjust', 'supply_chain', { sku: 'NET-SW-48' });
  await AuditLog.insertMany(auditRows);

  // Notifications
  await Notification.insertMany([
    { tenantId: tid, userId: admin._id, title: 'New leave request', message: 'David Kim has requested 2 days sick leave', type: 'info', module: 'HR', link: '/hr/leaves', isRead: false },
    { tenantId: tid, userId: admin._id, title: 'Low stock alert', message: 'Network Switch 48-Port is below reorder level', type: 'warning', module: 'Supply Chain', link: '/supply-chain/inventory', isRead: false },
    { tenantId: tid, userId: admin._id, title: 'Invoice overdue', message: 'AR-00002 from TechStart Inc is past due date', type: 'error', module: 'Finance', link: '/finance/receivables', isRead: false },
    { tenantId: tid, userId: admin._id, title: 'Project milestone completed', message: 'Frontend Development milestone completed for ERP Platform v2.0', type: 'success', module: 'Projects', link: '/projects', isRead: true },
    { tenantId: tid, userId: admin._id, title: 'Payroll processed', message: 'April 2026 payroll has been processed for 8 employees', type: 'success', module: 'HR', link: '/hr/payroll', isRead: true },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📧 Login Credentials:');
  console.log('  Admin: admin@amdox.com / Admin@123');
  console.log('  Manager: manager@amdox.com / Manager@123');
  console.log('  Viewer: viewer@amdox.com / Viewer@123');
  process.exit(0);
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
