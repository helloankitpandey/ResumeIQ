/**
 * Terms of Service Page
 *
 * Displays the terms of service for ResumeIQ.
 */

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 15, 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using ResumeIQ, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
            <p>ResumeIQ provides an online resume building and ATS analysis platform. We offer both free and premium features to help you create professional resumes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate information in your resume content.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>You retain ownership of your resume content. ResumeIQ retains ownership of the platform, templates, and all related intellectual property.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>ResumeIQ is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from your use of the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:ankit221601@gmail.com" className="text-primary hover:underline">ankit221601@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
