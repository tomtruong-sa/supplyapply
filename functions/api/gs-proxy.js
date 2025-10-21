export async function onRequest({ request }) {
  const target =
    "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // ✅ 1️⃣ Cho phép preflight request (CORS)
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const query = url.search || "";

    // ✅ 2️⃣ Cấu hình request gửi tới Google Apps Script
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

    // ✅ 3️⃣ Gửi request tới Apps Script
    const response = await fetch(target + query, fetchOptions);

    if (!response.ok) {
      throw new Error(`Google Script returned status ${response.status}`);
    }

    const text = await response.text();

    // ✅ 4️⃣ Đảm bảo phản hồi JSON hợp lệ
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      jsonResponse = {
        status: "error",
        message: "Invalid JSON from Apps Script",
        raw: text,
      };
    }

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    // ✅ 5️⃣ Trả lỗi chuẩn JSON khi proxy bị lỗi
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
