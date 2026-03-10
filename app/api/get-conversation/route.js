export async function POST(req) {

  const { id } = await req.json();

  const res = await fetch(
    `https://tavusapi.com/v2/conversations/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.TAVUS_API_KEY
      }
    }
  );

  const data = await res.json();

  return Response.json(data);
}