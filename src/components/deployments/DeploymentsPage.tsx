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
    issuer?: string;
    daysUntilExpiry?: number;
    certificate?: string;
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
      case 'running': 
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'stopped': 
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error': 
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'building': 
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default: 
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
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
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Resource Usage
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  SSL Certificate
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary">SSL Status</label>
                    <div className="flex items-center gap-2">
                      {deployment.ssl.enabled ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`font-mono text-lg ${deployment.ssl.enabled ? 'text-green-500' : 'text-red-500'}`}>
                        {deployment.ssl.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  {deployment.ssl.enabled && deployment.ssl.expiresAt && (
                    <div>
                      <label className="text-sm text-secondary">Expires At</label>
                      <div className="flex items-center gap-2">
                        {deployment.ssl.daysUntilExpiry !== undefined && (
                          <>
                            {deployment.ssl.daysUntilExpiry < 30 ? (
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            ) : deployment.ssl.daysUntilExpiry < 60 ? (
                              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </>
                        )}
                        <p className={`font-mono text-sm ${
                          deployment.ssl.daysUntilExpiry !== undefined && deployment.ssl.daysUntilExpiry < 30 ? 'text-red-500' :
                          deployment.ssl.daysUntilExpiry !== undefined && deployment.ssl.daysUntilExpiry < 60 ? 'text-yellow-500' : 
                          'text-gray-300'
                        }`}>
                          {new Date(deployment.ssl.expiresAt).toLocaleDateString()}
                          {deployment.ssl.daysUntilExpiry !== undefined && (
                            <span className="block text-xs">
                              {deployment.ssl.daysUntilExpiry > 0 
                                ? `${deployment.ssl.daysUntilExpiry} days remaining`
                                : `Expired ${Math.abs(deployment.ssl.daysUntilExpiry)} days ago`
                              }
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {deployment.ssl.enabled && deployment.ssl.issuer && (
                    <div className="md:col-span-2">
                      <label className="text-sm text-secondary">Certificate Issuer</label>
                      <p className="font-mono text-sm text-gray-300">{deployment.ssl.issuer}</p>
                    </div>
                  )}
                  
                  {deployment.ssl.enabled && deployment.ssl.certificate && deployment.ssl.certificate !== 'SSL working but certificate details unavailable' && (
                    <div className="md:col-span-2">
                      <label className="text-sm text-secondary">Certificate Path</label>
                      <p className="font-mono text-xs text-gray-400 break-all">{deployment.ssl.certificate}</p>
                    </div>
                  )}
                </div>
              </div>

              {deployment.logs && deployment.logs.length > 0 && (
                <div className="bg-background border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Recent Logs
                  </h2>
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
