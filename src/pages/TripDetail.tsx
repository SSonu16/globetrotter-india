import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Share2,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jaipurDest from "@/assets/destination-jaipur.jpg";

const TripDetail = () => {
  const { id } = useParams();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Mock trip data - Rajasthan
  const trip = {
    id: 1,
    name: "Rajasthan Royal Tour",
    startDate: "Mar 15, 2025",
    endDate: "Mar 25, 2025",
    description: "A majestic journey through the land of kings, exploring forts, palaces, and vibrant culture.",
    coverImage: jaipurDest,
    budget: 45000,
    spent: 18000,
    cities: [
      { name: "Jaipur", state: "Rajasthan", days: 3 },
      { name: "Udaipur", state: "Rajasthan", days: 3 },
      { name: "Jodhpur", state: "Rajasthan", days: 4 },
    ],
    itinerary: [
      {
        day: 1,
        date: "Mar 15",
        city: "Jaipur",
        activities: [
          { time: "09:00", name: "Arrival at Jaipur Airport", duration: "1h", cost: 0 },
          { time: "11:00", name: "Check-in at Hotel Narain Niwas", duration: "1h", cost: 4500 },
          { time: "13:00", name: "Lunch at Laxmi Misthan Bhandar", duration: "1.5h", cost: 500 },
          { time: "15:00", name: "City Palace Visit", duration: "3h", cost: 500 },
          { time: "19:00", name: "Dinner at Chokhi Dhani", duration: "3h", cost: 1200 },
        ],
      },
      {
        day: 2,
        date: "Mar 16",
        city: "Jaipur",
        activities: [
          { time: "06:00", name: "Sunrise at Amber Fort", duration: "4h", cost: 200 },
          { time: "11:00", name: "Hawa Mahal Visit", duration: "1.5h", cost: 50 },
          { time: "13:00", name: "Lunch at Tapri Central", duration: "1h", cost: 400 },
          { time: "15:00", name: "Jantar Mantar Observatory", duration: "2h", cost: 200 },
          { time: "18:00", name: "Shopping at Johari Bazaar", duration: "2h", cost: 2000 },
        ],
      },
      {
        day: 3,
        date: "Mar 17",
        city: "Jaipur",
        activities: [
          { time: "09:00", name: "Nahargarh Fort Trek", duration: "3h", cost: 200 },
          { time: "13:00", name: "Lunch at Suvarna Mahal", duration: "2h", cost: 1500 },
          { time: "16:00", name: "Jal Mahal Photo Stop", duration: "1h", cost: 0 },
          { time: "18:00", name: "Depart to Udaipur by Train", duration: "6h", cost: 800 },
        ],
      },
    ],
  };

  const budgetCategories = [
    { label: "Transport", amount: 6000, percentage: 33 },
    { label: "Accommodation", amount: 7000, percentage: 39 },
    { label: "Activities", amount: 2500, percentage: 14 },
    { label: "Food", amount: 2500, percentage: 14 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/trips">
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {trip.startDate} - {trip.endDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {trip.cities.length} cities
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                ₹{trip.budget.toLocaleString('en-IN')} budget
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {/* City Route */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Trip Route
                </h2>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add City
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {trip.cities.map((city, index) => (
                  <div key={city.name} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <span className="font-medium text-foreground">{city.name}</span>
                      <span className="text-sm text-muted-foreground">({city.days} days)</span>
                    </div>
                    {index < trip.cities.length - 1 && (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Day-by-Day Plan
                </h2>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              {trip.itinerary.map((day) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    className="w-full flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-display text-lg font-bold text-primary">
                          {day.day}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">
                          Day {day.day} - {day.city}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {day.date} • {day.activities.length} activities
                        </p>
                      </div>
                    </div>
                    {expandedDay === day.day ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedDay === day.day && (
                    <div className="px-6 pb-6 space-y-3">
                      {day.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl group"
                        >
                          <div className="text-sm font-medium text-primary w-14">
                            {activity.time}
                          </div>
                          <div className="w-px h-8 bg-border" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{activity.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.duration}
                              </span>
                              {activity.cost > 0 && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  ₹{activity.cost.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Budget Summary
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-semibold text-foreground">
                        ₹{trip.spent.toLocaleString('en-IN')} / ₹{trip.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Progress value={(trip.spent / trip.budget) * 100} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                      <p className="font-display text-2xl font-bold text-success">
                        ₹{(trip.budget - trip.spent).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Avg. Per Day</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        ₹{Math.round(trip.spent / 10).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Spending Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Spending by Category
                </h2>
                <div className="space-y-4">
                  {budgetCategories.map((category, index) => (
                    <div key={category.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground">{category.label}</span>
                        <span className="font-semibold text-foreground">₹{category.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            index === 0
                              ? "bg-primary"
                              : index === 1
                              ? "bg-accent"
                              : index === 2
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No photos yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Add photos from your Rajasthan trip to create lasting memories.
              </p>
              <Button className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TripDetail;
