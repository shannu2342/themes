import { Shield, Eye, Lock, Database, UserCheck, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Data Collection",
      content: "We collect information you provide directly to us, such as when you create an account, purchase a product, or contact us for support. This includes your name, email address, payment information, and any communications you send to us."
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include SSL encryption, secure servers, and regular security audits."
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with trusted service providers who assist us in operating our platform."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can manage your account settings, download your data, or request deletion of your account at any time through your dashboard or by contacting our support team."
    },
    {
      icon: Globe,
      title: "International Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws."
    }
  ];

  const cookies = [
    { name: "Essential Cookies", description: "Required for the website to function properly", required: true },
    { name: "Analytics Cookies", description: "Help us understand how visitors interact with our website", required: false },
    { name: "Marketing Cookies", description: "Used to deliver advertisements relevant to your interests", required: false },
    { name: "Functional Cookies", description: "Enable enhanced functionality and personalization", required: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Privacy <span className="text-primary">Policy</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, 
                use, and protect your information when you use ThemeVault.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: January 1, 2024
              </p>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="bg-muted/50 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ThemeVault ("we," "us," or "our") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you visit our website themevault.com and use our services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By using ThemeVault, you consent to the data practices described in this policy. 
                  If you do not agree with the terms of this privacy policy, please do not access or use our website.
                </p>
              </div>

              {/* Information Sections */}
              <div className="space-y-8 mb-12">
                {sections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cookies Section */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    Cookies and Tracking Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    We use cookies and similar tracking technologies to track activity on our website 
                    and hold certain information. You can instruct your browser to refuse all cookies 
                    or to indicate when a cookie is being sent.
                  </p>
                  <div className="space-y-4">
                    {cookies.map((cookie, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                        <div className="mt-1">
                          <div className={`w-2 h-2 rounded-full ${cookie.required ? 'bg-primary' : 'bg-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{cookie.name}</h4>
                            {cookie.required && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{cookie.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Third Party Services */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Third-Party Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our website integrates with third-party services that have their own privacy policies:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Payment Processors:</strong> Stripe and PayPal for secure payment processing</li>
                    <li>• <strong>Analytics:</strong> Google Analytics for website traffic analysis</li>
                    <li>• <strong>Cloud Storage:</strong> MongoDB-backed application data and secure authentication services</li>
                    <li>• <strong>Email Services:</strong> SendGrid for transactional emails</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as necessary to fulfill the purposes 
                    outlined in this privacy policy, unless a longer retention period is required or 
                    permitted by law. You can request deletion of your account and associated data at any time.
                  </p>
                </CardContent>
              </Card>

              {/* Children's Privacy */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our website is not intended for children under 13 years of age. We do not knowingly 
                    collect personally identifiable information from children under 13. If you are a parent 
                    or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Policy */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Changes to This Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any changes 
                    by posting the new privacy policy on this page and updating the "Last updated" date at the top.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>• Email: privacy@themevault.com</p>
                    <p>• Phone: +1 (555) 123-4567</p>
                    <p>• Address: 123 Market Street, San Francisco, CA 94102</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
