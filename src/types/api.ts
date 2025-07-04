// Database Models
export interface Deployment {
  _id?: string;
  id: string;
  userId: string;
  subdomain: string;
  projectName: string;
  status: DeploymentStatus;
  url: string;
  gitRepository?: string;
  gitBranch?: string;
  gitCommit?: string;
  framework: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
  serverIP?: string; // IP address of the server where deployment is running
  port?: number; // Port where the CLI API server is running (default: 8080)
  deploymentLogs: DeploymentLog[];
  createdAt: Date;
  updatedAt: Date;
  deployedAt?: Date;
  lastHealthCheck?: Date;
  healthStatus: HealthStatus;
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source: string;
}

export interface Subdomain {
  _id?: string;
  subdomain: string;
  userId: string;
  deploymentId: string;
  cloudflareRecordId: string;
  status: SubdomainStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface User {
  _id?: string;
  id: string;
  email: string;
  username?: string;
  passwordHash: string;
  deployments: string[];
  subdomains: string[];
  apiKey: string;
  apiKeyExpiresAt?: Date;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

// API Request/Response Types
export interface CreateDeploymentRequest {
  projectName: string;
  gitRepository?: string;
  gitBranch?: string;
  framework: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
  publicIP?: string;
  localIP?: string;
  customSubdomain?: string;
}

export interface CreateDeploymentResponse {
  deployment: Deployment;
  subdomain: string;
  url: string;
}

export interface SubdomainRequest {
  deploymentId: string;
  userId: string;
  publicIP?: string;
}

export interface SubdomainResponse {
  subdomain: string;
  url: string;
  cloudflareRecordId: string;
  status: SubdomainStatus;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  services: {
    database: ServiceHealth;
    cloudflare: ServiceHealth;
    api: ServiceHealth;
  };
  uptime: number;
  version: string;
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'slow';
  responseTime?: number;
  lastCheck: Date;
  message?: string;
}

export interface StatusPageData {
  overall: 'operational' | 'degraded' | 'major_outage';
  services: StatusService[];
  incidents: Incident[];
  uptime: UptimeStats;
}

export interface StatusService {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  description: string;
  uptime: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  affectedServices: string[];
}

export interface UptimeStats {
  last24h: number;
  last7d: number;
  last30d: number;
  last90d: number;
}

// Enums
export enum DeploymentStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown'
}

export enum SubdomainStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

// Cloudflare Types
export interface CloudflareRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

export interface CloudflareCreateRecordRequest {
  type: 'A' | 'CNAME' | 'AAAA';
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}

export interface CloudflareResponse<T> {
  success: boolean;
  errors: CloudflareError[];
  messages: CloudflareMessage[];
  result: T;
}

export interface CloudflareError {
  code: number;
  message: string;
}

export interface CloudflareMessage {
  code: number;
  message: string;
}

// Utility Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DeploymentFilters {
  status?: DeploymentStatus;
  framework?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

// Authentication Types
export interface SignupRequest {
  email: string;
  password: string;
  username?: string;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    apiKey: string;
    createdAt: Date;
  };
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    apiKey: string;
    lastActiveAt: Date;
  };
  message: string;
}

export interface RegenerateApiKeyRequest {
  email: string;
  password: string;
}

export interface RegenerateApiKeyResponse {
  apiKey: string;
  message: string;
}
