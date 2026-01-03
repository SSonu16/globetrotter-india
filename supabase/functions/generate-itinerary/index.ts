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
    const { tripName, destination, startDate, endDate, budget, description } = body;
    
    console.log("Processing request:", { tripName, destination, startDate, endDate, budget });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is missing");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // List of Indian destinations
    const destinations = [
      'jaipur', 'delhi', 'mumbai', 'goa', 'kerala', 'varanasi', 'agra', 'udaipur',
      'manali', 'shimla', 'ladakh', 'darjeeling', 'ooty', 'mysore', 'hyderabad',
      'chennai', 'kolkata', 'bengaluru', 'bangalore', 'pune', 'rajasthan', 'kashmir',
      'rishikesh', 'haridwar', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar',
      'hampi', 'kodaikanal', 'munnar', 'alleppey', 'kovalam', 'kochi',
      'andhra', 'arunachal', 'assam', 'bihar', 'chhattisgarh', 'gujarat', 'haryana',
      'himachal', 'jharkhand', 'karnataka', 'madhya pradesh', 'maharashtra',
      'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'sikkim',
      'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
      'gangtok', 'shillong', 'imphal', 'kohima', 'aizawl', 'agartala',
      'leh', 'srinagar', 'gulmarg', 'pahalgam', 'nainital', 'mussoorie',
      'lonavala', 'mahabaleshwar', 'coorg', 'wayanad', 'thekkady', 'pondicherry',
      'madurai', 'thanjavur', 'rameswaram', 'kanyakumari', 'tirupati', 'vizag',
      'konark', 'puri', 'bhubaneswar', 'khajuraho', 'orchha', 'ujjain', 'bhopal',
      'mount abu', 'kutch', 'dwarka', 'somnath', 'ahmedabad', 'nashik', 'shirdi', 'andaman'
    ];
    
    // Find destination
    const combinedText = `${tripName || ''} ${description || ''}`.toLowerCase();
    let inferredDestination = destination;
    
    if (!inferredDestination) {
      for (const dest of destinations) {
        if (combinedText.includes(dest)) {
          inferredDestination = dest.charAt(0).toUpperCase() + dest.slice(1);
          break;
        }
      }
      if (!inferredDestination) {
        inferredDestination = tripName || 'Delhi';
      }
    }
    
    console.log("Destination identified:", inferredDestination);

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const budgetPerDay = budget ? Math.floor(budget / days) : 3000;
    
    console.log("Trip days:", days, "Budget per day:", budgetPerDay);

    const prompt = `Create a ${days}-day travel itinerary for ${inferredDestination}, India with budget ₹${budgetPerDay}/day.

Return ONLY a JSON array in this exact format (no other text):
[{"day":1,"activities":[{"time":"6:00 AM","title":"Morning Temple Visit","description":"Visit the famous temple","location":"Temple Name","cost":50,"duration":90,"category":"sightseeing"}]}]

Requirements:
- Exactly ${days} days
- 5-6 activities per day from 6 AM to 10 PM
- Include local food, famous spots, markets
- Categories: sightseeing, food, transport, accommodation, shopping, adventure, cultural
- Budget-friendly options
- Costs in Indian Rupees`;

    console.log("Calling AI API...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);
    
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log("AI response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        throw new Error(`AI service error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        console.error("Empty AI response");
        throw new Error("Empty response from AI");
      }

      console.log("Parsing AI response, length:", content.length);

      // Parse JSON
      let itinerary;
      let jsonString = content.trim();
      
      // Remove markdown
      if (jsonString.includes('```')) {
        const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) jsonString = match[1].trim();
      }
      
      // Find array
      const startIdx = jsonString.indexOf('[');
      const endIdx = jsonString.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx > startIdx) {
        jsonString = jsonString.substring(startIdx, endIdx + 1);
      }
      
      try {
        itinerary = JSON.parse(jsonString);
        console.log("Parsed", itinerary.length, "days");
      } catch (e) {
        console.error("Parse failed:", e);
        throw new Error("Failed to parse AI response");
      }

      return new Response(JSON.stringify({ itinerary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("Request timed out");
        return new Response(JSON.stringify({ error: "Request timed out. Please try again." }), {
          status: 504,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw fetchError;
    }

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
