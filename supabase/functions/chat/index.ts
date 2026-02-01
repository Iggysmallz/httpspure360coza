import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pure360's friendly AI assistant. Pure360 offers professional home and care services in Cape Town, South Africa.

SERVICES OFFERED:

## CLEANING SERVICES (Instant Booking)
All prices are R15 cheaper than competitors!

1. **Indoor Cleaning** - Comprehensive home cleaning (3.5-10 hours)
   - Base: R285 for 3 hours + R65/additional hour

2. **Deep Cleaning** - Intensive top-to-bottom cleaning
   - Base: R285 for 3 hours + R65/additional hour

3. **AirBnB Turnover** - Quick turnaround for short-term rentals
   - Base: R285 for 3 hours + R65/additional hour

4. **Express Cleaning** - 1-3 hour quick tasks
   - Base: R285 for 3 hours + R65/additional hour

5. **Moving Cleaning** - Move-in/move-out deep cleaning
   - From R235 (3 hours) + R65/additional hour

6. **One-Time Cleaning** - Single, flexible booking
   - From R235 (3 hours) + R65/additional hour

7. **Window Cleaning** - Professional window cleaning
   - R50/hour (R15 cheaper than R65)

## CLEANING SERVICES (Quote Request)
8. **Office Cleaning** - Half-day or full-day office cleaning
9. **Commercial Cleaning** - Office and industrial spaces (R5.10/sqm)
10. **Small Business Cleaning** - Retail and small facility cleaning
11. **Outdoor Services** - Garden maintenance and dog walking
12. **Gardening Services** - Landscaping and irrigation
13. **Laundry & Ironing** - Professional laundry services

## OTHER SERVICES
- **Removals** - Furniture moving and rubble removal (quote-based)
- **Care Services** - Elderly companion care and nursing services (quote-based)

CONTACT INFORMATION:
- Phone: 076 400 2332
- WhatsApp: 076 400 2332
- Email: pure360s@gmail.com

BOOKING PROCESS:
1. Instant booking services: Select service → Choose rooms → Pick date/time → Book
2. Quote-based services: Select service → Submit requirements → We respond within 2 hours
3. For removals and care services, users submit a quote request

IMPORTANT GUIDELINES:
- Be helpful, friendly, and professional
- Emphasize that Pure360's prices are R15 cheaper than competitors
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
    // Authentication check - require valid user session
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate JWT - MUST pass token explicitly for Lovable Cloud
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
