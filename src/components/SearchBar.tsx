import { Search, MapPin, Home, DollarSign, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const SearchBar = () => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  return (
    <div className="bg-card rounded-xl shadow-medium p-6 space-y-4">
      {/* Location Search */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter location, city, or address..."
          className="pl-10 h-12"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Property Type */}
        <Select>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Bedrooms" />
            </div>
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

        {/* Category */}
        <Select>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Buy or Rent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="phones">Phones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-primary" />
            Price Range
          </label>
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

      {/* Search Button */}
      <Button size="lg" className="w-full h-12">
        <Search className="h-5 w-5 mr-2" />
        Search Properties
      </Button>
    </div>
  );
};

export default SearchBar;
