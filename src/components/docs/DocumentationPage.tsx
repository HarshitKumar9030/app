"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ErrorResponse {
  code: number;
  message: string;
}

interface EndpointData {
  method: string;
  endpoint: string;
  title: string;
  description: string;
  requestExample?: Record<string, unknown>;
  responseExample: Record<string, unknown>;
  headers?: Record<string, string>;
  errors?: ErrorResponse[];
}

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'deployments', title: 'Deployments', icon: '📦' },
    { id: 'subdomains', title: 'Subdomains', icon: '🌐' },
    { id: 'health', title: 'Health Check', icon: '💚' },
    { id: 'errors', title: 'Error Handling', icon: '⚠️' }
  ];

  const authEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/auth/signup',
      title: 'Create Account',
      description: 'Register a new user account and receive an API key for CLI access.',
      requestExample: {
        email: "user@example.com",
        password: "SecurePassword123!",
        username: "myusername"
      },
      responseExample: {
        success: true,
        data: {
          user: {
            id: "user_abc123_def456",
            email: "user@example.com",
            username: "myusername",
            apiKey: "fapi_abc123_def456...",
            createdAt: "2025-06-25T10:30:00.000Z"
          },
          message: "Account created successfully"
        }
      },
      errors: [
        { code: 400, message: "Missing required fields or invalid data" },
        { code: 409, message: "Email already exists" },
        { code: 429, message: "Too many signup attempts" }
      ]
    },
    {
      method: 'POST',
      endpoint: '/api/auth/login',
      title: 'Login',
      description: 'Authenticate with existing credentials to retrieve your API key.',
      requestExample: {
        email: "user@example.com",
        password: "SecurePassword123!"
      },
      responseExample: {
        success: true,
        data: {
          user: {
            id: "user_abc123_def456",
            email: "user@example.com",
            username: "myusername",
            apiKey: "fapi_abc123_def456...",
            lastActiveAt: "2025-06-25T10:30:00.000Z"
          },
          message: "Login successful"
        }
      },
      errors: [
        { code: 401, message: "Invalid email or password" },
        { code: 403, message: "Account deactivated" },
        { code: 429, message: "Too many login attempts" }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/auth/verify',
      title: 'Verify API Key',
      description: 'Test if your API key is valid and get user information.',
      headers: { Authorization: "Bearer fapi_abc123_def456..." },
      responseExample: {
        success: true,
        data: {
          message: "API key is valid and authentication successful",
          user: {
            id: "user_abc123_def456",
            email: "user@example.com",
            username: "myusername"
          },
          timestamp: "2025-06-25T10:30:00.000Z"
        }
      },
      errors: [
        { code: 401, message: "Missing, invalid, or expired API key" }
      ]
    }
  ];

  const healthEndpoint = {
    method: 'GET',
    endpoint: '/api/health',
    title: 'System Health',
    description: 'Check the current status of all Forge services and infrastructure.',
    responseExample: {
      success: true,
      data: {
        status: "healthy",
        timestamp: "2025-06-25T10:30:00.000Z",
        services: {
          database: {
            status: "up",
            responseTime: 25,
            lastCheck: "2025-06-25T10:30:00.000Z",
            message: "Connected"
          },
          cloudflare: {
            status: "up",
            responseTime: 150,
            lastCheck: "2025-06-25T10:30:00.000Z",
            message: "API accessible"
          },
          api: {
            status: "up",
            responseTime: 5,
            lastCheck: "2025-06-25T10:30:00.000Z",
            message: "API responding"
          }
        },
        uptime: 86400,
        version: "1.0.0"
      }
    }
  };

  const deploymentEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/deployments',
      title: 'Create Deployment',
      description: 'Deploy a new project to Forge. Automatically generates a subdomain and builds your application.',
      headers: { Authorization: "Bearer fapi_abc123_def456..." },
      requestExample: {
        projectName: "my-awesome-app",
        gitRepository: "https://github.com/username/my-app.git",
        gitBranch: "main",
        framework: "next.js",
        buildCommand: "npm run build",
        outputDirectory: "dist",
        environmentVariables: {
          NODE_ENV: "production",
          API_URL: "https://api.example.com"
        }
      },
      responseExample: {
        success: true,
        data: {
          deployment: {
            id: "dep_abc123_def456",
            userId: "user_abc123_def456",
            subdomain: "awesome-app-xyz123",
            projectName: "my-awesome-app",
            status: "building",
            url: "https://awesome-app-xyz123.agfe.tech",
            gitRepository: "https://github.com/username/my-app.git",
            gitBranch: "main",
            framework: "next.js",
            createdAt: "2025-06-25T10:30:00.000Z",
            healthStatus: "unknown"
          },
          subdomain: "awesome-app-xyz123",
          url: "https://awesome-app-xyz123.agfe.tech"
        },
        meta: {
          timestamp: "2025-06-25T10:30:00.000Z",
          requestId: "req_abc123",
          version: "1.0.0"
        }
      },
      errors: [
        { code: 400, message: "Missing required fields (projectName, framework)" },
        { code: 401, message: "Invalid or missing API key" },
        { code: 429, message: "Rate limit exceeded" },
        { code: 500, message: "Internal server error during deployment" }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/deployments',
      title: 'List Deployments',
      description: 'Retrieve all deployments for the authenticated user with optional filtering.',
      headers: { Authorization: "Bearer fapi_abc123_def456..." },
      responseExample: {
        success: true,
        data: [
          {
            id: "dep_abc123_def456",
            userId: "user_abc123_def456", 
            subdomain: "awesome-app-xyz123",
            projectName: "my-awesome-app",
            status: "deployed",
            url: "https://awesome-app-xyz123.agfe.tech",
            framework: "next.js",
            createdAt: "2025-06-25T10:30:00.000Z",
            deployedAt: "2025-06-25T10:32:15.000Z",
            healthStatus: "healthy"
          }
        ],
        meta: {
          timestamp: "2025-06-25T10:30:00.000Z",
          requestId: "req_abc123",
          version: "1.0.0"
        }
      },
      errors: [
        { code: 401, message: "Invalid or missing API key" },
        { code: 429, message: "Rate limit exceeded" }
      ]
    }
  ];

  const subdomainEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/subdomains',
      title: 'Create Subdomain',
      description: 'Create a new subdomain and link it to a deployment. Automatically configures DNS records.',
      headers: { Authorization: "Bearer fapi_abc123_def456..." },
      requestExample: {
        deploymentId: "dep_abc123_def456",
        userId: "user_abc123_def456"
      },
      responseExample: {
        success: true,
        data: {
          subdomain: "awesome-app-xyz123",
          url: "https://awesome-app-xyz123.agfe.tech",
          cloudflareRecordId: "cf_record_abc123",
          status: "active"
        },
        meta: {
          timestamp: "2025-06-25T10:30:00.000Z",
          requestId: "req_abc123",
          version: "1.0.0"
        }
      },
      errors: [
        { code: 400, message: "Missing required fields (deploymentId, userId)" },
        { code: 401, message: "Invalid or missing API key" },
        { code: 429, message: "Rate limit exceeded" },
        { code: 500, message: "Failed to create DNS record" }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/subdomains',
      title: 'List Subdomains',
      description: 'Retrieve subdomains filtered by userId or deploymentId. At least one parameter is required.',
      headers: { Authorization: "Bearer fapi_abc123_def456..." },
      requestExample: {
        query_params: {
          userId: "user_abc123_def456",
          deploymentId: "dep_abc123_def456"
        }
      },
      responseExample: {
        success: true,
        data: [
          {
            _id: "sub_abc123_def456",
            subdomain: "awesome-app-xyz123", 
            userId: "user_abc123_def456",
            deploymentId: "dep_abc123_def456",
            cloudflareRecordId: "cf_record_abc123",
            status: "active",
            createdAt: "2025-06-25T10:30:00.000Z",
            updatedAt: "2025-06-25T10:30:00.000Z"
          }
        ],
        meta: {
          timestamp: "2025-06-25T10:30:00.000Z",
          requestId: "req_abc123", 
          version: "1.0.0"
        }
      },
      errors: [
        { code: 400, message: "Either userId or deploymentId parameter is required" },
        { code: 401, message: "Invalid or missing API key" },
        { code: 429, message: "Rate limit exceeded" }
      ]
    }
  ];

  const renderCodeBlock = (code: Record<string, unknown>, language = 'json') => (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-white/[0.08]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/[0.08]">
        <span className="text-sm text-secondary uppercase tracking-wide">{language}</span>
        <button className="text-secondary hover:text-foreground text-sm transition-colors">Copy</button>
      </div>
      <pre className="p-4 text-sm text-foreground overflow-x-auto">
        <code>{JSON.stringify(code, null, 2)}</code>
      </pre>
    </div>
  );

  const renderEndpoint = (endpoint: EndpointData) => (
    <motion.div
      key={endpoint.endpoint}
      className="bg-background/50 rounded-lg border border-white/[0.08] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            endpoint.method === 'GET' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
            endpoint.method === 'POST' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
            endpoint.method === 'PUT' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
            'bg-red-400/10 text-red-400 border border-red-400/20'
          }`}>
            {endpoint.method}
          </span>
          <code className="text-lg font-semibold text-foreground">{endpoint.endpoint}</code>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{endpoint.title}</h3>
        <p className="text-secondary">{endpoint.description}</p>
      </div>

      <div className="p-6 space-y-6">
        {endpoint.headers && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Headers</h4>
            {renderCodeBlock(endpoint.headers)}
          </div>
        )}

        {endpoint.requestExample && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Request Body</h4>
            {renderCodeBlock(endpoint.requestExample)}
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Response</h4>
          {renderCodeBlock(endpoint.responseExample)}
        </div>

        {endpoint.errors && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Error Responses</h4>
            <div className="space-y-2">
              {endpoint.errors.map((error: ErrorResponse, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                  <span className="px-2 py-1 bg-red-400/20 text-red-400 rounded text-sm font-semibold">
                    {error.code}
                  </span>
                  <span className="text-red-300">{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen mt-16 bg-background">
      <div className="border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Forge API Documentation</h1>
            </div>
            <p className="text-lg text-secondary max-w-3xl">
              Complete reference for the Forge deployment platform API. Build powerful deployment automation 
              and integrate with your existing workflows.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <aside className="w-64 flex-shrink-0 border-r border-white/[0.08] h-screen sticky top-16 overflow-y-auto">
          <nav className="p-6">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:text-foreground hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeSection === 'getting-started' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Getting Started</h2>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Base URL</h3>
                  <code className="text-purple-300 bg-purple-400/20 px-3 py-1 rounded">
                    https://api.agfe.tech
                  </code>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">Authentication</h3>
                <p className="text-secondary mb-4">
                  All API requests require authentication using an API key. Include your API key in the 
                  Authorization header of every request:
                </p>
                
                {renderCodeBlock({
                  "Authorization": "Bearer fapi_abc123_def456..."
                })}

                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Rate Limiting</h3>
                <p className="text-secondary mb-4">
                  API requests are rate limited to ensure fair usage:
                </p>
                <ul className="list-disc list-inside text-secondary space-y-2">
                  <li><strong className="text-foreground">Authentication endpoints:</strong> 5 requests per 15 minutes</li>
                  <li><strong className="text-foreground">Deployment endpoints:</strong> 100 requests per hour</li>
                  <li><strong className="text-foreground">Health checks:</strong> 60 requests per minute</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Response Format</h3>
                <p className="text-secondary mb-4">
                  All API responses follow a consistent format:
                </p>
                
                {renderCodeBlock({
                  success: true,
                  data: {
                    "...": "Response data here"
                  },
                  meta: {
                    timestamp: "2025-06-25T10:30:00.000Z",
                    requestId: "req_abc123",
                    version: "1.0.0"
                  }
                })}
              </div>
            </motion.div>
          )}

          {activeSection === 'authentication' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Authentication</h2>
              <p className="text-secondary mb-8">
                Manage user accounts and API keys for CLI access. All authentication endpoints 
                include rate limiting to prevent abuse.
              </p>
              
              <div className="space-y-8">
                {authEndpoints.map(renderEndpoint)}
              </div>
            </motion.div>
          )}

          {activeSection === 'health' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Health Check</h2>
              <p className="text-secondary mb-8">
                Monitor the status of Forge services and infrastructure. Use this endpoint 
                to check system availability before making other API calls.
              </p>
              
              {renderEndpoint(healthEndpoint)}
            </motion.div>
          )}

          {activeSection === 'deployments' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Deployments</h2>
              <p className="text-secondary mb-8">
                Create and manage deployments on the Forge platform. Deploy your applications with 
                automatic subdomain generation, build process management, and real-time deployment status tracking.
              </p>
              
              <div className="space-y-8">
                {deploymentEndpoints.map(renderEndpoint)}
              </div>
            </motion.div>
          )}

          {activeSection === 'subdomains' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Subdomains</h2>
              <p className="text-secondary mb-8">
                Manage custom subdomains for your deployments. Automatically create DNS records, 
                link subdomains to deployments, and track subdomain status and health.
              </p>
              
              <div className="space-y-8">
                {subdomainEndpoints.map(renderEndpoint)}
              </div>
            </motion.div>
          )}

          {activeSection === 'errors' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Error Handling</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-secondary mb-6">
                  Forge uses conventional HTTP response codes to indicate success or failure of API requests.
                </p>

                <h3 className="text-xl font-semibold text-foreground mb-4">HTTP Status Codes</h3>
                
                <div className="space-y-4 mb-8">
                  {[
                    { code: '200', title: 'OK', desc: 'Request succeeded' },
                    { code: '201', title: 'Created', desc: 'Resource created successfully' },
                    { code: '400', title: 'Bad Request', desc: 'Invalid request parameters' },
                    { code: '401', title: 'Unauthorized', desc: 'Invalid or missing API key' },
                    { code: '403', title: 'Forbidden', desc: 'Access denied' },
                    { code: '404', title: 'Not Found', desc: 'Resource not found' },
                    { code: '429', title: 'Too Many Requests', desc: 'Rate limit exceeded' },
                    { code: '500', title: 'Internal Server Error', desc: 'Server error occurred' }
                  ].map((status) => (
                    <div key={status.code} className="flex items-center gap-4 p-4 bg-background/50 border border-white/[0.08] rounded-lg">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        status.code.startsWith('2') ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                        status.code.startsWith('4') ? 'bg-red-400/10 text-red-400 border border-red-400/20' :
                        'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {status.code}
                      </span>
                      <div>
                        <h4 className="font-semibold text-foreground">{status.title}</h4>
                        <p className="text-secondary">{status.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">Error Response Format</h3>
                <p className="text-secondary mb-4">
                  Error responses include detailed information to help you debug issues:
                </p>
                
                {renderCodeBlock({
                  success: false,
                  error: {
                    code: "INVALID_API_KEY",
                    message: "The provided API key is invalid or expired",
                    details: {
                      hint: "Check your API key and ensure it's correctly formatted"
                    }
                  },
                  meta: {
                    timestamp: "2025-06-25T10:30:00.000Z",
                    requestId: "req_abc123",
                    version: "1.0.0"
                  }
                })}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
