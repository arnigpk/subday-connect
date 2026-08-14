import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // На самохостовом сервере ключи приходят заголовком x-worker-env — в Deno.env
  // их нет. Разбираем один раз в начале, дальше используем как запасной источник.
  let workerEnv: Record<string, string> = {};
  try { workerEnv = JSON.parse(req.headers.get("x-worker-env") || "{}"); } catch { /* ignore */ }
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, city, phone, venue, comment } = await req.json();

    if (!name || !phone || !venue) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input lengths
    if (name.length > 100 || phone.length > 20 || venue.length > 200) {
      return new Response(
        JSON.stringify({ error: "Field too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || workerEnv["SUPABASE_URL"]!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || workerEnv["SUPABASE_SERVICE_ROLE_KEY"]!,
      // Таблицы сайта живут в отдельной схеме: в общей public их имена
      // столкнулись бы с приложением.
      { db: { schema: "landing" } }
    );

    // Insert lead
    const { data: lead, error: insertError } = await supabase
      .from("partner_leads")
      .insert({
        name: name.trim(),
        city: (city || "").trim(),
        phone: phone.trim(),
        venue: venue.trim(),
        comment: (comment || "").trim(),
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    // Try sending Telegram notification
    try {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .single();

      if (
        settings?.telegram_enabled &&
        settings?.telegram_bot_token &&
        settings?.telegram_chat_id
      ) {
        const message = [
          "🆕 <b>Новая заявка от партнёра</b>",
          "",
          `👤 <b>Имя:</b> ${name}`,
          `🏙 <b>Город:</b> ${city}`,
          `📞 <b>Телефон:</b> ${phone}`,
          `🏪 <b>Заведение:</b> ${venue}`,
          comment ? `💬 <b>Комментарий:</b> ${comment}` : "",
          "",
          `📅 ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Oral" })}`,
        ]
          .filter(Boolean)
          .join("\n");

        await fetch(
          `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: settings.telegram_chat_id,
              text: message,
              parse_mode: "HTML",
            }),
          }
        );
      }
    } catch (telegramError) {
      // Don't fail the request if Telegram notification fails
      console.error("Telegram notification error:", telegramError);
    }

    return new Response(
      JSON.stringify({ success: true, id: lead.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
