import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Star, Calendar, DollarSign, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TouristPlace } from "@/data/indianDestinations";

interface PlaceDetailModalProps {
  place: (TouristPlace & { stateName: string }) | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlaceDetailModal = ({ place, isOpen, onClose }: PlaceDetailModalProps) => {
  if (!place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-card rounded-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-48 md:h-64 flex-shrink-0">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Rating Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{place.rating}</span>
              </div>

              {/* Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
                  {place.name}
                </h2>
                <p className="text-white/80 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {place.stateName}, India
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">From ₹{place.avgCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{place.bestTime}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Top Attractions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Things to Do
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {place.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-card">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button className="flex-1 btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Trip
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailModal;
