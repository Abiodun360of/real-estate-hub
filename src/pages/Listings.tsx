import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { listingsAPI } from "@/lib/api";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params: any = {};
        
        if (searchTerm) params.search = searchTerm;
        if (propertyType !== "all") params.propertyType = propertyType;
        
        // Map category to backend format
        if (category !== "all") {
          if (category === "buy") {
            params.listingType = "sale";
          } else if (category === "rent") {
            params.listingType = "rent";
          } else if (category === "land") {
            params.propertyType = "land";
            params.listingType = "sale";
          } else if (category === "phone") {
            params.propertyType = "commercial";
            params.listingType = "sale";
          }
        }
        
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 100000000) params.maxPrice = priceRange[1];

        const data = await listingsAPI.getListings(params);
        setListings(data.listings || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchTerm, propertyType, category, priceRange]);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="phone">Phones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Property Type</h3>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Price Range</h3>
          <span className="text-sm text-muted-foreground">
            ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100000000}
          step={1000000}
          className="w-full"
        />
      </div>

      <Button className="w-full" onClick={() => {}}>Apply Filters</Button>
    </div>
  );

  const convertedProperties = listings.map(listing => ({
    id: listing._id,
    title: listing.title,
    price: listing.price,
    location: `${listing.address.city}, ${listing.address.state}`,
    image: listing.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    type: listing.listingType,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    area: listing.area,
  }));

  const getCategoryTitle = () => {
    if (category === "buy") return "Properties for Sale";
    if (category === "rent") return "Properties for Rent";
    if (category === "land") return "Land for Sale";
    if (category === "phone") return "Second-hand Phones";
    return "All Properties";
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{getCategoryTitle()}</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${listings.length} properties`}
          </p>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by location, title..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-card rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2 text-primary" />
                Filters
              </h2>
              <FilterSidebar />
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl">Loading properties...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {convertedProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
            
            {!loading && listings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No properties found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Listings;