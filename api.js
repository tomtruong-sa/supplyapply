export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.formData();

    const target = "https://script.google.com/macros/s/AKfycbz9fcuw_DXVxWVOm00QvvIjJfrFZwb8tyARkK34Zn3zTvAwdYfixCWDaplJk8cj82Dy/exec";

    const res = await fetch(target, {
      method: "POST",
      body,
    });

    const text = await res.text();

    return new Response(text, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

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
