/**
 * Privacy Policy Page
 *
 * Displays the privacy policy for ResumeIQ.
 */

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: Jan 25, 2026</p>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, and resume content when you use ResumeIQ. We also collect usage data such as pages visited and features used.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our resume building services, authenticate your account, and communicate with you about your account and our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your data is stored securely using industry-standard encryption. Resume data is stored in our database and is accessible only to you through your authenticated account.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We use Google OAuth for authentication. When you sign in with Google, Google&apos;s privacy policy applies to the data they collect. We only receive your name, email, and profile picture.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>You can access, update, or delete your account and associated data at any time. Contact us at ankit221601@gmail.com for any privacy-related requests.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>For questions about this privacy policy, contact us at <a href="mailto:ankit221601@gmail.com" className="text-primary hover:underline">ankit221601@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
