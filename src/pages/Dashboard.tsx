import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Search,
  Bell,
  User,
  ChevronRight,
  TrendingUp,
  Clock,
  Plane,
  Camera,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import parisDest from "@/assets/destination-paris.jpg";
import tokyoDest from "@/assets/destination-tokyo.jpg";
import baliDest from "@/assets/destination-bali.jpg";

const Dashboard = () => {
  const [userName] = useState("Traveler");

  // Mock data for trips
  const upcomingTrips = [
    {
      id: 1,
      name: "European Adventure",
      startDate: "Mar 15, 2025",
      endDate: "Apr 2, 2025",
      cities: ["Paris", "Rome", "Barcelona"],
      budget: 5000,
      spent: 2340,
      image: parisDest,
      daysLeft: 72,
    },
    {
      id: 2,
      name: "Japan Cherry Blossom",
      startDate: "Apr 10, 2025",
      endDate: "Apr 24, 2025",
      cities: ["Tokyo", "Kyoto", "Osaka"],
      budget: 4500,
      spent: 1200,
      image: tokyoDest,
      daysLeft: 98,
    },
  ];

  const popularDestinations = [
    { name: "Paris", country: "France", image: parisDest, avgCost: 2500 },
    { name: "Tokyo", country: "Japan", image: tokyoDest, avgCost: 3200 },
    { name: "Bali", country: "Indonesia", image: baliDest, avgCost: 1800 },
  ];

  const recentActivity = [
    { type: "added", item: "Eiffel Tower Visit", trip: "European Adventure", time: "2 hours ago" },
    { type: "budget", item: "Updated budget", trip: "Japan Cherry Blossom", time: "5 hours ago" },
    { type: "city", item: "Added Barcelona", trip: "European Adventure", time: "1 day ago" },
  ];

  const budgetStats = {
    totalPlanned: 9500,
    totalSpent: 3540,
    avgPerDay: 180,
  };

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

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search trips, destinations..."
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Long Vertical Scroll */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to plan your next adventure? You have {upcomingTrips.length} upcoming trips.
              </p>
            </div>
            <Link to="/trips/new">
              <Button size="lg" className="btn-gradient">
                <Plus className="w-5 h-5 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              icon: Plane,
              label: "Upcoming Trips",
              value: upcomingTrips.length,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: MapPin,
              label: "Cities to Visit",
              value: upcomingTrips.reduce((acc, t) => acc + t.cities.length, 0),
              color: "text-success",
              bg: "bg-success/10",
            },
            {
              icon: DollarSign,
              label: "Total Budget",
              value: `$${budgetStats.totalPlanned.toLocaleString()}`,
              color: "text-accent",
              bg: "bg-accent/10",
            },
            {
              icon: TrendingUp,
              label: "Avg. Per Day",
              value: `$${budgetStats.avgPerDay}`,
              color: "text-warning",
              bg: "bg-warning/10",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 border border-border card-hover"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.section>

        {/* Upcoming Trips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Upcoming Trips</h2>
            <Link to="/trips" className="text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`}>
                <div className="bg-card rounded-3xl overflow-hidden border border-border card-hover group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                        {trip.name}
                      </h3>
                      <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                        <Calendar className="w-4 h-4" />
                        {trip.startDate} - {trip.endDate}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {trip.daysLeft} days left
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">
                        {trip.cities.join(" → ")}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Budget progress</span>
                        <span className="font-semibold text-foreground">
                          ${trip.spent} / ${trip.budget}
                        </span>
                      </div>
                      <Progress value={(trip.spent / trip.budget) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Budget Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-card rounded-3xl p-8 border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Budget Overview</h2>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(budgetStats.totalSpent / budgetStats.totalPlanned) * 352} 352`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-foreground">
                    {Math.round((budgetStats.totalSpent / budgetStats.totalPlanned) * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">Total Spent</p>
              <p className="font-display text-xl font-bold text-foreground">
                ${budgetStats.totalSpent.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Spending by Category</h3>
              {[
                { label: "Transport", value: 1200, color: "bg-primary" },
                { label: "Accommodation", value: 1500, color: "bg-accent" },
                { label: "Activities", value: 540, color: "bg-success" },
                { label: "Food & Dining", value: 300, color: "bg-warning" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
                  <span className="font-semibold text-foreground">${item.value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Budget Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success/10 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-foreground">
                    You're 15% under budget for European Adventure. Great job!
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-warning" />
                  </div>
                  <p className="text-sm text-foreground">
                    Book flights 6 weeks ahead for best prices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Popular Destinations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Popular Destinations</h2>
            <Link to="/explore" className="text-primary hover:underline flex items-center gap-1">
              Explore all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest) => (
              <div
                key={dest.name}
                className="bg-card rounded-2xl overflow-hidden border border-border card-hover group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{dest.name}</h3>
                      <p className="text-sm text-muted-foreground">{dest.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-semibold text-primary">${dest.avgCost}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-card rounded-3xl p-8 border border-border"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Recent Activity</h2>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "added"
                      ? "bg-success/10"
                      : activity.type === "budget"
                      ? "bg-warning/10"
                      : "bg-primary/10"
                  }`}
                >
                  {activity.type === "added" ? (
                    <Camera className="w-5 h-5 text-success" />
                  ) : activity.type === "budget" ? (
                    <DollarSign className="w-5 h-5 text-warning" />
                  ) : (
                    <MapPin className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.trip}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
