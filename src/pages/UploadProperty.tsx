import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotButton from "@/components/ChatbotButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, MapPin, Image as ImageIcon, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listingsAPI } from "@/lib/api";
import { authAPI } from "@/lib/api";

const UploadProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = authAPI.getCurrentUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    propertyType: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nigeria",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: "",
    phoneNumber: "",
    latitude: "6.5244",
    longitude: "3.3792",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleChange("latitude", position.coords.latitude.toFixed(6));
          handleChange("longitude", position.coords.longitude.toFixed(6));
          toast({
            title: "Location detected",
            description: "Your coordinates have been updated",
          });
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enable location access or enter coordinates manually",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...newFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video must be less than 100MB",
          variant: "destructive",
        });
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to upload a property",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user.role !== "agent") {
      toast({
        title: "Agent Access Required",
        description: "Only agents can upload properties. Please register as an agent.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      let listingType = "";
      let propertyType = formData.propertyType;

      if (formData.category === "buy") {
        listingType = "sale";
      } else if (formData.category === "rent") {
        listingType = "rent";
      } else if (formData.category === "land") {
        listingType = "sale";
        propertyType = "land";
      } else if (formData.category === "phone") {
        listingType = "sale";
        propertyType = "commercial";
      }

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        propertyType: propertyType,
        listingType: listingType,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        location: {
          type: "Point",
          coordinates: [Number(formData.longitude), Number(formData.latitude)],
        },
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 1,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        images: imagePreviews.length > 0 ? imagePreviews : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"],
        status: "active",
      };

      await listingsAPI.createListing(listingData);

      toast({
        title: "Success!",
        description: "Your property has been listed successfully.",
      });

      navigate("/listings");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in as an agent to upload properties.
          </p>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== "agent") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Agent Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Only agents can upload properties. Please register as an agent to list properties.
          </p>
          <Button onClick={() => navigate("/register")}>Register as Agent</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">List Your Property</h1>
            <p className="text-muted-foreground">
              Fill in the details below to create your listing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <h2 className="text-2xl font-bold">Basic Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 4 Bedroom Duplex in Lekki"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => handleChange("category", val)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="phone">Second-hand Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.category && formData.category !== "land" && formData.category !== "phone" && (
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(val) => handleChange("propertyType", val)}
                      required
                    >
                      <SelectTrigger id="propertyType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="85000000"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Contact Phone *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+234 123 456 7890"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    required
                  />
                </div>

                {formData.category !== "land" && formData.category !== "phone" && (
                  <>
                    <div>
                      <Label htmlFor="area">Area (sqft) *</Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="2500"
                        value={formData.area}
                        onChange={(e) => handleChange("area", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="4"
                        value={formData.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="3"
                        value={formData.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {formData.category === "land" && (
                  <div>
                    <Label htmlFor="area">Land Size (sqft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="5000"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <h2 className="text-2xl font-bold">Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="123 Admiralty Way"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Lagos"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="Lagos"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="106104"
                    value={formData.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Location Coordinates (300m Buffer) */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Location Coordinates</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLocationRequest}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter coordinates or use your current location. The system will create a 300-meter buffer zone around this point.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="6.5244"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="3.3792"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Tip: You can use Google Maps to find exact coordinates - just right-click on a location and copy the coordinates
              </p>
            </div>

            {/* Media Upload */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <h2 className="text-2xl font-bold">Media Upload</h2>
              
              {/* Images */}
              <div>
                <Label>Property Images *</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video */}
              <div>
                <Label>Property Video (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload video (MP4, WebM)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum 100MB
                    </p>
                  </label>
                </div>
                {videoPreview && (
                  <div className="mt-4 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg max-h-96"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <h2 className="text-2xl font-bold">Additional Features</h2>
              
              <div>
                <Label htmlFor="features">Property Features (comma separated)</Label>
                <Input
                  id="features"
                  placeholder="parking, pool, gym, security, wifi, garden"
                  value={formData.features}
                  onChange={(e) => handleChange("features", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate features with commas
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                <Upload className="h-5 w-5 mr-2" />
                {loading ? "Uploading..." : "Submit Listing"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/listings")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default UploadProperty;