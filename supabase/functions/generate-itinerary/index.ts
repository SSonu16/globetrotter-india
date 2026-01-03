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
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating itinerary for:", { tripName, destination, startDate, endDate, budget });

    const systemPrompt = `You are an expert travel planner specializing in creating detailed, realistic travel itineraries. 
    Create day-by-day itineraries with specific timings, activities, locations, and estimated costs in Indian Rupees (₹).
    Focus on practical recommendations including local cuisine, cultural experiences, transportation tips, and must-see attractions.
    Always provide realistic time estimates and costs based on typical Indian travel expenses.`;

    const userPrompt = `Create a detailed day-by-day itinerary for a trip with these details:
    - Trip Name: ${tripName}
    - Destination/Description: ${destination || description || 'India'}
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
