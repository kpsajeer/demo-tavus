export async function POST() {

  const res = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.TAVUS_API_KEY
    },
    body: JSON.stringify({
      replica_id: process.env.REPLICA_ID,
      persona_id: process.env.PERSONA_ID
    })
  });

  const data = await res.json();

  return Response.json(data);
}