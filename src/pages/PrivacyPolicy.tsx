import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Welcome to Lightshunt ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our marketplace (lightshunt.com) and tell you about your privacy rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
            <p>We collect and process the following types of personal data:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Identity Data: name, username, title</li>
              <li>Contact Data: email address, billing address</li>
              <li>Financial Data: payment card details (processed securely through our payment processor)</li>
              <li>Transaction Data: details of products you've purchased</li>
              <li>Technical Data: IP address, browser type, device information</li>
              <li>Profile Data: purchases, preferences, feedback, and reviews</li>
              <li>Usage Data: how you use our marketplace</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
            <p>We use your personal data for these purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To process and deliver your orders</li>
              <li>To manage your account and provide customer support</li>
              <li>To enable you to sell digital products on our platform</li>
              <li>To process payments and prevent fraud</li>
              <li>To personalize your experience</li>
              <li>To improve our services</li>
              <li>To communicate important updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
            <p>We share your data with:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Payment processors to handle transactions</li>
              <li>Cloud storage providers to store digital products</li>
              <li>Analytics providers to improve our service</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We regularly review and update these measures.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p>We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and understand where our audience is coming from. You can control cookies through your browser settings.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect or maintain information from persons under 13 years of age.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
            <p className="mt-4">
              Email: privacy@lightshunt.com<br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 