import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>By accessing and using Lightshunt.com ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>"Platform" refers to Lightshunt.com</li>
              <li>"User" refers to anyone who uses the Platform</li>
              <li>"Seller" refers to users who sell digital products on the Platform</li>
              <li>"Buyer" refers to users who purchase digital products</li>
              <li>"Content" refers to digital products, descriptions, reviews, and other materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p>To use certain features of the Platform, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Seller Terms</h2>
            <p>As a seller on our Platform, you agree to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Only sell digital products you have the right to distribute</li>
              <li>Provide accurate descriptions of your products</li>
              <li>Maintain reasonable customer support for your products</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Accept our commission structure and payment terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Buyer Terms</h2>
            <p>As a buyer on our Platform, you agree to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide valid payment information</li>
              <li>Use purchased content in accordance with the seller's terms</li>
              <li>Not redistribute or resell purchased content unless explicitly permitted</li>
              <li>Provide honest and fair reviews</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of Lightshunt or its content suppliers and is protected by copyright and other intellectual property laws.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
            <p>Users are prohibited from:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Violating any laws or regulations</li>
              <li>Infringing on intellectual property rights</li>
              <li>Distributing malware or harmful code</li>
              <li>Attempting to gain unauthorized access</li>
              <li>Interfering with Platform operations</li>
              <li>Engaging in fraudulent activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Payment and Refunds</h2>
            <p>We process payments through secure third-party payment processors. Refunds are handled according to our refund policy and may vary by product. Digital products may be non-refundable once downloaded.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Lightshunt shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>We reserve the right to terminate or suspend your account and access to the Platform for any violation of these terms or for any other reason at our sole discretion.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>We may modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <p className="mt-4">
              Email: legal@lightshunt.com<br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService; 