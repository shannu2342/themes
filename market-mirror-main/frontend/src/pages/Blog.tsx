import { useState } from "react";
import { Search, Calendar, Clock, User, ArrowRight, Filter, Tag, TrendingUp, Heart, MessageCircle, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Posts", count: 24 },
    { id: "tutorials", name: "Tutorials", count: 8 },
    { id: "news", name: "News & Updates", count: 6 },
    { id: "design", name: "Design Trends", count: 5 },
    { id: "development", name: "Development", count: 5 },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Web Design: Trends to Watch in 2024",
      excerpt: "Explore the cutting-edge design trends that will shape the web in 2024, from AI-powered layouts to immersive 3D experiences.",
      author: "Sarah Chen",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "design",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["Web Design", "UI/UX", "Trends"],
      likes: 234,
      comments: 18,
      featured: true
    },
    {
      id: 2,
      title: "How to Build a Successful Digital Marketplace",
      excerpt: "Learn the essential strategies and technologies needed to create and scale a thriving digital asset marketplace.",
      author: "Michael Park",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "development",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["Marketplace", "Business", "Strategy"],
      likes: 189,
      comments: 23,
      featured: true
    },
    {
      id: 3,
      title: "Mastering React: Advanced Patterns and Best Practices",
      excerpt: "Deep dive into advanced React patterns, performance optimization techniques, and modern best practices for large-scale applications.",
      author: "Alex Johnson",
      date: "2024-01-10",
      readTime: "15 min read",
      category: "tutorials",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
      tags: ["React", "JavaScript", "Tutorial"],
      likes: 342,
      comments: 45,
      featured: false
    },
    {
      id: 4,
      title: "ThemeVault 2.0: Major Platform Update Announced",
      excerpt: "Exciting news! We're rolling out ThemeVault 2.0 with enhanced features, improved performance, and new creator tools.",
      author: "Emily Rodriguez",
      date: "2024-01-08",
      readTime: "5 min read",
      category: "news",
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=400&fit=crop",
      tags: ["Update", "Platform", "News"],
      likes: 567,
      comments: 89,
      featured: true
    },
    {
      id: 5,
      title: "The Psychology of Color in Digital Design",
      excerpt: "Understanding how color choices impact user behavior and emotions in digital interfaces and marketing materials.",
      author: "Lisa Wang",
      date: "2024-01-05",
      readTime: "10 min read",
      category: "design",
      image: "https://images.unsplash.com/photo-1541701494587-8275b7f622e3?w=600&h=400&fit=crop",
      tags: ["Color Theory", "Psychology", "Design"],
      likes: 156,
      comments: 12,
      featured: false
    },
    {
      id: 6,
      title: "Building Scalable E-commerce Solutions with Modern Tech",
      excerpt: "A comprehensive guide to architecting e-commerce platforms that can handle growth and maintain performance.",
      author: "David Kim",
      date: "2024-01-03",
      readTime: "18 min read",
      category: "development",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["E-commerce", "Architecture", "Scalability"],
      likes: 298,
      comments: 34,
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                ThemeVault <span className="text-primary">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, tutorials, and news for creators and developers in the digital marketplace.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles, tutorials, and news..."
                  className="pl-12 pr-4 py-3 text-lg h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="relative"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === "all" && !searchQuery && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video relative">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary">Featured</Badge>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">
              {selectedCategory === "all" ? "All Articles" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest tutorials, design trends, and platform updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
              <Button variant="secondary" className="flex-shrink-0">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
