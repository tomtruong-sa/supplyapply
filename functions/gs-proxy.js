export async function onRequest({ request }) {
  const target =
    "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec";

  // ✅ CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    // ✅ Chuẩn bị option
    let fetchOptions = {
      method: request.method,
      redirect: "follow", // 🟢 Thêm dòng này (bắt buộc)
    };

    if (request.method === "POST") {
      fetchOptions.body = await request.formData();
    }

    // ✅ Forward request đến Google Apps Script
    const url = new URL(request.url);
    const query = url.search ? url.search : "";
    const response = await fetch(target + query, fetchOptions);

    const text = await response.text();

    // ✅ Đảm bảo JSON hợp lệ
    let safeJson;
    try {
      safeJson = JSON.parse(text);
    } catch {
      safeJson = { status: "error", message: "Invalid JSON from Apps Script", raw: text };
    }

    return new Response(JSON.stringify(safeJson), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  }
}
