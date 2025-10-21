export async function onRequest({ request }) {
  const target = "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec";

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
    const body = request.method === "POST" ? await request.formData() : undefined;
    const response = await fetch(target, { method: request.method, body });
    const text = await response.text();

    return new Response(text, {
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
