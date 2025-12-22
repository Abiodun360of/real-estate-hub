import { Link, useNavigate } from "react-router-dom";
import { Home, Search, MapPin, Smartphone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Home className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              HomeFinder
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/listings?category=buy">
                <Search className="h-4 w-4 mr-2" />
                Buy
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?category=rent">
                <Home className="h-4 w-4 mr-2" />
                Rent
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?category=land">
                <MapPin className="h-4 w-4 mr-2" />
                Land
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/listings?category=phone">
                <Smartphone className="h-4 w-4 mr-2" />
                Phones
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/upload">List Property</Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Home className="h-4 w-4 mr-2" />
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?category=buy">Buy</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?category=rent">Rent</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?category=land">Land</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/listings?category=phone">Phones</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;