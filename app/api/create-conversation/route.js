export async function POST() {

  const res = await fetch(
    "https://tavusapi.com/v2/conversations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY
      },
      body: JSON.stringify({
        persona_id: process.env.PERSONA_ID,
        replica_id: process.env.REPLICA_ID,
        conversation_name: "Demo",
      })
    }
  );

  const text = await res.text();

  return new Response(text, {
    headers: { "Content-Type": "application/json" }
  });
}