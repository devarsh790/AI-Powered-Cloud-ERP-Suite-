import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  tenantId: mongoose.Types.ObjectId;
  projectCode: string;
  name: string;
  description?: string;
  client?: string;
  managerId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  budget: { planned: number; actual: number; currency: string };
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  teamMembers: mongoose.Types.ObjectId[];
  milestones: { name: string; dueDate: Date; completed: boolean; completedAt?: Date }[];
}

const ProjectSchema = new Schema<IProject>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    projectCode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    client: { type: String },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: {
      planned: { type: Number, default: 0 },
      actual: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    status: { type: String, enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'], default: 'planning' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    milestones: [
      {
        name: { type: String, required: true },
        dueDate: { type: Date, required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

ProjectSchema.index({ tenantId: 1, projectCode: 1 }, { unique: true });

export default mongoose.model<IProject>('Project', ProjectSchema);

// Task
export interface ITask extends Document {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assigneeId?: mongoose.Types.ObjectId;
  startDate?: Date;
  dueDate?: Date;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours: number;
  dependencies: mongoose.Types.ObjectId[];
  order: number;
}

const TaskSchema = new Schema<ITask>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
    startDate: { type: Date },
    dueDate: { type: Date },
    status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TaskSchema.index({ tenantId: 1, projectId: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
