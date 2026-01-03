import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Calendar, Users, Star, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  distance: string;
}

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  placeName: string;
}

const HotelBookingModal = ({ isOpen, onClose, hotel, placeName }: HotelBookingModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
    name: "",
    email: "",
    phone: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!hotel) return null;

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const totalPrice = nights * hotel.pricePerNight * parseInt(formData.rooms);

  const handleBooking = async () => {
    if (!formData.checkIn || !formData.checkOut || !formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (nights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Check-out must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsBooking(false);
    setBookingConfirmed(true);
    
    toast({
      title: "Booking Confirmed!",
      description: `Your stay at ${hotel.name} has been booked.`,
    });
  };

  const handleClose = () => {
    setBookingConfirmed(false);
    setFormData({
      checkIn: "",
      checkOut: "",
      guests: "2",
      rooms: "1",
      name: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  if (bookingConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Your reservation at {hotel.name} has been confirmed.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-left mb-6">
              <p className="text-sm mb-1"><strong>Check-in:</strong> {formData.checkIn}</p>
              <p className="text-sm mb-1"><strong>Check-out:</strong> {formData.checkOut}</p>
              <p className="text-sm mb-1"><strong>Rooms:</strong> {formData.rooms}</p>
              <p className="text-sm mb-1"><strong>Total:</strong> ₹{totalPrice.toLocaleString("en-IN")}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Confirmation email sent to {formData.email}
            </p>
            <Button onClick={handleClose} className="btn-gradient">
              Done
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="w-5 h-5 text-primary" />
            Book {hotel.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hotel Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{hotel.name}</h3>
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-sm font-medium">{hotel.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{placeName} • {hotel.distance}</p>
            <p className="text-lg font-bold text-primary">
              ₹{hotel.pricePerNight.toLocaleString("en-IN")} <span className="text-sm font-normal text-muted-foreground">per night</span>
            </p>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date *</Label>
              <Input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Check-out Date *</Label>
              <Input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Guests</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rooms</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold mb-2">Price Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>₹{hotel.pricePerNight.toLocaleString("en-IN")} × {nights} nights × {formData.rooms} room(s)</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleBooking}
            className="w-full btn-gradient"
            disabled={isBooking}
          >
            {isBooking ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelBookingModal;
