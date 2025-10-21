export async function onRequestPost({ request }) {
  try {
    const body = await request.formData();

    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbyqQ8Dvb6M9FaULKa2_UGNaA-UTIRC2fhAteF4I5CYGAOIdRnhMkH54S39bbVj1quEz/exec",
      {
        method: "POST",
        body,
      }
    );

    const text = await res.text();
    return new Response(text, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ status: "ok", message: "GET allowed" }), {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
