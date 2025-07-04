"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DeploymentInfo {
  id: string;
  projectName: string;
  subdomain: string;
  framework: string;
  status: 'running' | 'stopped' | 'error' | 'building';
  url: string;
  uptime: string;
  lastUpdated: string;
  health: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    responseTime: number;
    lastCheck: string;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    diskUsed: number; // in GB
    diskLimit: number; // in GB (15GB max)
  };
  ssl: {
    enabled: boolean;
    expiresAt?: string;
  };
  logs?: string[];
}

export default function DeploymentsPage() {
  const [deploymentId, setDeploymentId] = useState("");
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!deploymentId.trim()) {
      setError("Please enter a deployment ID");
      return;
    }

    setLoading(true);
    setError("");
    setDeployment(null);

    try {
      const response = await fetch(`/api/deployments/${deploymentId}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? "Deployment not found" : "Failed to fetch deployment");
      }

      const data = await response.json();
      setDeployment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'stopped': return 'text-gray-500';
      case 'error': return 'text-red-500';
      case 'building': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <span className="w-5 h-5 text-green-500">✅</span>;
      case 'stopped': return <span className="w-5 h-5 text-gray-500">⏸️</span>;
      case 'error': return <span className="w-5 h-5 text-red-500">❌</span>;
      case 'building': return <span className="w-5 h-5 text-blue-500">🔄</span>;
      default: return <span className="w-5 h-5 text-gray-500">⚠️</span>;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Deployment Status
            </h1>
            <p className="text-xl text-secondary">
              Check the status and health of your deployments
            </p>
          </div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-background border border-white/10 rounded-lg p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="deploymentId" className="block text-sm font-medium mb-2">
                  Deployment ID
                </label>
                <input
                  id="deploymentId"
                  type="text"
                  value={deploymentId}
                  onChange={(e) => setDeploymentId(e.target.value)}
                  placeholder="Enter your deployment ID (e.g., abc123-def456-ghi789)"
                  className="w-full px-4 py-3 bg-background border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="w-5 h-5">🔄</span>
                    </motion.div>
                  ) : (
                    <span className="w-5 h-5">🔍</span>
                  )}
                  Check Status
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Deployment Info */}
          {deployment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="bg-background border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">🖥️</span>
                  Deployment Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-secondary">Project Name</label>
                    <p className="font-mono text-lg">{deployment.projectName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Framework</label>
                    <p className="font-mono text-lg capitalize">{deployment.framework}</p>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deployment.status)}
                      <span className={`font-mono text-lg capitalize ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Uptime</label>
                    <p className="font-mono text-lg">{deployment.uptime}</p>
                  </div>
                </div>
              </div>

              {/* URLs and Access */}
              <div className="bg-background border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">🌐</span>
                  Access Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary">Public URL</label>
                    <a 
                      href={deployment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono text-lg text-primary hover:underline block"
                    >
                      {deployment.url}
                    </a>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Subdomain</label>
                    <p className="font-mono text-lg">{deployment.subdomain}</p>
                  </div>
                </div>
              </div>

              {/* Health Status */}
              <div className="bg-background border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">💓</span>
                  Health Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-secondary">Health</label>
                    <p className={`font-mono text-lg capitalize ${getHealthColor(deployment.health.status)}`}>
                      {deployment.health.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Response Time</label>
                    <p className="font-mono text-lg">{deployment.health.responseTime}ms</p>
                  </div>
                  <div>
                    <label className="text-sm text-secondary">Last Check</label>
                    <p className="font-mono text-lg">{deployment.health.lastCheck}</p>
                  </div>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="bg-background border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">📊</span>
                  Resource Usage
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4">💻</span>
                      <label className="text-sm text-secondary">CPU Usage</label>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${deployment.resources.cpu}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">{deployment.resources.cpu}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4">🧠</span>
                      <label className="text-sm text-secondary">Memory Usage</label>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${deployment.resources.memory}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">{deployment.resources.memory}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-4 h-4">💾</span>
                      <label className="text-sm text-secondary">Disk Usage</label>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${deployment.resources.disk}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">
                      {deployment.resources.diskUsed?.toFixed(2) || 0}GB / {deployment.resources.diskLimit || 15}GB ({deployment.resources.disk}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-5 h-5">🛡️</span>
                  SSL Certificate
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary">SSL Status</label>
                    <div className="flex items-center gap-2">
                      {deployment.ssl.enabled ? (
                        <span className="w-5 h-5 text-green-500">✅</span>
                      ) : (
                        <span className="w-5 h-5 text-red-500">❌</span>
                      )}
                      <span className={`font-mono text-lg ${deployment.ssl.enabled ? 'text-green-500' : 'text-red-500'}`}>
                        {deployment.ssl.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  {deployment.ssl.enabled && deployment.ssl.expiresAt && (
                    <div>
                      <label className="text-sm text-secondary">Expires At</label>
                      <p className="font-mono text-lg">{deployment.ssl.expiresAt}</p>
                    </div>
                  )}
                </div>
              </div>

              {deployment.logs && deployment.logs.length > 0 && (
                <div className="bg-background border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
                  <div className="bg-black/50 rounded-md p-4 font-mono text-sm max-h-64 overflow-y-auto">
                    {deployment.logs.map((log, index) => (
                      <div key={index} className="text-gray-300 mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
