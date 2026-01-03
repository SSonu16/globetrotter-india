import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Camera,
  Share2,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Heart,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Multi-City Planning",
      description:
        "Plan trips across multiple cities with ease. Add stops, reorder destinations, and create the perfect route for your Indian adventure.",
    },
    {
      icon: Calendar,
      title: "Smart Itineraries",
      description:
        "Build day-by-day itineraries with activities, timings, and locations. Drag and drop to reorganize your perfect schedule.",
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description:
        "Track expenses in real-time with detailed breakdowns by category. Set budgets and get alerts when you're close to limits.",
    },
    {
      icon: Camera,
      title: "Trip Photo Storage",
      description:
        "Store and organize photos for each trip. Create beautiful galleries and preserve your travel memories forever.",
    },
    {
      icon: Share2,
      title: "Share & Collaborate",
      description:
        "Share your itineraries with friends and family. Collaborate on trip planning and let others copy your perfect plans.",
    },
    {
      icon: Users,
      title: "Group Travel",
      description:
        "Plan trips with friends and family. Split costs, assign tasks, and keep everyone on the same page.",
    },
    {
      icon: Globe,
      title: "All India Coverage",
      description:
        "Explore destinations across all 28 states and 8 union territories. From Ladakh to Kerala, we've got India covered.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Access your trips on any device. Our responsive design works seamlessly on phones, tablets, and desktops.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is safe with us. We use industry-standard encryption to protect your travel plans and personal information.",
    },
    {
      icon: Zap,
      title: "Instant Sync",
      description:
        "Changes sync instantly across all devices. Never worry about losing your trip details or having outdated information.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description:
        "Save your favorite destinations, activities, and hotels. Quick access to places you love for future trips.",
    },
    {
      icon: Map,
      title: "Offline Access",
      description:
        "Download your itineraries for offline access. Stay on track even without internet connectivity.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground">GlobeTrotter</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link to="/features" className="text-foreground font-medium">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:flex">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="btn-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Plan
            <span className="hero-text-gradient block">Your Perfect Trip</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GlobeTrotter comes packed with powerful features to make your travel planning effortless and enjoyable.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to Start Planning?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of travelers who plan their trips with GlobeTrotter.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="btn-gradient text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 GlobeTrotter India. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Features;
