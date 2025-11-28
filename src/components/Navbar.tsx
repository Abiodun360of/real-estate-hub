import { Link } from "react-router-dom";
import { Home, Search, MapPin, Smartphone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Home className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              HomeFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/listings?type=buy">
                <Search className="h-4 w-4 mr-2" />
                Buy
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?type=rent">
                <Home className="h-4 w-4 mr-2" />
                Rent
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?type=land">
                <MapPin className="h-4 w-4 mr-2" />
                Land
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?type=phones">
                <Smartphone className="h-4 w-4 mr-2" />
                Phones
              </Link>
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/upload">List Property</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?type=buy">Buy</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?type=rent">Rent</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?type=land">Land</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?type=phones">Phones</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
