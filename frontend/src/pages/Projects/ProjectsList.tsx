import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Filter, Download, Briefcase, Clock, CheckCircle2, ChartGantt, LayoutGrid } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MOCK_PROJECTS = [
  { _id: '1', projectCode: 'PRJ-001', name: 'Cloud Migration', description: 'Migrate legacy on-prem infrastructure to AWS with zero-downtime cutover', status: 'active', priority: 'critical', progress: 72, startDate: '2026-02-01', endDate: '2026-07-30', budget: { planned: 2500000, actual: 2850000 } },
  { _id: '2', projectCode: 'PRJ-002', name: 'ERP v3 Release', description: 'Next major ERP platform release with AI-powered forecasting and multi-tenancy', status: 'active', priority: 'high', progress: 45, startDate: '2026-03-15', endDate: '2026-09-30', budget: { planned: 1800000, actual: 810000 } },
  { _id: '3', projectCode: 'PRJ-003', name: 'Mobile App', description: 'Cross-platform mobile companion app with push notifications and offline sync', status: 'planning', priority: 'medium', progress: 12, startDate: '2026-06-01', endDate: '2026-12-31', budget: { planned: 950000, actual: 0 } },
  { _id: '4', projectCode: 'PRJ-004', name: 'Data Lake Platform', description: 'Centralized data analytics platform powered by Spark and Redshift', status: 'active', priority: 'high', progress: 88, startDate: '2026-01-10', endDate: '2026-06-15', budget: { planned: 1200000, actual: 1050000 } },
  { _id: '5', projectCode: 'PRJ-005', name: 'Security Hardening', description: 'SOC 2 Type II compliance, MFA enforcement, and zero-trust network architecture', status: 'completed', priority: 'critical', progress: 100, startDate: '2025-11-01', endDate: '2026-04-30', budget: { planned: 680000, actual: 660000 } },
  { _id: '6', projectCode: 'PRJ-006', name: 'Customer Portal', description: 'Self-service portal for clients with invoice payment and support ticket management', status: 'planning', priority: 'medium', progress: 5, startDate: '2026-07-01', endDate: '2027-01-31', budget: { planned: 1100000, actual: 0 } },
];

export const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects', { params: { limit: 100 } });
        const rows = res.data.data;
        if (Array.isArray(rows) && rows.length) setProjects(rows);
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const timeline = useMemo(() => {
    if (!projects.length) return { min: Date.now(), span: 1 };
    const starts = projects.map((p) => new Date(p.startDate).getTime());
    const ends = projects.map((p) => new Date(p.endDate).getTime());
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    return { min, span: Math.max(max - min, 86400000) };
  }, [projects]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Project <span className="text-primary">Portfolio</span></h1>
          <p className="text-muted">Manage projects, resources, and timelines</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex rounded-lg border border-light overflow-hidden">
            <button
              type="button"
              className={`btn btn-ghost rounded-none ${view === 'grid' ? 'bg-primary bg-opacity-10 text-primary' : ''}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={18} /> Grid
            </button>
            <button
              type="button"
              className={`btn btn-ghost rounded-none ${view === 'timeline' ? 'bg-primary bg-opacity-10 text-primary' : ''}`}
              onClick={() => setView('timeline')}
            >
              <ChartGantt size={18} /> Gantt
            </button>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => toast.success('Export downloaded successfully')}>
            <Download size={18} /> Export</button>
          <button type="button" className="btn btn-primary">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="dashboard-grid mb-2">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Active Projects</p>
              <h3 className="text-2xl font-bold text-main">{projects.filter((p: any) => p.status === 'active').length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-primary bg-opacity-10 text-primary">
              <Briefcase size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">In Planning</p>
              <h3 className="text-2xl font-bold text-warning">{projects.filter((p: any) => p.status === 'planning').length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-warning bg-opacity-10 text-warning">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-muted text-sm font-medium mb-1">Completed</p>
              <h3 className="text-2xl font-bold text-success">{projects.filter((p: any) => p.status === 'completed').length}</h3>
            </div>
            <div className="p-2 rounded-lg bg-success bg-opacity-10 text-success">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">All Projects</h3>
          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="input-field pl-9 py-1.5 text-sm w-64"
              />
            </div>
            <button className="btn btn-secondary py-1.5">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {view === 'timeline' && !loading && projects.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Timeline view (F-07): bars scaled between earliest start and latest end across the portfolio.
            </p>
            {projects.map((project) => {
              const s = new Date(project.startDate).getTime();
              const e = new Date(project.endDate).getTime();
              const left = ((s - timeline.min) / timeline.span) * 100;
              const width = Math.max(((e - s) / timeline.span) * 100, 4);
              const budget = project.budget;
              const overrun = budget?.planned > 0 && budget.actual > budget.planned * 1.1;
              return (
                <div key={project._id} className="relative">
                  <div className="flex justify-between text-xs mb-1 gap-2">
                    <span className="font-medium truncate">{project.name}</span>
                    {overrun && (
                      <span className="text-warning whitespace-nowrap">Budget +10% variance</span>
                    )}
                  </div>
                  <div className="h-9 bg-border-light rounded-lg relative overflow-hidden">
                    <div
                      className="absolute top-1 bottom-1 rounded-md bg-primary bg-opacity-90"
                      style={{ left: `${left}%`, width: `${width}%`, minWidth: 8 }}
                      title={`${project.projectCode}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-8 text-center text-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                Loading projects...
              </div>
            ) : projects.length > 0 ? (
              projects.map((project: any) => {
                const budget = project.budget;
                const overrun = budget?.planned > 0 && budget.actual > budget.planned * 1.1;
                return (
                  <div key={project._id} className="border border-light rounded-xl p-5 hover:shadow-md transition-shadow bg-surface">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'active'
                            ? 'bg-success-bg text-success'
                            : project.status === 'planning'
                              ? 'bg-info-bg text-info'
                              : 'bg-muted bg-opacity-10 text-muted'
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          project.priority === 'critical' || project.priority === 'high'
                            ? 'border-danger text-danger'
                            : 'border-light text-muted'
                        }`}
                      >
                        {project.priority.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-lg mb-1 truncate" title={project.name}>
                      {project.name}
                    </h4>
                    <p className="text-sm text-muted mb-4 line-clamp-2 h-10">{project.description}</p>
                    {overrun && (
                      <p className="text-xs text-warning mb-2 font-medium">Actual spend exceeds plan by 10%+ — review budget.</p>
                    )}

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="font-medium text-main">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-border-light rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-light pt-4 mt-auto">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-secondary text-[10px] text-white flex items-center justify-center border-2 border-white z-10"
                          >
                            U{i}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-muted">No projects found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
