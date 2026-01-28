import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pure360's friendly AI assistant. Pure360 offers professional home and care services in Cape Town, South Africa.

SERVICES OFFERED:
1. **Cleaning Services** - Professional home cleaning with flexible packages:
   - Regular cleaning (weekly/bi-weekly)
   - Deep cleaning (spring cleaning, move-in/out)
   - AirBnB turnover cleaning
   - Pricing based on bedrooms (R350 base) and bathrooms (R150 each)

2. **Removals** - Reliable moving services:
   - Furniture moving
   - Rubble removal
   - Custom quotes based on pickup/dropoff locations

3. **Care Services** - Compassionate care for loved ones:
   - Elderly companion care
   - Professional nursing services
   - Flexible scheduling options

CONTACT INFORMATION:
- Phone: 076 400 2332
- WhatsApp: 076 400 2332
- Email: pure360s@gmail.com

BOOKING PROCESS:
1. Users can book cleaning directly on the website
2. For removals and care services, users submit a quote request
3. The team responds within 24 hours

IMPORTANT GUIDELINES:
- Be helpful, friendly, and professional
- If you can't answer a question, suggest contacting via WhatsApp or phone
- For complex inquiries, offer to connect them with a human via WhatsApp
- Keep responses concise and helpful
- If someone needs urgent help, always recommend calling or WhatsApp

ESCALATION RESPONSES:
When someone needs more help or has complex questions, say something like:
"I'd be happy to connect you with our team for more personalized assistance! You can reach us directly on WhatsApp at 076 400 2332 or call us. Would you like me to help you with anything else in the meantime?"`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: Message[] };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact us via WhatsApp at 076 400 2332." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again or contact us via WhatsApp." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
