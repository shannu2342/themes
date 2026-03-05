import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  "ThemeVault Market": ["WordPress Themes", "Website Templates", "HTML Templates", "Marketing", "CMS Templates", "Plugins"],
  "Help & Support": ["Help Center", "Contact Us", "Author Help Center", "Affiliate Program"],
  "Community": ["Community Forums", "Blog", "Authors", "Refer a Friend"],
  "Company": ["About ThemeVault", "Careers", "Terms & Conditions", "Privacy Policy"],
  "Admin": ["Admin Login"],
};

const linkRoutes: { [key: string]: string } = {
  "Help Center": "/help",
  "Contact Us": "/contact",
  "Author Help Center": "/help",
  "Affiliate Program": "#",
  "Community Forums": "#",
  "Blog": "/blog",
  "Authors": "#",
  "Refer a Friend": "#",
  "About ThemeVault": "/about",
  "Careers": "#",
  "Terms & Conditions": "/terms",
  "Privacy Policy": "/privacy",
  "Admin Login": "/admin/login",
  "WordPress Themes": "/products",
  "Website Templates": "/products",
  "HTML Templates": "/products",
  "Marketing": "/products",
  "CMS Templates": "/products",
  "Plugins": "/code",
};

const Footer = () => {
  return (
    <footer className="bg-header-bg text-header-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Logo & Social */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-4 hover:opacity-80 transition-opacity">
              <div className="text-primary text-2xl font-bold">⚡</div>
              <span className="text-header-foreground text-xl font-bold">themevault</span>
            </Link>
            <p className="text-header-foreground/60 text-sm mb-4">
              The world's largest marketplace for digital assets.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-header-foreground/60 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-header-foreground/60 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-header-foreground/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-header-foreground/60 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    {link === "Admin Login" ? (
                      <Link
                        to="/admin/login"
                        className="text-header-foreground/60 hover:text-primary text-sm transition-colors"
                      >
                        {link}
                      </Link>
                    ) : (
                      <Link
                        to={linkRoutes[link] || "#"}
                        className="text-header-foreground/60 hover:text-primary text-sm transition-colors"
                      >
                        {link}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-header-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-header-foreground/40 text-sm">
            © 2024 ThemeVault Pty Ltd. Trademarks and brands are the property of their respective
            owners.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-header-foreground/60 hover:text-primary text-sm transition-colors">
              License
            </a>
            <a href="#" className="text-header-foreground/60 hover:text-primary text-sm transition-colors">
              Market API
            </a>
            <a href="#" className="text-header-foreground/60 hover:text-primary text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
