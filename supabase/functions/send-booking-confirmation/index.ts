import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingConfirmationRequest {
  email: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { 
      email, 
      customerName, 
      serviceName, 
      date, 
      time, 
      address, 
      totalPrice 
    }: BookingConfirmationRequest = await req.json();

    if (!email || !customerName || !serviceName || !date || !time) {
      throw new Error("Missing required fields");
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 64px; height: 64px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px;">✓</span>
              </div>
              <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 8px;">Booking Confirmed!</h1>
              <p style="color: #666; font-size: 14px; margin: 0;">Hi ${customerName}, your cleaning service has been scheduled.</p>
            </div>

            <!-- Booking Details -->
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #1a1a1a; font-size: 16px; margin: 0 0 16px; font-weight: 600;">Booking Details</h2>
              
              <div style="margin-bottom: 12px;">
                <p style="color: #666; font-size: 12px; margin: 0 0 4px; text-transform: uppercase;">Service</p>
                <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 500;">${serviceName}</p>
              </div>
              
              <div style="margin-bottom: 12px;">
                <p style="color: #666; font-size: 12px; margin: 0 0 4px; text-transform: uppercase;">Date & Time</p>
                <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 500;">${date} at ${time}</p>
              </div>
              
              ${address ? `
              <div style="margin-bottom: 12px;">
                <p style="color: #666; font-size: 12px; margin: 0 0 4px; text-transform: uppercase;">Address</p>
                <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 500;">${address}</p>
              </div>
              ` : ''}
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <p style="color: #1a1a1a; font-size: 14px; margin: 0; font-weight: 600;">Total Paid</p>
                  <p style="color: #22c55e; font-size: 18px; margin: 0; font-weight: 700;">R${totalPrice}</p>
                </div>
              </div>
            </div>

            <!-- What's Next -->
            <div style="margin-bottom: 24px;">
              <h2 style="color: #1a1a1a; font-size: 16px; margin: 0 0 16px; font-weight: 600;">What happens next?</h2>
              <ol style="color: #666; font-size: 14px; line-height: 1.6; padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 8px;">Our vetted cleaner will arrive at your address on the scheduled date.</li>
                <li style="margin-bottom: 8px;">Please ensure someone is available to provide access.</li>
                <li>After the service, you can rate your experience in the app.</li>
              </ol>
            </div>

            <!-- Support -->
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                Need help? Contact us via WhatsApp or email at <a href="mailto:support@pure360.co.za" style="color: #92400e;">support@pure360.co.za</a>
              </p>
            </div>

          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Pure360. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pure360 <noreply@pure360.co.za>",
        to: [email],
        subject: "Booking Confirmed - Pure360",
        html: emailHtml,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Booking confirmation email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-booking-confirmation function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
