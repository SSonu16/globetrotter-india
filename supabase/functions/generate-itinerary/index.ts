import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripName, destination, startDate, endDate, budget, description } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service not configured. Please contact support." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract destination hints from trip name and description
    const tripNameLower = (tripName || '').toLowerCase();
    const descriptionLower = (description || '').toLowerCase();
    const combinedText = `${tripName} ${description || ''}`;
    
    // Try to identify destination from trip name/description
    let inferredDestination = destination;
    if (!inferredDestination) {
      // Common Indian destinations to look for
      const destinations = [
        'jaipur', 'delhi', 'mumbai', 'goa', 'kerala', 'varanasi', 'agra', 'udaipur',
        'manali', 'shimla', 'ladakh', 'darjeeling', 'ooty', 'mysore', 'hyderabad',
        'chennai', 'kolkata', 'bengaluru', 'bangalore', 'pune', 'rajasthan', 'kashmir',
        'rishikesh', 'haridwar', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar',
        'hampi', 'kodaikanal', 'munnar', 'alleppey', 'kovalam', 'kochi', 'cochin'
      ];
      
      for (const dest of destinations) {
        if (tripNameLower.includes(dest) || descriptionLower.includes(dest)) {
          inferredDestination = dest.charAt(0).toUpperCase() + dest.slice(1);
          break;
        }
      }
      
      // If still no destination, try to extract context from description
      if (!inferredDestination && description) {
        // Look for keywords that suggest types of places
        if (descriptionLower.includes('historical') || descriptionLower.includes('heritage')) {
          inferredDestination = 'Historical places in India (Delhi, Agra, Jaipur)';
        } else if (descriptionLower.includes('beach')) {
          inferredDestination = 'Beach destinations in India (Goa, Kerala)';
        } else if (descriptionLower.includes('mountain') || descriptionLower.includes('hill')) {
          inferredDestination = 'Hill stations in India (Shimla, Manali, Ooty)';
        } else if (descriptionLower.includes('spiritual') || descriptionLower.includes('temple')) {
          inferredDestination = 'Spiritual destinations in India (Varanasi, Rishikesh)';
        } else {
          inferredDestination = description;
        }
      }
    }

    const finalDestination = inferredDestination || 'Popular destinations in India';
    
    console.log("Generating itinerary for:", { tripName, destination: finalDestination, startDate, endDate, budget });

    const systemPrompt = `You are an expert travel planner specializing in creating detailed, realistic travel itineraries for India.
    Create day-by-day itineraries with specific timings, activities, locations, and estimated costs in Indian Rupees (₹).
    Focus on practical recommendations including local cuisine, cultural experiences, transportation tips, and must-see attractions.
    Always provide realistic time estimates and costs based on typical Indian travel expenses.
    When given context like "historical places" or descriptions, suggest specific famous destinations that match.`;

    const userPrompt = `Create a detailed day-by-day itinerary for a trip with these details:
    - Trip Name: ${tripName}
    - Destination/Context: ${finalDestination}
    - Trip Description: ${description || 'General exploration'}
    - Start Date: ${startDate}
    - End Date: ${endDate}
    - Total Budget: ₹${budget || 'flexible'}

    For each day, provide 4-6 activities with:
    - Specific time slots (e.g., "9:00 AM - 11:00 AM")
    - Activity title
    - Brief description
    - Location name
    - Estimated cost in ₹
    - Duration in minutes
    - Category (sightseeing, food, transport, accommodation, shopping, adventure)

    Return ONLY a valid JSON array in this exact format:
    [
      {
        "day": 1,
        "activities": [
          {
            "time": "9:00 AM",
            "title": "Activity Title",
            "description": "Brief description",
            "location": "Location Name",
            "cost": 500,
            "duration": 120,
            "category": "sightseeing"
          }
        ]
      }
    ]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 200));

    // Parse the JSON from the response
    let itinerary;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse itinerary:", parseError);
      throw new Error("Failed to parse AI response");
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error generating itinerary:", error);
    const message = error instanceof Error ? error.message : "Failed to generate itinerary";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
