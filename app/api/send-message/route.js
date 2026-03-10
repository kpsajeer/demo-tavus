export async function POST(req) {

  const { conversation_id, message } = await req.json();

  const res = await fetch(
    `https://tavusapi.com/v2/conversations/${conversation_id}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY
      },
      body: JSON.stringify({
        message: message
      })
    }
  );

  const data = await res.json();

  return Response.json(data);

}