import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import ChatbotButton from "@/components/ChatbotButton";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-real-estate.jpg";

const Index = () => {
  // Sample featured properties
  const featuredProperties = [
    {
      id: "1",
      title: "Modern Family Home with Garden",
      price: 450000,
      location: "Beverly Hills, CA",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      type: "sale" as const,
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      featured: true,
    },
    {
      id: "2",
      title: "Luxury Downtown Apartment",
      price: 2500,
      location: "Manhattan, NY",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      type: "rent" as const,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
    },
    {
      id: "3",
      title: "Commercial Land Plot",
      price: 850000,
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      type: "land" as const,
      area: 5000,
      featured: true,
    },
    {
      id: "4",
      title: "iPhone 14 Pro Max - Mint Condition",
      price: 899,
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
      type: "phone" as const,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Property
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover amazing properties, land, and second-hand phones all in one place.
              Your perfect match is just a search away.
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/listings">
                Explore Listings
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <SearchBar />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6 rounded-xl hover:shadow-soft transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Fast & Easy</h3>
            <p className="text-muted-foreground">
              List your property or find your next home in minutes
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-xl hover:shadow-soft transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Trusted</h3>
            <p className="text-muted-foreground">
              Verified listings and secure transactions guaranteed
            </p>
          </div>

          <div className="text-center space-y-3 p-6 rounded-xl hover:shadow-soft transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Best Deals</h3>
            <p className="text-muted-foreground">
              Competitive prices and exclusive offers daily
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">
              Handpicked properties just for you
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/listings">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </section>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Index;
