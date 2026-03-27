// ===== QuantAQ API Proxy — Supabase Edge Function =====
// Simple proxy: forwards one QuantAQ API request at a time.
// The actual check logic runs in the browser (no timeout issues).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("QUANTAQ_API_KEY");
    if (!apiKey) throw new Error("Missing QUANTAQ_API_KEY");

    const { path } = await req.json();
    if (!path || typeof path !== "string") throw new Error("Missing 'path' in request body");

    // Only allow /devices/ and /data/ paths
    if (!path.startsWith("/devices/") && !path.startsWith("/data/")) {
      throw new Error("Invalid path");
    }

    const url = `https://api.quant-aq.com/v1${path}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(apiKey + ":")}`,
        Accept: "application/json",
      },
      redirect: "follow",
    });

    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
