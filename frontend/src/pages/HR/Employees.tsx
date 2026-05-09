import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, Users as UsersIcon, UserCheck, UserMinus } from 'lucide-react';
import api from '../../services/api';

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/hr/employees');
        setEmployees(res.data.data);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Employee Directory</h1>
          <p className="text-muted">Manage workforce, departments, and roles</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> Add Employee
          </button>
        </div>
      </div>

      <div className="dashboard-grid mb-2">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Total Workforce</p>
              <h3 className="text-2xl font-bold text-main">124</h3>
            </div>
            <div className="p-2 rounded-lg bg-primary bg-opacity-10 text-primary">
              <UsersIcon size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Active Employees</p>
              <h3 className="text-2xl font-bold text-success">118</h3>
            </div>
            <div className="p-2 rounded-lg bg-success bg-opacity-10 text-success">
              <UserCheck size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">On Leave</p>
              <h3 className="text-2xl font-bold text-warning">6</h3>
            </div>
            <div className="p-2 rounded-lg bg-warning bg-opacity-10 text-warning">
              <UserMinus size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">All Employees</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search employees..." 
                className="input-field pl-9 py-1.5 text-sm w-64"
              />
            </div>
            <button className="btn btn-secondary py-1.5">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-light text-muted text-sm">
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Designation</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp: any) => (
                  <tr key={emp._id} className="border-b border-light last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-main">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-muted">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-muted">{emp.employeeId}</td>
                    <td className="py-3 text-sm">{emp.department}</td>
                    <td className="py-3 text-sm">{emp.designation}</td>
                    <td className="py-3 text-sm text-muted capitalize">{emp.employmentType.replace('-', ' ')}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'active' ? 'bg-success-bg text-success' : 
                        emp.status === 'on-leave' ? 'bg-warning-bg text-warning' : 'bg-danger-bg text-danger'
                      }`}>
                        {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
