import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Eye,
  ExternalLink,
} from "lucide-react";
import { listingsAPI } from "@/lib/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await listingsAPI.getListing(id!);
        setProperty(data.listing);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl">Loading property...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => navigate("/listings")}>Back to Listings</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  const coordinates = property.location?.coordinates || [3.3792, 6.5244];
  const mapCenter = [coordinates[1], coordinates[0]]; // [lat, lng]

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-muted shadow-medium group">
            <img
              src={property.images[currentImageIndex] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {property.images.length > 1 && (
              <>
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

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}

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

          {property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {property.images.slice(0, 4).map((image: string, index: number) => (
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
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  For {property.listingType}
                </Badge>
                <Badge variant="outline">{property.propertyType}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {property.views} views
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-3">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>
                  {property.address.street}, {property.address.city}, {property.address.state}
                </span>
              </div>
            </div>

            {/* Price & Features */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">
                  ₦{property.price.toLocaleString()}
                </span>
                {property.listingType === 'rent' && (
                  <span className="text-muted-foreground text-lg">/month</span>
                )}
              </div>
              {property.bedrooms > 0 && (
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
              )}
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-card rounded-xl shadow-soft p-6">
                <h2 className="text-2xl font-bold mb-4">Property Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature: string, index: number) => (
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
            )}

            {/* Location Map with 300m Buffer */}
<div className="bg-card rounded-xl shadow-soft p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">Property Location</h2>
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(`https://www.google.com/maps?q=${mapCenter[0]},${mapCenter[1]}`, '_blank')}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Open in Google Maps
    </Button>
  </div>
  
  {/* OpenStreetMap Embed */}
  <div className="relative h-[450px] rounded-xl overflow-hidden border-2 border-border shadow-lg">
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates[0] - 0.004},${coordinates[1] - 0.004},${coordinates[0] + 0.004},${coordinates[1] + 0.004}&layer=mapnik&marker=${coordinates[1]},${coordinates[0]}`}
      style={{ border: 0 }}
    />
    
    {/* 300m Buffer Circle Overlay */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
      <circle 
        cx="400" 
        cy="225" 
        r="120" 
        fill="rgba(59, 130, 246, 0.15)" 
        stroke="rgb(59, 130, 246)" 
        strokeWidth="4"
        strokeDasharray="10,5"
      />
      <rect
        x="320"
        y="345"
        width="160"
        height="30"
        fill="rgba(0, 0, 0, 0.7)"
        rx="15"
      />
      <text 
        x="400" 
        y="365" 
        textAnchor="middle" 
        fill="white" 
        fontSize="16" 
        fontWeight="bold"
      >
        300m Coverage Area
      </text>
    </svg>
  </div>
  
  {/* Legend */}
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
      <div className="h-8 w-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex-shrink-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
      </div>
      <div className="text-sm">
        <p className="font-semibold">Coverage Area</p>
        <p className="text-xs text-muted-foreground">300m radius shown</p>
      </div>
    </div>
    
    <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
      <MapPin className="h-8 w-8 text-red-500 flex-shrink-0" />
      <div className="text-sm">
        <p className="font-semibold">Coordinates</p>
        <p className="text-xs text-muted-foreground font-mono">
          {mapCenter[0].toFixed(6)}, {mapCenter[1].toFixed(6)}
        </p>
      </div>
    </div>
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
                  <div className="font-semibold">{property.agent.name}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div className="font-semibold text-sm">{property.agent.email}</div>
                </div>

                {property.agent.phone && (
                  <Button className="w-full" size="lg">
                    <Phone className="h-5 w-5 mr-2" />
                    {property.agent.phone}
                  </Button>
                )}

                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Email
                </Button>
              </div>

              <div className="pt-4 border-t border-border text-sm text-muted-foreground text-center">
                Listed {new Date(property.createdAt).toLocaleDateString()}
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