import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  ArrowLeft,
  Calendar,
  Upload,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Trip Created! 🎉",
        description: `Your trip "${formData.name}" has been created successfully.`,
      });
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Plan a New Trip
          </h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to start planning your adventure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Photo */}
            <div className="space-y-2">
              <Label>Cover Photo (Optional)</Label>
              <div
                className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-colors ${
                  coverPreview ? "border-transparent" : "border-border hover:border-primary/50"
                }`}
              >
                {coverPreview ? (
                  <div className="relative aspect-video">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverPreview(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-foreground/80 hover:bg-foreground rounded-full flex items-center justify-center text-primary-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <span className="text-muted-foreground">Click to upload a cover photo</span>
                    <span className="text-sm text-muted-foreground/70 mt-1">
                      JPG, PNG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Trip Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Trip Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., European Summer Adventure"
                className="h-12"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10 h-12"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10 h-12"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your trip plans, goals, or any notes..."
                className="min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Info Card */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">What's Next?</h3>
                  <p className="text-sm text-muted-foreground">
                    After creating your trip, you'll be able to add cities, build your day-by-day
                    itinerary, track your budget, and add activities for each destination.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="btn-gradient flex-1 h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Trip"}
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateTrip;
