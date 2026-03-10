"use client";

import { useEffect, useRef } from "react";

export default function Page({ params }) {

  const containerRef = useRef(null);

  useEffect(() => {

    async function start() {

      const DailyIframe = (await import("@daily-co/daily-js")).default;

      const res = await fetch("/api/get-conversation", {
        method: "POST",
        body: JSON.stringify({ id: params.id })
      });

      const data = await res.json();

      const frame = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "650px",
          border: "0"
        }
      });

      frame.join({
        url: data.url
      });

    }

    start();

  }, []);

  return (
    <div style={{padding:"30px"}}>
      <h2>Tavus Conversation</h2>
      <div ref={containerRef}></div>
    </div>
  );
}