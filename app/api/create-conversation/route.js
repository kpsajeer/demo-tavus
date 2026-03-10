export async function POST(req) {

  const { persona } = await req.json();

  const res = await fetch(
    "https://tavusapi.com/v2/conversations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY
      },
      body: JSON.stringify({
        persona_id: persona
      })
    }
  );

  const data = await res.json();

  return Response.json({
    conversation_id: data.conversation_id,
    conversation_url: data.conversation_url
  });

}