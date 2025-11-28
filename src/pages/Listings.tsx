import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ChatbotButton from "@/components/ChatbotButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Listings = () => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  // Sample properties
  const properties = [
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
    },
    {
      id: "4",
      title: "iPhone 14 Pro Max - Mint Condition",
      price: 899,
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
      type: "phone" as const,
    },
    {
      id: "5",
      title: "Cozy Studio Apartment",
      price: 1500,
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      type: "rent" as const,
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
    },
    {
      id: "6",
      title: "Spacious Villa with Pool",
      price: 1250000,
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      type: "sale" as const,
      bedrooms: 5,
      bathrooms: 4,
      area: 4000,
      featured: true,
    },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Property Type</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="phones">Phones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Bedrooms</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Bathrooms</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Price Range</h3>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000000}
          step={10000}
          className="w-full"
        />
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Property Listings</h1>
          <p className="text-muted-foreground">
            Showing {properties.length} properties
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by location, title..."
              className="pl-10 h-12"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="lg:hidden">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-card rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                Filters
              </h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Property Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Listings;
