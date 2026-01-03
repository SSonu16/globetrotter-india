import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jaipurDest from "@/assets/destination-jaipur.jpg";
import keralaDest from "@/assets/destination-kerala.jpg";
import goaDest from "@/assets/destination-goa.jpg";

const TripList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trips = [
    {
      id: 1,
      name: "Rajasthan Royal Tour",
      startDate: "Mar 15, 2025",
      endDate: "Mar 25, 2025",
      cities: ["Jaipur", "Udaipur", "Jodhpur"],
      status: "upcoming",
      image: jaipurDest,
    },
    {
      id: 2,
      name: "Kerala Backwaters Escape",
      startDate: "Apr 10, 2025",
      endDate: "Apr 18, 2025",
      cities: ["Kochi", "Alleppey", "Munnar"],
      status: "upcoming",
      image: keralaDest,
    },
    {
      id: 3,
      name: "Goa Beach Holiday",
      startDate: "Jan 5, 2025",
      endDate: "Jan 12, 2025",
      cities: ["North Goa", "South Goa", "Panjim"],
      status: "completed",
      image: goaDest,
    },
  ];

  const filteredTrips = trips.filter((trip) =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
          <Link to="/trips/new">
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Trips
              </h1>
              <p className="text-muted-foreground">
                Manage and view all your planned Indian adventures.
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Trip List */}
          <div className="space-y-4">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No trips found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start planning your first Indian adventure!"}
                </p>
                <Link to="/trips/new">
                  <Button className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Trip
                  </Button>
                </Link>
              </div>
            ) : (
              filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden card-hover"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 h-40 sm:h-auto overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-display text-xl font-semibold text-foreground">
                              {trip.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                trip.status === "upcoming"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {trip.status === "upcoming" ? "Upcoming" : "Completed"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {trip.startDate} - {trip.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {trip.cities.length} cities
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {trip.cities.map((city) => (
                              <span
                                key={city}
                                className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                              >
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Trip
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Trip
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Trip
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TripList;
