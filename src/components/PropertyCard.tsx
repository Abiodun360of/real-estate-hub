import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  type: "rent" | "sale" | "land" | "phone";
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featured?: boolean;
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  image,
  type,
  bedrooms,
  bathrooms,
  area,
  featured = false,
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden group hover:shadow-medium transition-all duration-300 animate-fade-in">
      <Link to={`/property/${id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {featured && (
            <Badge className="absolute top-3 left-3 bg-accent">Featured</Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`}
            />
          </Button>
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 capitalize"
          >
            {type}
          </Badge>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link to={`/property/${id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1 text-primary" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {type !== "phone" && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {bedrooms && (
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{area} sqft</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">
              ₦{price.toLocaleString()}
            </span>
            {type === "rent" && (
              <span className="text-muted-foreground text-sm">/month</span>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/property/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
