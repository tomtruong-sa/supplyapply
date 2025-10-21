export async function onRequest({ request }) {
  const target =
    "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec";

  // ✅ 1. Xử lý CORS preflight
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
    // ✅ 2. Xử lý GET và POST an toàn
    let fetchOptions = { method: request.method };
    if (request.method === "POST") {
      fetchOptions.body = await request.formData();
    }

    // ✅ 3. Forward request đến Apps Script
    const response = await fetch(target + (request.url.includes("?") ? request.url.split("?")[1] ? "?" + request.url.split("?")[1] : "" : ""), fetchOptions);

    // ✅ 4. Đảm bảo luôn trả về JSON hợp lệ
    const text = await response.text();

    // Nếu Apps Script không trả về JSON chuẩn, bọc nó lại
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
    // ✅ 5. Trả lỗi JSON chuẩn khi proxy fail
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
