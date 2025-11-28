import { Home, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted mt-20 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">HomeFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace for properties, land, and second-hand phones.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/listings?type=buy" className="hover:text-primary transition-colors">Buy Property</Link></li>
              <li><Link to="/listings?type=rent" className="hover:text-primary transition-colors">Rent Property</Link></li>
              <li><Link to="/listings?type=land" className="hover:text-primary transition-colors">Land Sales</Link></li>
              <li><Link to="/listings?type=phones" className="hover:text-primary transition-colors">Second-hand Phones</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Safety Tips</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@homefinder.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Real Estate St.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 HomeFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
