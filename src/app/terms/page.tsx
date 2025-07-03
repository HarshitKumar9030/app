import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Forge',
  description: 'Terms of service for Forge deployment platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-secondary">
          <p className="text-sm text-muted mb-8">Last updated: July 3, 2025</p>
          
          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
          <p>
            By using Forge, you agree to these Terms of Service. If you do not agree to these terms, 
            please do not use our service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Description of Service</h2>
          <p>
            Forge is an open-source deployment platform that allows developers to deploy web applications 
            with automated SSL certificates, domain management, and infrastructure setup. The service includes:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>CLI tool for deployment management</li>
            <li>Automated SSL certificate provisioning</li>
            <li>DNS management through Cloudflare integration</li>
            <li>Support for multiple frameworks and languages</li>
            <li>Local and remote deployment capabilities</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">User Responsibilities</h2>
          <p>As a user of Forge, you agree to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide accurate information during registration</li>
            <li>Keep your API keys secure and confidential</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to disrupt or compromise the service</li>
            <li>Respect rate limits and usage guidelines</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Prohibited Uses</h2>
          <p>You may not use Forge to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Deploy malicious software, viruses, or harmful code</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Spam, phish, or engage in fraudulent activities</li>
            <li>Overload or attack our infrastructure</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Service Availability</h2>
          <p>
            While we strive for high availability, Forge is provided &quot;as is&quot; without guarantees 
            of uptime. We may experience downtime for maintenance, updates, or unforeseen circumstances.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data and Privacy</h2>
          <p>
            Your use of Forge is also governed by our Privacy Policy. We collect and process 
            data as described in that policy to provide and improve our service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Intellectual Property</h2>
          <p>
            Forge is an open-source project released under an open-source license. The source code 
            is available on{' '}
            <a 
              href="https://github.com/harshitkumar9030/cli" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>. 
            Users retain ownership of their deployed applications and code.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
          <p>
            Forge is provided as an open-source tool. To the maximum extent permitted by law, 
            we disclaim all warranties and limit our liability for any damages arising from 
            the use of our service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms. 
            Users may also delete their accounts at any time through our API or by contacting us.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of Forge after changes 
            constitutes acceptance of the new terms. We will notify users of significant changes 
            through our GitHub repository.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Open Source</h2>
          <p>
            As an open-source project, Forge welcomes contributions, bug reports, and feature 
            requests. Please visit our{' '}
            <a 
              href="https://github.com/harshitkumar9030/cli" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>{' '}
            to get involved.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Information</h2>
          <p>
            For questions about these Terms of Service, please open an issue on our{' '}
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
