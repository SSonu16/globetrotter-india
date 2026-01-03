import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ItineraryItem {
  id: string;
  trip_id: string;
  user_id: string;
  day_number: number;
  time_slot: string | null;
  title: string;
  description: string | null;
  location: string | null;
  estimated_cost: number;
  duration_minutes: number | null;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useItinerary(tripId: string) {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!user || !tripId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', user.id)
        .order('day_number', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch itinerary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user, tripId]);

  const addItem = async (item: {
    day_number: number;
    time_slot?: string;
    title: string;
    description?: string;
    location?: string;
    estimated_cost?: number;
    duration_minutes?: number;
    category?: string;
    sort_order?: number;
  }) => {
    if (!user) return { error: new Error('No user logged in'), data: null };

    try {
      const maxSortOrder = items
        .filter(i => i.day_number === item.day_number)
        .reduce((max, i) => Math.max(max, i.sort_order), -1);

      const { data, error } = await supabase
        .from('itinerary_items')
        .insert({
          ...item,
          trip_id: tripId,
          user_id: user.id,
          sort_order: item.sort_order ?? maxSortOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [...prev, data]);
      return { error: null, data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const updateItem = async (itemId: string, updates: Partial<ItineraryItem>) => {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(i => i.id === itemId ? data : i));
      return { error: null, data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(i => i.id !== itemId));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const generateAIItinerary = async (tripDetails: {
    tripName: string;
    destination?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    description?: string;
  }) => {
    if (!user) return { error: new Error('No user logged in'), data: null };

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-itinerary', {
        body: tripDetails,
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Edge Function returned a non-2xx status code');
      }
      
      const data = response.data;
      if (!data) throw new Error('No data received from AI');
      if (data.error) throw new Error(data.error);

      const itinerary = data.itinerary;
      
      // Clear existing items for this trip
      await supabase
        .from('itinerary_items')
        .delete()
        .eq('trip_id', tripId)
        .eq('user_id', user.id);

      // Insert new items
      const newItems: any[] = [];
      for (const day of itinerary) {
        for (let i = 0; i < day.activities.length; i++) {
          const activity = day.activities[i];
          newItems.push({
            trip_id: tripId,
            user_id: user.id,
            day_number: day.day,
            time_slot: activity.time,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            estimated_cost: activity.cost || 0,
            duration_minutes: activity.duration,
            category: activity.category || 'activity',
            sort_order: i,
          });
        }
      }

      if (newItems.length > 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('itinerary_items')
          .insert(newItems)
          .select();

        if (insertError) throw insertError;
        setItems(insertedData || []);
      }

      toast({
        title: 'Itinerary Generated!',
        description: `Created ${newItems.length} activities for your trip.`,
      });

      return { error: null, data: itinerary };
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate itinerary.',
        variant: 'destructive',
      });
      return { error, data: null };
    } finally {
      setGenerating(false);
    }
  };

  const getItemsByDay = () => {
    const grouped: Record<number, ItineraryItem[]> = {};
    items.forEach(item => {
      if (!grouped[item.day_number]) {
        grouped[item.day_number] = [];
      }
      grouped[item.day_number].push(item);
    });
    return grouped;
  };

  return {
    items,
    loading,
    generating,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    generateAIItinerary,
    getItemsByDay,
  };
}
