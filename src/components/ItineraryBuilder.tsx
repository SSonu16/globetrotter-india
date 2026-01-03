import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit2,
  Save,
  X,
  Utensils,
  Camera,
  Car,
  Bed,
  ShoppingBag,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useItinerary, ItineraryItem } from "@/hooks/useItinerary";
import { format, addDays, parseISO } from "date-fns";

interface ItineraryBuilderProps {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string | null;
  tripDuration: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  accommodation: <Bed className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  adventure: <Mountain className="w-4 h-4" />,
  activity: <Clock className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  sightseeing: "bg-blue-500/10 text-blue-500",
  food: "bg-orange-500/10 text-orange-500",
  transport: "bg-purple-500/10 text-purple-500",
  accommodation: "bg-green-500/10 text-green-500",
  shopping: "bg-pink-500/10 text-pink-500",
  adventure: "bg-red-500/10 text-red-500",
  activity: "bg-primary/10 text-primary",
};

const ItineraryBuilder = ({
  tripId,
  tripName,
  startDate,
  endDate,
  budget,
  description,
  tripDuration,
}: ItineraryBuilderProps) => {
  const {
    items,
    loading,
    generating,
    addItem,
    updateItem,
    deleteItem,
    generateAIItinerary,
    getItemsByDay,
  } = useItinerary(tripId);

  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({
    time_slot: "",
    title: "",
    description: "",
    location: "",
    estimated_cost: 0,
    duration_minutes: 60,
    category: "activity",
  });

  const itemsByDay = getItemsByDay();

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleGenerateAI = async () => {
    await generateAIItinerary({
      tripName,
      startDate,
      endDate,
      budget,
      description: description || undefined,
    });
    // Expand all days after generation
    const allDays = new Set(Array.from({ length: tripDuration }, (_, i) => i + 1));
    setExpandedDays(allDays);
  };

  const handleAddItem = async (dayNumber: number) => {
    if (!newItem.title.trim()) return;

    const { error } = await addItem({
      day_number: dayNumber,
      time_slot: newItem.time_slot || undefined,
      title: newItem.title,
      description: newItem.description || undefined,
      location: newItem.location || undefined,
      estimated_cost: newItem.estimated_cost,
      duration_minutes: newItem.duration_minutes,
      category: newItem.category,
    });

    if (!error) {
      setNewItem({
        time_slot: "",
        title: "",
        description: "",
        location: "",
        estimated_cost: 0,
        duration_minutes: 60,
        category: "activity",
      });
      setIsAddingItem(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
  };

  const getDayDate = (dayNumber: number) => {
    const date = addDays(parseISO(startDate), dayNumber - 1);
    return format(date, "EEE, MMM d");
  };

  const getTotalCostForDay = (dayItems: ItineraryItem[]) => {
    return dayItems.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);
  };

  const getTotalCost = () => {
    return items.reduce((sum, item) => sum + Number(item.estimated_cost || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with AI Generate Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Trip Itinerary
          </h2>
          <p className="text-muted-foreground text-sm">
            {items.length} activities planned • ₹{getTotalCost().toLocaleString('en-IN')} estimated
          </p>
        </div>
        <Button
          onClick={handleGenerateAI}
          disabled={generating}
          className="btn-gradient"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Itinerary
            </>
          )}
        </Button>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {Array.from({ length: tripDuration }, (_, i) => i + 1).map((dayNumber) => {
          const dayItems = itemsByDay[dayNumber] || [];
          const isExpanded = expandedDays.has(dayNumber);
          const dayTotalCost = getTotalCostForDay(dayItems);

          return (
            <motion.div
              key={dayNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayNumber * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayNumber)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary">
                      {dayNumber}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      Day {dayNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getDayDate(dayNumber)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {dayItems.length} activities
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      ₹{dayTotalCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Day Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">
                      {dayItems.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No activities planned for this day
                        </p>
                      ) : (
                        dayItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl group"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                categoryColors[item.category] || categoryColors.activity
                              }`}
                            >
                              {categoryIcons[item.category] || categoryIcons.activity}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                {item.time_slot && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.time_slot}
                                  </span>
                                )}
                                {item.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                  </span>
                                )}
                                {item.estimated_cost > 0 && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ₹{Number(item.estimated_cost).toLocaleString('en-IN')}
                                  </span>
                                )}
                                {item.duration_minutes && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.duration_minutes} min
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}

                      {/* Add Activity Form */}
                      {isAddingItem === dayNumber ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-secondary/50 rounded-xl space-y-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              placeholder="Activity title"
                              value={newItem.title}
                              onChange={(e) =>
                                setNewItem({ ...newItem, title: e.target.value })
                              }
                            />
                            <Input
                              placeholder="Time (e.g., 9:00 AM)"
                              value={newItem.time_slot}
                              onChange={(e) =>
                                setNewItem({ ...newItem, time_slot: e.target.value })
                              }
                            />
                          </div>
                          <Textarea
                            placeholder="Description (optional)"
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({ ...newItem, description: e.target.value })
                            }
                            rows={2}
                          />
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Input
                              placeholder="Location"
                              value={newItem.location}
                              onChange={(e) =>
                                setNewItem({ ...newItem, location: e.target.value })
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Cost (₹)"
                              value={newItem.estimated_cost || ""}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  estimated_cost: Number(e.target.value),
                                })
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Duration (min)"
                              value={newItem.duration_minutes || ""}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  duration_minutes: Number(e.target.value),
                                })
                              }
                            />
                            <Select
                              value={newItem.category}
                              onValueChange={(value) =>
                                setNewItem({ ...newItem, category: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sightseeing">Sightseeing</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="accommodation">Accommodation</SelectItem>
                                <SelectItem value="shopping">Shopping</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                                <SelectItem value="activity">Activity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsAddingItem(null)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddItem(dayNumber)}
                              disabled={!newItem.title.trim()}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Add Activity
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsAddingItem(dayNumber)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
