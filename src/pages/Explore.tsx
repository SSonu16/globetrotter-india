import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jaipurDest from "@/assets/destination-jaipur.jpg";
import keralaDest from "@/assets/destination-kerala.jpg";
import varanasiDest from "@/assets/destination-varanasi.jpg";
import goaDest from "@/assets/destination-goa.jpg";
import ladakhDest from "@/assets/destination-ladakh.jpg";
import heroIndia from "@/assets/hero-india.jpg";
import logo from "@/assets/logo.jpg";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = [
    { id: "all", name: "All India" },
    { id: "north", name: "North" },
    { id: "south", name: "South" },
    { id: "east", name: "East" },
    { id: "west", name: "West" },
    { id: "central", name: "Central" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Jaipur",
      state: "Rajasthan",
      region: "north",
      image: jaipurDest,
      rating: 4.9,
      avgCost: 18000,
      popularity: "Very High",
      costIndex: "Medium",
    },
    {
      id: 2,
      name: "Kerala Backwaters",
      state: "Kerala",
      region: "south",
      image: keralaDest,
      rating: 4.8,
      avgCost: 25000,
      popularity: "Very High",
      costIndex: "Medium",
    },
    {
      id: 3,
      name: "Varanasi",
      state: "Uttar Pradesh",
      region: "north",
      image: varanasiDest,
      rating: 4.7,
      avgCost: 12000,
      popularity: "High",
      costIndex: "Low",
    },
    {
      id: 4,
      name: "Goa",
      state: "Goa",
      region: "west",
      image: goaDest,
      rating: 4.8,
      avgCost: 20000,
      popularity: "Very High",
      costIndex: "Medium",
    },
    {
      id: 5,
      name: "Ladakh",
      state: "Ladakh",
      region: "north",
      image: ladakhDest,
      rating: 4.9,
      avgCost: 45000,
      popularity: "High",
      costIndex: "High",
    },
    {
      id: 6,
      name: "Agra",
      state: "Uttar Pradesh",
      region: "north",
      image: heroIndia,
      rating: 4.9,
      avgCost: 10000,
      popularity: "Very High",
      costIndex: "Low",
    },
    {
      id: 7,
      name: "Udaipur",
      state: "Rajasthan",
      region: "north",
      image: jaipurDest,
      rating: 4.8,
      avgCost: 22000,
      popularity: "High",
      costIndex: "Medium",
    },
    {
      id: 8,
      name: "Rishikesh",
      state: "Uttarakhand",
      region: "north",
      image: ladakhDest,
      rating: 4.6,
      avgCost: 15000,
      popularity: "High",
      costIndex: "Low",
    },
    {
      id: 9,
      name: "Mumbai",
      state: "Maharashtra",
      region: "west",
      image: goaDest,
      rating: 4.5,
      avgCost: 25000,
      popularity: "Very High",
      costIndex: "High",
    },
  ];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground hidden sm:block">
              GlobeTrotter
            </span>
          </Link>
          <Link to="/auth">
            <Button className="btn-gradient">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore India
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover amazing destinations across Incredible India and add them to your trips.
          </p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations, states..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={selectedRegion === region.id ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region.id)}
                  className={selectedRegion === region.id ? "btn-gradient" : ""}
                >
                  {region.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-card rounded-2xl overflow-hidden border border-border card-hover group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-sm font-medium">{dest.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {dest.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold text-primary">₹{dest.avgCost.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      {dest.popularity}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      {dest.costIndex}
                    </span>
                  </div>
                  <Button className="w-full mt-4 btn-gradient">Add to Trip</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Explore;
