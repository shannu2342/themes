import { useState } from "react";
import { Search, BookOpen, MessageCircle, Download, Star, ChevronRight, HelpCircle, Video, FileText, Zap, CreditCard, Users, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Download,
      title: "Getting Started",
      description: "Learn the basics of using ThemeVault",
      articles: 12,
      color: "bg-blue-500"
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment methods, refunds, and subscriptions",
      articles: 8,
      color: "bg-primary"
    },
    {
      icon: FileText,
      title: "Licenses & Usage",
      description: "Understanding licenses and usage rights",
      articles: 6,
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Author Support",
      description: "Resources for content creators",
      articles: 15,
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Account & Security",
      description: "Managing your account and staying safe",
      articles: 10,
      color: "bg-red-500"
    },
    {
      icon: Zap,
      title: "Technical Issues",
      description: "Troubleshooting and technical support",
      articles: 9,
      color: "bg-yellow-500"
    }
  ];

  const popularArticles = [
    {
      title: "How to download your purchases",
      category: "Getting Started",
      views: "15.2k",
      helpful: 89
    },
    {
      title: "Understanding Regular vs Extended Licenses",
      category: "Licenses & Usage",
      views: "12.8k",
      helpful: 92
    },
    {
      title: "How to request a refund",
      category: "Payments & Billing",
      views: "9.5k",
      helpful: 78
    },
    {
      title: "Becoming an author on ThemeVault",
      category: "Author Support",
      views: "8.3k",
      helpful: 95
    },
    {
      title: "Troubleshooting download issues",
      category: "Technical Issues",
      views: "7.1k",
      helpful: 82
    }
  ];

  const videoTutorials = [
    {
      title: "ThemeVault Platform Overview",
      duration: "5:23",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop"
    },
    {
      title: "How to Purchase and Download Items",
      duration: "3:45",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop"
    },
    {
      title: "Understanding Product Licenses",
      duration: "4:12",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop"
    },
    {
      title: "Author Dashboard Guide",
      duration: "6:18",
      thumbnail: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=225&fit=crop"
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Chat with our support team",
      action: "Start Chat",
      available: true
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      action: "Watch Videos",
      available: true
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse comprehensive guides",
      action: "Read Docs",
      available: true
    },
    {
      icon: HelpCircle,
      title: "Community Forum",
      description: "Get help from other users",
      action: "Visit Forum",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Help <span className="text-primary">Center</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers, tutorials, and support for everything ThemeVault.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help articles, tutorials, and more..."
                  className="pl-12 pr-4 py-3 text-lg h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {quickActions.map((action, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <action.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {action.action}
                    </Button>
                    {action.available && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Available 24/7
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${category.color} rounded-lg`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {category.articles} articles
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Articles</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.views} views</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{article.helpful}% helpful</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Video Tutorials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-3 bg-white rounded-full">
                        <Video className="h-5 w-5 text-gray-900" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
