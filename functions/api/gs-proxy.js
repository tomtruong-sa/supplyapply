export async function onRequest({ request }) {
  const target =
    "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec";

  // ✅ Cho phép CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ✅ Trả về cho preflight request
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const query = url.search || "";

    const fetchOptions = {
      method: request.method,
      redirect: "follow",
      headers: {
        "User-Agent": "Cloudflare-Worker",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };

    if (request.method === "POST") {
      fetchOptions.body = await request.text();
    }

    // ✅ Gửi request đến Apps Script
    const response = await fetch(target + query, fetchOptions);

    // Nếu lỗi mạng (như 403, 404, 500)
    if (!response.ok) {
      throw new Error(`Google Script returned status ${response.status}`);
    }

    const text = await response.text();

    // ✅ Bảo vệ JSON parsing
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      jsonResponse = { status: "error", message: "Invalid JSON from Apps Script", raw: text };
    }

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}
