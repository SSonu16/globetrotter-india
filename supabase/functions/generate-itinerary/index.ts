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
    
    console.log("Received request:", { tripName, destination, startDate, endDate, budget, description });
    
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
    const combinedText = `${tripName} ${description || ''}`.toLowerCase();
    
    // Comprehensive list of Indian destinations and states
    const destinations = [
      // Major cities
      'jaipur', 'delhi', 'mumbai', 'goa', 'kerala', 'varanasi', 'agra', 'udaipur',
      'manali', 'shimla', 'ladakh', 'darjeeling', 'ooty', 'mysore', 'hyderabad',
      'chennai', 'kolkata', 'bengaluru', 'bangalore', 'pune', 'rajasthan', 'kashmir',
      'rishikesh', 'haridwar', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar',
      'hampi', 'kodaikanal', 'munnar', 'alleppey', 'kovalam', 'kochi', 'cochin',
      // States
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
      'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
      'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
      'nagaland', 'odisha', 'punjab', 'sikkim', 'tamil nadu', 'telangana',
      'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
      // Additional places
      'gangtok', 'shillong', 'imphal', 'kohima', 'aizawl', 'agartala', 'itanagar',
      'leh', 'srinagar', 'gulmarg', 'pahalgam', 'nainital', 'mussoorie', 'dehradun',
      'lonavala', 'mahabaleshwar', 'coorg', 'wayanad', 'thekkady', 'pondicherry',
      'madurai', 'thanjavur', 'mahabalipuram', 'rameswaram', 'kanyakumari',
      'tirupati', 'visakhapatnam', 'vizag', 'konark', 'puri', 'bhubaneswar',
      'khajuraho', 'orchha', 'sanchi', 'ujjain', 'indore', 'bhopal',
      'mount abu', 'rann of kutch', 'kutch', 'dwarka', 'somnath', 'ahmedabad',
      'vadodara', 'surat', 'aurangabad', 'ajanta', 'ellora', 'nashik', 'shirdi'
    ];
    
    // Try to identify destination from trip name/description
    let inferredDestination = destination;
    if (!inferredDestination) {
      for (const dest of destinations) {
        if (combinedText.includes(dest)) {
          inferredDestination = dest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          break;
        }
      }
      
      // If still no destination, try to extract context from description
      if (!inferredDestination && description) {
        if (descriptionLower.includes('historical') || descriptionLower.includes('heritage') || descriptionLower.includes('monument')) {
          inferredDestination = 'Historical places in India (Delhi, Agra, Jaipur Golden Triangle)';
        } else if (descriptionLower.includes('beach') || descriptionLower.includes('coastal')) {
          inferredDestination = 'Beach destinations (Goa, Kerala, Andaman)';
        } else if (descriptionLower.includes('mountain') || descriptionLower.includes('hill') || descriptionLower.includes('trek')) {
          inferredDestination = 'Hill stations (Shimla, Manali, Darjeeling, Ooty)';
        } else if (descriptionLower.includes('spiritual') || descriptionLower.includes('temple') || descriptionLower.includes('religious')) {
          inferredDestination = 'Spiritual destinations (Varanasi, Rishikesh, Haridwar, Tirupati)';
        } else if (descriptionLower.includes('wildlife') || descriptionLower.includes('safari') || descriptionLower.includes('jungle')) {
          inferredDestination = 'Wildlife sanctuaries (Ranthambore, Jim Corbett, Kaziranga)';
        } else if (descriptionLower.includes('adventure') || descriptionLower.includes('thrill')) {
          inferredDestination = 'Adventure destinations (Rishikesh, Ladakh, Manali)';
        } else if (descriptionLower.includes('honeymoon') || descriptionLower.includes('romantic')) {
          inferredDestination = 'Romantic destinations (Udaipur, Kerala, Andaman)';
        } else {
          inferredDestination = tripName || 'Popular destinations in India';
        }
      }
    }

    const finalDestination = inferredDestination || tripName || 'Popular destinations in India';
    const budgetAmount = budget ? `₹${budget}` : 'budget-friendly (minimize costs)';
    
    console.log("Generating itinerary for:", { tripName, destination: finalDestination, startDate, endDate, budget: budgetAmount });

    const systemPrompt = `You are an expert Indian travel planner specializing in creating detailed, budget-conscious, and efficient travel itineraries.
    Your expertise includes:
    - Planning multi-destination trips that cover maximum attractions in minimum time
    - Suggesting the most cost-effective options for transport, food, and accommodation
    - Recommending hidden gems and local experiences alongside popular attractions
    - Optimizing routes to minimize travel time between destinations
    - Including specific timings, local food recommendations, and money-saving tips
    
    Always provide:
    - Realistic time estimates based on actual travel conditions in India
    - Costs in Indian Rupees (₹) that reflect current market rates
    - Practical tips for each location (best time to visit, what to carry, local customs)
    - Budget-friendly alternatives for expensive attractions
    - Suggestions for covering multiple nearby attractions efficiently`;

    const userPrompt = `Create a comprehensive day-by-day travel itinerary with these requirements:

TRIP DETAILS:
- Trip Name: ${tripName}
- Destination/Region: ${finalDestination}
- Description: ${description || 'Explore and experience the best of the region'}
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Budget: ${budgetAmount}

IMPORTANT REQUIREMENTS:
1. MAXIMIZE PLACES: Pack as many attractions and experiences as possible within the time frame
2. MINIMIZE BUDGET: Suggest the most cost-effective options (budget hotels, local transport, street food)
3. OPTIMIZE ROUTE: Plan the route to minimize travel time and backtracking
4. LOCAL EXPERIENCES: Include authentic local food spots, markets, and hidden gems
5. PRACTICAL TIPS: Add useful tips for each activity

For each day, provide 4-6 activities with:
- Specific time slots (e.g., "6:00 AM - 8:00 AM" for early starts to beat crowds)
- Activity title (be specific, e.g., "Sunrise at Taj Mahal" not just "Visit Taj Mahal")
- Brief description with tips and what to expect
- Exact location name
- Estimated cost in ₹ (including entry fees, transport, food)
- Duration in minutes
- Category: sightseeing, food, transport, accommodation, shopping, adventure, cultural

Include:
- Early morning activities to beat crowds and heat
- Budget meal recommendations (local dhabas, street food spots)
- Cheapest transport options (local buses, shared autos, metro)
- Free or low-cost attractions
- Evening activities and night markets

Return ONLY a valid JSON array in this exact format (no markdown, no explanation):
[
  {
    "day": 1,
    "activities": [
      {
        "time": "6:00 AM",
        "title": "Activity Title",
        "description": "Brief description with tips. Pro tip: arrive early to avoid crowds.",
        "location": "Specific Location Name",
        "cost": 100,
        "duration": 120,
        "category": "sightseeing"
      }
    ]
  }
]`;

    console.log("Calling Lovable AI gateway...");
    
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

    console.log("AI gateway response status:", response.status);

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
      
      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received, length:", content?.length);
    console.log("AI response preview:", content?.substring(0, 500));

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let itinerary;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonString = content;
      
      // Remove markdown code blocks if present
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }
      
      // Try to find JSON array
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON array found in response");
      }
      
      console.log("Parsed itinerary with", itinerary.length, "days");
    } catch (parseError) {
      console.error("Failed to parse itinerary:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse AI response. Please try again.");
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
