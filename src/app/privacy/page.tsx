import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Forge',
  description: 'Privacy policy for Forge deployment platform',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-secondary">
          <p className="text-sm text-muted mb-8">Last updated: July 3, 2025</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
          <p>
            When you use Forge, we collect minimal information necessary to provide our service:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Email address for account creation and authentication</li>
            <li>Username (optional) for display purposes</li>
            <li>Deployment metadata (project names, framework types, deployment timestamps)</li>
            <li>Server logs for debugging and monitoring purposes</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide and maintain the Forge deployment service</li>
            <li>Authenticate your CLI and API requests</li>
            <li>Monitor service health and performance</li>
            <li>Communicate important service updates</li>
            <li>Improve our platform based on usage patterns</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Storage and Security</h2>
          <p>
            Your data is stored securely with industry-standard encryption. We implement:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Secure password hashing using bcrypt</li>
            <li>API key-based authentication</li>
            <li>Regular security audits and updates</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Services</h2>
          <p>
            Forge integrates with third-party services to provide our functionality:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Cloudflare:</strong> DNS management and CDN services</li>
            <li><strong>Let&apos;s Encrypt:</strong> SSL certificate provisioning</li>
            <li><strong>GitHub:</strong> Source code repository integration</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Retention</h2>
          <p>
            We retain your data only as long as necessary to provide our services. You can request 
            account deletion at any time by contacting us.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Export your deployment data</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Open Source</h2>
          <p>
            Forge is an open-source project. You can review our code, contribute improvements, 
            or report issues on our{' '}
            <a 
              href="https://github.com/harshitkumar9030/cli" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our{' '}
            <a 
              href="https://github.com/harshitkumar9030/cli/issues" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
