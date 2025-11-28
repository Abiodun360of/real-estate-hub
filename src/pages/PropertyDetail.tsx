import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Phone,
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuffer, setShowBuffer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample property data
  const property = {
    title: "Modern Family Home with Garden",
    price: 450000,
    type: "sale",
    location: "123 Beverly Hills, CA 90210",
    coordinates: { lat: 34.0736, lng: -118.4004 },
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    description:
      "Beautiful modern family home featuring spacious living areas, a gourmet kitchen with stainless steel appliances, and a large backyard perfect for entertaining. Recently renovated with hardwood floors throughout. Walking distance to top-rated schools and shopping centers.",
    features: [
      "Central Air Conditioning",
      "Hardwood Floors",
      "Garage Parking (2 cars)",
      "Garden/Backyard",
      "Modern Kitchen",
      "Security System",
      "Near Schools",
      "Shopping Nearby",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    ],
    videoUrl: null,
    contact: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john.smith@homefinder.com",
    },
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-muted shadow-medium group">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Navigation Buttons */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`}
                />
              </Button>
              <Button size="icon" variant="secondary">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-primary scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  For {property.type}
                </Badge>
                <Badge variant="outline">Featured</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-3">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Price & Features */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Area</div>
                    <div className="font-semibold">{property.area} sqft</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold mb-4">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm bg-muted rounded-lg p-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Location</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBuffer(!showBuffer)}
                >
                  {showBuffer ? "Hide" : "Show"} 300m Buffer
                </Button>
              </div>
              <div className="h-[400px] rounded-xl overflow-hidden border border-border">
                <MapContainer
                  center={[property.coordinates.lat, property.coordinates.lng] as [number, number]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[property.coordinates.lat, property.coordinates.lng] as [number, number]}
                  >
                    <Popup>{property.title}</Popup>
                  </Marker>
                  {showBuffer && (
                    <Circle
                      center={[property.coordinates.lat, property.coordinates.lng] as [number, number]}
                      radius={300}
                      pathOptions={{
                        color: "hsl(189, 85%, 48%)",
                        fillColor: "hsl(189, 85%, 48%)",
                        fillOpacity: 0.2,
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div>
            <div className="sticky top-20 bg-card rounded-xl shadow-medium p-6 space-y-4">
              <h3 className="text-xl font-bold">Contact Agent</h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Agent Name</div>
                  <div className="font-semibold">{property.contact.name}</div>
                </div>

                <Button className="w-full" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  {property.contact.phone}
                </Button>

                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Email
                </Button>
              </div>

              <div className="pt-4 border-t border-border text-sm text-muted-foreground text-center">
                Available 24/7 for inquiries
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default PropertyDetail;
