import { useState } from "react";
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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Upload, MapPin, Image as ImageIcon, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Marker component
const LocationMarker = ({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e: any) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
        },
      }}
    />
  ) : null;
};

const UploadProperty = () => {
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [mapPosition, setMapPosition] = useState<[number, number]>([
    34.0522, -118.2437,
  ]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Handle location request
  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setMapPosition(newPos);
          toast({
            title: "Location detected",
            description: "Map has been centered to your current location",
          });
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enable location access to use this feature",
            variant: "destructive",
          });
        }
      );
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles((prev) => [...prev, ...Array.from(files)]);
      setImagePreviews((prev) => [
        ...prev,
        ...Array.from(files).map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  // Handle video upload
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

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("category", category);
    form.append("price", price);
    form.append("phone", phoneNumber);
    form.append("address", address);
    form.append(
      "attrs",
      JSON.stringify({
        bedrooms,
        bathrooms,
      })
    );
    form.append("lat", mapPosition[0].toString());
    form.append("lng", mapPosition[1].toString());

    imageFiles.forEach((file) => form.append("images", file));
    if (videoFile) form.append("video", videoFile);

    try {
      const res = await fetch("http://localhost:4000/api/listings", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      toast({
        title: "Success!",
        description: "Your listing has been uploaded.",
      });
      console.log("Listing created:", data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Upload failed.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

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
                    placeholder="e.g., Modern Family Home with Garden"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={category}
                    onValueChange={(val) => setCategory(val)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="phone">Second-hand Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="450000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="4"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="3"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <h2 className="text-2xl font-bold">Media</h2>
              {/* Images */}
              <div>
                <Label>Images *</Label>
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
                <Label>Video (Optional, max 100MB)</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload video (MP4 only)
                    </p>
                  </label>
                </div>
                {videoPreview && (
                  <div className="mt-4 relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setVideoPreview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-xl shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Location</h2>
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
                Click on the map or drag the marker to set the exact location
              </p>
              <div className="h-[400px] rounded-xl overflow-hidden border border-border">
                <MapContainer
                  center={mapPosition}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker
                    position={mapPosition}
                    setPosition={setMapPosition}
                  />
                </MapContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input value={mapPosition[0].toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={mapPosition[1].toFixed(6)} readOnly />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                <Upload className="h-5 w-5 mr-2" />
                Submit Listing
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save as Draft
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
