import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Calendar, Users, Search, ArrowRight, X } from "lucide-react";
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

interface FlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationAirport: {
    name: string;
    code: string;
  };
}

const FlightSearchModal = ({ isOpen, onClose, destinationAirport }: FlightSearchModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const handleSearch = async () => {
    if (!formData.from || !formData.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in departure city and date",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate flight search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockFlights = [
      {
        airline: "Air India",
        flightNo: "AI-302",
        departure: "06:30",
        arrival: "09:15",
        duration: "2h 45m",
        price: Math.floor(Math.random() * 5000) + 3500,
        stops: 0,
      },
      {
        airline: "IndiGo",
        flightNo: "6E-1024",
        departure: "08:45",
        arrival: "11:30",
        duration: "2h 45m",
        price: Math.floor(Math.random() * 4000) + 2800,
        stops: 0,
      },
      {
        airline: "Vistara",
        flightNo: "UK-832",
        departure: "14:20",
        arrival: "17:05",
        duration: "2h 45m",
        price: Math.floor(Math.random() * 6000) + 4000,
        stops: 0,
      },
      {
        airline: "SpiceJet",
        flightNo: "SG-456",
        departure: "19:00",
        arrival: "22:15",
        duration: "3h 15m",
        price: Math.floor(Math.random() * 3000) + 2500,
        stops: 1,
      },
    ];

    setSearchResults(mockFlights);
    setIsSearching(false);
  };

  const handleBookFlight = (flight: any) => {
    toast({
      title: "Booking Initiated",
      description: `Redirecting to book ${flight.airline} ${flight.flightNo}...`,
    });
    // In a real app, this would redirect to a booking page
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plane className="w-5 h-5 text-primary" />
            Search Flights to {destinationAirport.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                placeholder="Enter departure city (e.g., Delhi, Mumbai)"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                value={`${destinationAirport.name} (${destinationAirport.code})`}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Return Date (Optional)</Label>
              <Input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passengers</Label>
              <Input
                type="number"
                min="1"
                max="9"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full btn-gradient"
            disabled={isSearching}
          >
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>

          {/* Search Results */}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg">
                Available Flights ({searchResults.length})
              </h3>
              <div className="space-y-3">
                {searchResults.map((flight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">{flight.airline}</span>
                        <span className="text-sm text-muted-foreground">{flight.flightNo}</span>
                        {flight.stops === 0 && (
                          <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                            Non-stop
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">{flight.departure}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{flight.arrival}</span>
                        <span className="text-muted-foreground">({flight.duration})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        ₹{flight.price.toLocaleString("en-IN")}
                      </p>
                      <Button
                        size="sm"
                        className="mt-2 btn-gradient"
                        onClick={() => handleBookFlight(flight)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlightSearchModal;
