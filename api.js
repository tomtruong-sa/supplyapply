export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.formData();

    // URL Apps Script của bạn
    const targetUrl = "https://script.google.com/macros/s/AKfycbz9fcuw_DXVxWVOm00QvvIjJfrFZwb8tyARkK34Zn3zTvAwdYfixCWDaplJk8cj82Dy/exec";

    // Gửi POST đến Google Apps Script
    const response = await fetch(targetUrl, {
      method: "POST",
      body,
    });

    const text = await response.text();

    // Trả lại đúng JSON, kèm CORS header
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*", // hoặc "https://supplyapply.pages.dev"
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// ✅ Xử lý preflight OPTIONS cho trình duyệt
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
