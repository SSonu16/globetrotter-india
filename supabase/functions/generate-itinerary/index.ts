import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Generate itinerary function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tripName, destination, startDate, endDate, budget, description } = body;
    
    console.log("Request body:", JSON.stringify({ tripName, destination, startDate, endDate, budget, description }));
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "AI service not configured. Please contact support." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Comprehensive list of Indian destinations and states
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
      'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
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
    
    let inferredDestination = destination;
    if (!inferredDestination) {
      for (const dest of destinations) {
        if (combinedText.includes(dest)) {
          inferredDestination = dest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          break;
        }
      }
      
      // Fallback based on keywords
      if (!inferredDestination) {
        if (combinedText.includes('beach') || combinedText.includes('coastal')) {
          inferredDestination = 'Goa or Kerala beaches';
        } else if (combinedText.includes('mountain') || combinedText.includes('hill') || combinedText.includes('trek')) {
          inferredDestination = 'Shimla, Manali or Darjeeling';
        } else if (combinedText.includes('spiritual') || combinedText.includes('temple')) {
          inferredDestination = 'Varanasi or Rishikesh';
        } else if (combinedText.includes('wildlife') || combinedText.includes('safari')) {
          inferredDestination = 'Ranthambore or Jim Corbett';
        } else {
          inferredDestination = tripName || 'Popular Indian destinations';
        }
      }
    }

    const finalDestination = inferredDestination;
    const budgetStr = budget ? `₹${budget}` : 'budget-friendly';
    
    console.log("Generating itinerary for:", finalDestination, "Budget:", budgetStr);

    const systemPrompt = `You are an expert Indian travel planner. Create detailed, budget-conscious itineraries with:
- Multiple destinations to visit efficiently
- Cost-effective transport, food, and stay options  
- Optimal routes to minimize travel time
- Local experiences and hidden gems
- Specific timings and costs in Indian Rupees (₹)`;

    const userPrompt = `Create a day-by-day travel itinerary:

TRIP: ${tripName}
DESTINATION: ${finalDestination}  
DATES: ${startDate} to ${endDate}
BUDGET: ${budgetStr}
NOTES: ${description || 'Explore the best of the region'}

Requirements:
1. Pack MAXIMUM attractions in the time available
2. Use BUDGET options (local transport, street food, budget stays)
3. Optimize routes to MINIMIZE travel time
4. Include local food spots and markets
5. Add 4-6 activities per day with specific times

For each activity include: time, title, description, location, cost (₹), duration (minutes), category (sightseeing/food/transport/accommodation/shopping/adventure/cultural).

Return ONLY valid JSON array (no markdown):
[{"day":1,"activities":[{"time":"6:00 AM","title":"Activity","description":"Details","location":"Place","cost":100,"duration":60,"category":"sightseeing"}]}]`;

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
      
      return new Response(JSON.stringify({ error: `AI service error: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response received");
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("No content in AI response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("AI content preview:", content.substring(0, 300));

    // Parse JSON from response
    let itinerary;
    try {
      let jsonString = content;
      
      // Remove markdown code blocks
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      }
      
      // Find JSON array
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found");
      }
      
      console.log("Parsed itinerary:", itinerary.length, "days");
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
