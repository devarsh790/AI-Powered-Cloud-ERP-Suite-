import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, Briefcase, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.data.data || res.data.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Project Portfolio</h1>
          <p className="text-muted">Manage projects, resources, and timelines</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-8 text-center text-muted">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading projects...
            </div>
          ) : projects.length > 0 ? (
            projects.map((project: any) => (
              <div key={project._id} className="border border-light rounded-xl p-5 hover:shadow-md transition-shadow bg-surface">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-success-bg text-success' : 
                    project.status === 'planning' ? 'bg-info-bg text-info' : 'bg-muted bg-opacity-10 text-muted'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    project.priority === 'critical' || project.priority === 'high' ? 'border-danger text-danger' : 
                    'border-light text-muted'
                  }`}>
                    {project.priority.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-semibold text-lg mb-1 truncate" title={project.name}>{project.name}</h4>
                <p className="text-sm text-muted mb-4 line-clamp-2 h-10">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium text-main">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-border-light rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-light pt-4 mt-auto">
                  <div className="flex -space-x-2">
                    {/* Mock team avatars */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-secondary text-[10px] text-white flex items-center justify-center border-2 border-white z-10">
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
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted">
              No projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
