export async function POST(req) {

  const { id } = await req.json();

  const res = await fetch(
    `https://tavusapi.com/v2/conversations/${id}`,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.TAVUS_API_KEY
      }
    }
  );

  const data = await res.json();

  return Response.json({
    conversation_id: data.conversation_id,
    conversation_url: data.conversation_url
  });

}