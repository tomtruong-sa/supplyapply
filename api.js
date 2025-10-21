export async function onRequestPost(context) {
  const { request } = context;
  const body = await request.formData();

  const response = await fetch("https://script.google.com/macros/s/AKfycbz9fcuw_DXVxWVOm00QvvIjJfrFZwb8tyARkK34Zn3zTvAwdYfixCWDaplJk8cj82Dy/exec", {
    method: "POST",
    body
  });

  const text = await response.text();
  return new Response(text, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
}
