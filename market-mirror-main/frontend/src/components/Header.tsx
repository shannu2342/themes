import { Search, ShoppingCart, Menu, Grid3X3, User, LogOut, Layout, Download } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useProducts";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { itemCount } = useCart();
  const { data: categories } = useCategories();
  const navigate = useNavigate();

  // Dynamic main navigation based on categories
  const mainNavItems = [
    { label: "All Products", href: "/products", active: true },
    ...(categories?.slice(0, 6).map(cat => ({
      label: cat.name,
      href: `/products?category=${cat.slug}`,
      active: false
    })) || [])
  ];

  // Dynamic sub navigation
  const subNavItems = [
    "All Items",
    ...(categories?.map(cat => cat.name) || [])
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full">
      {/* Top Header */}
      <div className="bg-header-bg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <div className="text-primary text-2xl font-bold">⚡</div>
              <span className="text-header-foreground text-xl font-bold">themevault</span>
              <span className="text-muted-foreground text-xl font-light">market</span>
            </Link>

            {/* Desktop Nav Right */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-primary text-sm font-medium hover:underline">
                Start Selling
              </a>
              <Link to="/products" className="nav-link flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Our Products
              </Link>
              <Link to="/cart" className="nav-link flex items-center gap-2 relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {isLoading ? (
                <div className="w-16 h-8 bg-muted animate-pulse rounded"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard" 
                    className="nav-link flex items-center gap-2"
                    title="My Dashboard"
                  >
                    <Layout className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <div className="flex items-center gap-2 border-l border-header-foreground/20 pl-4">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="nav-link flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="nav-link">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-header-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-header-bg border-t border-header-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    item.active
                      ? "text-primary"
                      : "text-header-foreground/70 hover:text-header-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <span className="text-header-foreground/30">|</span>
              <a href="#" className="text-highlight-blue text-sm font-medium hover:underline">
                AI Tools & Unlimited Stock Assets
              </a>
            </nav>
            <div className="hidden lg:block">
              <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-medium">
                🚀 Digital Marketplace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center gap-6 h-11 overflow-x-auto">
            {subNavItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-foreground/70 hover:text-foreground text-sm whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={closeMobileMenu}>
          <div className="bg-background w-80 h-full shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="bg-header-bg p-4 border-b border-header-foreground/10">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <div className="text-primary text-2xl font-bold">⚡</div>
                  <span className="text-header-foreground text-xl font-bold">themevault</span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="text-header-foreground/70 hover:text-header-foreground p-2 rounded-lg hover:bg-header-foreground/10 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-4">
              {/* Main Navigation */}
              <nav className="space-y-2 mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Main Menu</h3>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Sub Navigation */}
              <nav className="space-y-2 mb-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {subNavItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 rounded-lg text-xs text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </nav>

              {/* User Actions */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</h3>
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <Layout className="w-4 h-4" />
                      My Dashboard
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium text-center hover:bg-primary/90 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 border border-border rounded-lg text-sm font-medium text-center hover:bg-accent transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
