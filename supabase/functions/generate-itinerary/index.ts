import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Generate itinerary function started");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", JSON.stringify(body));
    
    const { tripName, destination, startDate, endDate, budget, description } = body;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is missing");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("API key found, length:", LOVABLE_API_KEY.length);

    // List of Indian destinations and states for matching
    const destinations = [
      'jaipur', 'delhi', 'mumbai', 'goa', 'kerala', 'varanasi', 'agra', 'udaipur',
      'manali', 'shimla', 'ladakh', 'darjeeling', 'ooty', 'mysore', 'hyderabad',
      'chennai', 'kolkata', 'bengaluru', 'bangalore', 'pune', 'rajasthan', 'kashmir',
      'rishikesh', 'haridwar', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar',
      'hampi', 'kodaikanal', 'munnar', 'alleppey', 'kovalam', 'kochi', 'cochin',
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
      'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
      'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
      'nagaland', 'odisha', 'punjab', 'sikkim', 'tamil nadu', 'telangana',
      'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal', 'andaman',
      'gangtok', 'shillong', 'imphal', 'kohima', 'aizawl', 'agartala', 'itanagar',
      'leh', 'srinagar', 'gulmarg', 'pahalgam', 'nainital', 'mussoorie', 'dehradun',
      'lonavala', 'mahabaleshwar', 'coorg', 'wayanad', 'thekkady', 'pondicherry',
      'madurai', 'thanjavur', 'mahabalipuram', 'rameswaram', 'kanyakumari',
      'tirupati', 'visakhapatnam', 'vizag', 'konark', 'puri', 'bhubaneswar',
      'khajuraho', 'orchha', 'sanchi', 'ujjain', 'indore', 'bhopal',
      'mount abu', 'rann of kutch', 'kutch', 'dwarka', 'somnath', 'ahmedabad',
      'vadodara', 'surat', 'aurangabad', 'ajanta', 'ellora', 'nashik', 'shirdi'
    ];
    
    // Extract destination from trip name and description
    const combinedText = `${tripName || ''} ${description || ''}`.toLowerCase();
    console.log("Searching for destination in:", combinedText);
    
    let inferredDestination = destination;
    if (!inferredDestination) {
      for (const dest of destinations) {
        if (combinedText.includes(dest)) {
          inferredDestination = dest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          console.log("Found destination:", inferredDestination);
          break;
        }
      }
      
      // Fallback based on keywords
      if (!inferredDestination) {
        if (combinedText.includes('beach') || combinedText.includes('coastal')) {
          inferredDestination = 'Goa';
        } else if (combinedText.includes('mountain') || combinedText.includes('hill') || combinedText.includes('trek')) {
          inferredDestination = 'Manali';
        } else if (combinedText.includes('spiritual') || combinedText.includes('temple')) {
          inferredDestination = 'Varanasi';
        } else if (combinedText.includes('wildlife') || combinedText.includes('safari')) {
          inferredDestination = 'Ranthambore';
        } else {
          inferredDestination = tripName || 'Delhi';
        }
        console.log("Using fallback destination:", inferredDestination);
      }
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    console.log("Trip duration:", days, "days");

    const budgetStr = budget ? `₹${budget} total` : 'budget-friendly';
    
    const systemPrompt = `You are an expert Indian travel planner. Create practical, budget-conscious day-by-day itineraries. Always respond with ONLY a valid JSON array, no markdown or extra text.`;

    const userPrompt = `Create a ${days}-day travel itinerary for ${inferredDestination}, India.

Trip: ${tripName}
Budget: ${budgetStr}
Notes: ${description || 'Explore the best attractions'}

Requirements:
- Create exactly ${days} days of activities
- Include 4-6 activities per day with realistic timings
- Focus on famous attractions, local food, markets
- Use budget transport and dining options
- Include costs in Indian Rupees

Return ONLY this JSON format (no markdown, no explanation):
[
  {
    "day": 1,
    "activities": [
      {
        "time": "6:00 AM",
        "title": "Activity name",
        "description": "Brief description",
        "location": "Specific place",
        "cost": 100,
        "duration": 60,
        "category": "sightseeing"
      }
    ]
  }
]

Categories: sightseeing, food, transport, accommodation, shopping, adventure, cultural`;

    console.log("Calling AI gateway for destination:", inferredDestination);
    
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

    console.log("AI response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error response:", errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: `AI service error (${response.status})` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response received, processing...");
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Empty AI response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Empty response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Raw content length:", content.length);
    console.log("Content preview:", content.substring(0, 200));

    // Parse JSON from response
    let itinerary;
    try {
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```')) {
        const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
          jsonString = match[1].trim();
        }
      }
      
      // Find JSON array
      const startIdx = jsonString.indexOf('[');
      const endIdx = jsonString.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        jsonString = jsonString.substring(startIdx, endIdx + 1);
      }
      
      itinerary = JSON.parse(jsonString);
      console.log("Successfully parsed itinerary with", itinerary.length, "days");
      
      // Validate structure
      if (!Array.isArray(itinerary) || itinerary.length === 0) {
        throw new Error("Invalid itinerary structure");
      }
      
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Failed content:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Returning successful response");
    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
