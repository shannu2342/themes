import { FileText, Shield, CreditCard, Users, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using ThemeVault, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: Users,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. You must provide accurate and complete information for all account registration."
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: "All payments are processed through secure third-party payment processors. By making a purchase, you agree to provide accurate billing information and authorize charges for the selected products. All sales are final unless otherwise stated in our refund policy."
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: "All content, products, and services available on ThemeVault are the property of their respective creators and are protected by intellectual property laws. You may not use, reproduce, or distribute any content without explicit permission from the rights holder."
    },
  ];

  const prohibitedUses = [
    "Use the service for any illegal or unauthorized purpose",
    "Reverse engineer, decompile, or disassemble any software or products",
    "Violate any applicable laws or regulations",
    "Infringe upon the intellectual property rights of others",
    "Upload malicious code, viruses, or harmful content",
    "Attempt to gain unauthorized access to our systems",
    "Use automated tools to access the service without permission",
    "Interfere with or disrupt the service or servers"
  ];

  const licenseTypes = [
    {
      type: "Regular License",
      description: "Use the item in one end product for personal or commercial use",
      price: "Single project",
      features: ["One end product", "Commercial use", "6 months support"]
    },
    {
      type: "Extended License",
      description: "Use the item in one end product and charge users for access",
      price: "Multiple projects",
      features: ["Unlimited projects", "Commercial use", "Lifetime support", "Resale rights"]
    }
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
                Terms & <span className="text-primary">Conditions</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Please read these terms and conditions carefully before using our platform.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: January 1, 2024
              </p>
            </div>

            {/* Main Terms Sections */}
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

            {/* License Terms */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  License Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  ThemeVault offers different license types to suit various needs:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {licenseTypes.map((license, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-2">{license.type}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{license.description}</p>
                      <p className="text-primary font-medium mb-4">{license.price}</p>
                      <ul className="space-y-2">
                        {license.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You may not use our service for any of the following purposes:
                </p>
                <ul className="space-y-3">
                  {prohibitedUses.map((use, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <span className="text-muted-foreground">{use}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Refund Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We offer a 14-day money-back guarantee for most digital products. 
                    To be eligible for a refund:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• The item must not have been downloaded more than once</li>
                    <li>• The refund request must be made within 14 days of purchase</li>
                    <li>• The item must have a technical issue that cannot be resolved</li>
                    <li>• You must provide a valid reason for the refund request</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Note: Custom work and extended licenses are non-refundable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Guidelines */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Content Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    All content uploaded to ThemeVault must comply with our community guidelines:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Allowed Content</h4>
                      <ul className="space-y-2">
                        <li>✓ Original designs and templates</li>
                        <li>✓ Properly licensed assets</li>
                        <li>✓ Professional quality work</li>
                        <li>✓ Content with clear documentation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Prohibited Content</h4>
                      <ul className="space-y-2">
                        <li>✗ Stolen or plagiarized work</li>
                        <li>✗ Malicious code or scripts</li>
                        <li>✗ Adult or offensive content</li>
                        <li>✗ Trademarked brand assets</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Service Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive to maintain 99.9% uptime for our services. However, we cannot guarantee 
                  uninterrupted service and may perform maintenance or experience technical difficulties. 
                  We are not liable for any downtime or service interruptions.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In no event shall ThemeVault, its directors, employees, partners, agents, suppliers, 
                  or affiliates be liable for any indirect, incidental, special, consequential, or punitive 
                  damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the service.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and bar access to the service immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever 
                  and without limitation.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. If we make material changes, 
                  we will notify you by email or by posting a notice on our site prior to the effective 
                  date of the changes.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>• Email: legal@themevault.com</p>
                  <p>• Phone: +1 (555) 123-4567</p>
                  <p>• Address: 123 Market Street, San Francisco, CA 94102</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
