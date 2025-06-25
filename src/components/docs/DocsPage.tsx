"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Forge Deployment Platform</h3>
            <p className="text-secondary leading-relaxed">
              Forge is a powerful deployment platform that allows developers to deploy their applications 
              with custom subdomains instantly. Built with Next.js, MongoDB, and Cloudflare, it provides 
              a seamless deployment experience through both web interface and CLI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">🚀 Features</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Custom subdomain generation</li>
                <li>• Real-time deployment tracking</li>
                <li>• CLI authentication system</li>
                <li>• Health monitoring</li>
                <li>• Cloudflare DNS integration</li>
              </ul>
            </div>
            
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">🛠 Tech Stack</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Next.js 15 with App Router</li>
                <li>• TypeScript</li>
                <li>• MongoDB</li>
                <li>• Cloudflare API</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication System',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">CLI Authentication</h3>
            <p className="text-secondary leading-relaxed mb-4">
              Forge provides a secure authentication system for CLI users with API key-based access control.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">API Endpoints</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-green-400/10 text-green-400 border border-green-400/20">
                    POST
                  </span>
                  <code className="text-sm text-secondary">/api/auth/signup</code>
                  <span className="text-xs text-secondary">Create new account</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-blue-400/10 text-blue-400 border border-blue-400/20">
                    POST
                  </span>
                  <code className="text-sm text-secondary">/api/auth/login</code>
                  <span className="text-xs text-secondary">User login</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    GET
                  </span>
                  <code className="text-sm text-secondary">/api/auth/verify</code>
                  <span className="text-xs text-secondary">Verify API key</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    GET
                  </span>
                  <code className="text-sm text-secondary">/api/auth/profile</code>
                  <span className="text-xs text-secondary">Get user profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-purple-400/10 text-purple-400 border border-purple-400/20">
                    POST
                  </span>
                  <code className="text-sm text-secondary">/api/auth/regenerate-key</code>
                  <span className="text-xs text-secondary">Regenerate API key</span>
                </div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Security Features</h4>
              <ul className="text-sm text-secondary space-y-2">
                <li>• <strong>Password Requirements:</strong> 8+ chars, uppercase, lowercase, number, special char</li>
                <li>• <strong>API Key Format:</strong> Secure format with fapi_ prefix</li>
                <li>• <strong>Rate Limiting:</strong> Protection against brute force attacks</li>
                <li>• <strong>Bcrypt Hashing:</strong> Industry-standard password hashing</li>
                <li>• <strong>JWT Alternative:</strong> Stateless API key authentication</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cloudflare',
      title: 'Cloudflare Integration',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">DNS Management</h3>
            <p className="text-secondary leading-relaxed mb-4">
              Automatic subdomain creation and management through Cloudflare API integration.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Configuration</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                <div className="text-gray-400"># Required Environment Variables</div>
                <div className="text-green-400">CLOUDFLARE_API_TOKEN=your_token_here</div>
                <div className="text-green-400">CLOUDFLARE_ZONE_ID=your_zone_id</div>
                <div className="text-green-400">BASE_DOMAIN=yourdomain.com</div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">API Token Permissions</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• <strong>Zone:Zone:Read</strong> - Read zone information</li>
                <li>• <strong>Zone:DNS:Edit</strong> - Create and modify DNS records</li>
                <li>• <strong>User:User:Read</strong> - Verify token validity</li>
              </ul>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Health Check</h4>
              <p className="text-sm text-secondary mb-2">
                Automatic health monitoring ensures Cloudflare integration is working properly:
              </p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                <div className="text-blue-400">pnpm test:cloudflare</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'database',
      title: 'Database Schema',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">MongoDB Collections</h3>
            <p className="text-secondary leading-relaxed mb-4">
              Structured data models for users, deployments, and subdomain management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Users Collection</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-1">
                <div><span className="text-blue-400">id:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Unique user identifier`}</span></div>
                <div><span className="text-blue-400">email:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// User email (unique)`}</span></div>
                <div><span className="text-blue-400">username:</span> <span className="text-yellow-400">string?</span> <span className="text-gray-400">{`// Optional username`}</span></div>
                <div><span className="text-blue-400">passwordHash:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Bcrypt hash`}</span></div>
                <div><span className="text-blue-400">apiKey:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Unique API key`}</span></div>
                <div><span className="text-blue-400">deployments:</span> <span className="text-yellow-400">string[]</span> <span className="text-gray-400">{`// Deployment IDs`}</span></div>
                <div><span className="text-blue-400">subdomains:</span> <span className="text-yellow-400">string[]</span> <span className="text-gray-400">{`// Subdomain list`}</span></div>
                <div><span className="text-blue-400">isActive:</span> <span className="text-yellow-400">boolean</span> <span className="text-gray-400">{`// Account status`}</span></div>
                <div><span className="text-blue-400">createdAt:</span> <span className="text-yellow-400">Date</span></div>
                <div><span className="text-blue-400">lastActiveAt:</span> <span className="text-yellow-400">Date</span></div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Deployments Collection</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-1">
                <div><span className="text-blue-400">id:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Deployment ID`}</span></div>
                <div><span className="text-blue-400">userId:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Owner user ID`}</span></div>
                <div><span className="text-blue-400">subdomain:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// Generated subdomain`}</span></div>
                <div><span className="text-blue-400">projectName:</span> <span className="text-yellow-400">string</span></div>
                <div><span className="text-blue-400">status:</span> <span className="text-yellow-400">DeploymentStatus</span></div>
                <div><span className="text-blue-400">framework:</span> <span className="text-yellow-400">string</span> <span className="text-gray-400">{`// next, react, vue, etc`}</span></div>
                <div><span className="text-blue-400">gitRepository:</span> <span className="text-yellow-400">string?</span></div>
                <div><span className="text-blue-400">deploymentLogs:</span> <span className="text-yellow-400">DeploymentLog[]</span></div>
                <div><span className="text-blue-400">healthStatus:</span> <span className="text-yellow-400">HealthStatus</span></div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Database Operations</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• <strong>Indexes:</strong> Optimized queries on email, apiKey, and userId</li>
                <li>• <strong>Repository Pattern:</strong> Clean data access layer</li>
                <li>• <strong>Connection Pooling:</strong> Efficient MongoDB connections</li>
                <li>• <strong>Data Validation:</strong> Type-safe operations with TypeScript</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Reference',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Core APIs</h3>
            <p className="text-secondary leading-relaxed mb-4">
              RESTful API endpoints for deployment management and system monitoring.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Health & Monitoring</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-green-400/10 text-green-400 border border-green-400/20">
                    GET
                  </span>
                  <code className="text-sm text-secondary">/api/health</code>
                  <span className="text-xs text-secondary">System health check</span>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                  <div className="text-gray-400">{`# Returns service status`}</div>
                  <div className="text-green-400">{`{`}</div>
                  <div className="text-green-400">{`  "status": "healthy",`}</div>
                  <div className="text-green-400">{`  "services": {`}</div>
                  <div className="text-green-400">{`    "database": "up",`}</div>
                  <div className="text-green-400">{`    "cloudflare": "up"`}</div>
                  <div className="text-green-400">{`  }`}</div>
                  <div className="text-green-400">{`}`}</div>
                </div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Deployment Management</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-blue-400/10 text-blue-400 border border-blue-400/20">
                    POST
                  </span>
                  <code className="text-sm text-secondary">/api/deployments</code>
                  <span className="text-xs text-secondary">Create deployment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    GET
                  </span>
                  <code className="text-sm text-secondary">/api/deployments</code>
                  <span className="text-xs text-secondary">List deployments</span>
                </div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Subdomain Management</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-purple-400/10 text-purple-400 border border-purple-400/20">
                    POST
                  </span>
                  <code className="text-sm text-secondary">/api/subdomains</code>
                  <span className="text-xs text-secondary">Generate subdomain</span>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                  <div className="text-gray-400">{`# Auto-generates secure subdomain`}</div>
                  <div className="text-green-400">abc123def4.yourdomain.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'testing',
      title: 'Testing & Scripts',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Development Tools</h3>
            <p className="text-secondary leading-relaxed mb-4">
              Comprehensive testing suite and utility scripts for development and deployment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Available Scripts</h4>
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                  <div><span className="text-blue-400">pnpm dev</span> <span className="text-gray-400">{`# Start development server`}</span></div>
                  <div><span className="text-blue-400">pnpm build</span> <span className="text-gray-400">{`# Build for production`}</span></div>
                  <div><span className="text-blue-400">pnpm test:auth</span> <span className="text-gray-400">{`# Test authentication system`}</span></div>
                  <div><span className="text-blue-400">pnpm test:cloudflare</span> <span className="text-gray-400">{`# Test Cloudflare integration`}</span></div>
                  <div><span className="text-blue-400">pnpm init:db</span> <span className="text-gray-400">{`# Initialize database indexes`}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Test Coverage</h4>
              <ul className="text-sm text-secondary space-y-2">
                <li>• <strong>Authentication Flow:</strong> Signup, login, API key verification</li>
                <li>• <strong>Cloudflare Integration:</strong> DNS record creation and health checks</li>
                <li>• <strong>Database Operations:</strong> User management and data persistence</li>
                <li>• <strong>Error Handling:</strong> Rate limiting and validation</li>
                <li>• <strong>Security:</strong> Password hashing and API key generation</li>
              </ul>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Environment Setup</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-1">
                <div className="text-gray-400">{`# Create .env.local file`}</div>
                <div className="text-green-400">MONGODB_URI=mongodb://localhost:27017/forge</div>
                <div className="text-green-400">CLOUDFLARE_API_TOKEN=your_token</div>
                <div className="text-green-400">CLOUDFLARE_ZONE_ID=your_zone_id</div>
                <div className="text-green-400">BASE_DOMAIN=yourdomain.com</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'deployment',
      title: 'Deployment Guide',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Production Deployment</h3>
            <p className="text-secondary leading-relaxed mb-4">
              Step-by-step guide to deploy Forge in production environment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Prerequisites</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Node.js 18+ installed</li>
                <li>• MongoDB instance (local or cloud)</li>
                <li>• Cloudflare account with domain</li>
                <li>• Valid Cloudflare API token</li>
              </ul>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Build & Deploy</h4>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                <div className="text-gray-400">{`# Install dependencies`}</div>
                <div className="text-green-400">pnpm install</div>
                <div className="text-gray-400">{`# Initialize database`}</div>
                <div className="text-green-400">pnpm init:db</div>
                <div className="text-gray-400">{`# Test configuration`}</div>
                <div className="text-green-400">pnpm test:cloudflare</div>
                <div className="text-gray-400">{`# Build for production`}</div>
                <div className="text-green-400">pnpm build</div>
                <div className="text-gray-400">{`# Start production server`}</div>
                <div className="text-green-400">pnpm start</div>
              </div>
            </div>

            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Production Checklist</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• ✅ Environment variables configured</li>
                <li>• ✅ Database indexes created</li>
                <li>• ✅ Cloudflare API token validated</li>
                <li>• ✅ HTTPS enabled</li>
                <li>• ✅ Rate limiting configured</li>
                <li>• ✅ Health monitoring active</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const navigation = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'cloudflare', title: 'Cloudflare', icon: '☁️' },
    { id: 'database', title: 'Database', icon: '🗄️' },
    { id: 'api', title: 'API Reference', icon: '🔌' },
    { id: 'testing', title: 'Testing', icon: '🧪' },
    { id: 'deployment', title: 'Deployment', icon: '🚀' }
  ];

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
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-2xl font-mono font-bold text-foreground">Forge Documentation</h1>
            </div>
            <p className="text-secondary">
              Complete guide to the Forge deployment platform architecture and implementation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <motion.nav
            className="w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="sticky top-24 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-secondary hover:text-foreground hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </motion.nav>

          <motion.main
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-background/50 border border-white/[0.08] rounded-lg p-6">
              {sections.find(section => section.id === activeSection)?.content}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
