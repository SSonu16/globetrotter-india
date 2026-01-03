import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  Filter,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import parisDest from "@/assets/destination-paris.jpg";
import tokyoDest from "@/assets/destination-tokyo.jpg";
import baliDest from "@/assets/destination-bali.jpg";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = [
    { id: "all", name: "All" },
    { id: "europe", name: "Europe" },
    { id: "asia", name: "Asia" },
    { id: "americas", name: "Americas" },
    { id: "oceania", name: "Oceania" },
    { id: "africa", name: "Africa" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Paris",
      country: "France",
      region: "europe",
      image: parisDest,
      rating: 4.9,
      avgCost: 2500,
      popularity: "Very High",
      costIndex: "High",
    },
    {
      id: 2,
      name: "Tokyo",
      country: "Japan",
      region: "asia",
      image: tokyoDest,
      rating: 4.8,
      avgCost: 3200,
      popularity: "Very High",
      costIndex: "High",
    },
    {
      id: 3,
      name: "Bali",
      country: "Indonesia",
      region: "asia",
      image: baliDest,
      rating: 4.7,
      avgCost: 1800,
      popularity: "High",
      costIndex: "Medium",
    },
    {
      id: 4,
      name: "Barcelona",
      country: "Spain",
      region: "europe",
      image: parisDest,
      rating: 4.7,
      avgCost: 2200,
      popularity: "High",
      costIndex: "Medium",
    },
    {
      id: 5,
      name: "New York",
      country: "USA",
      region: "americas",
      image: tokyoDest,
      rating: 4.6,
      avgCost: 3500,
      popularity: "Very High",
      costIndex: "Very High",
    },
    {
      id: 6,
      name: "Sydney",
      country: "Australia",
      region: "oceania",
      image: baliDest,
      rating: 4.7,
      avgCost: 2800,
      popularity: "High",
      costIndex: "High",
    },
  ];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
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
            Explore Destinations
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover amazing places to visit and add them to your trips.
          </p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
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
                        {dest.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold text-primary">${dest.avgCost}</p>
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
