"use client";

import { useRef, useState } from "react";

export default function Home() {

  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);

  async function startConversation() {

    const DailyIframe = (await import("@daily-co/daily-js")).default;

    const res = await fetch("/api/conversation", {
      method: "POST"
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

    setStarted(true);
  }

  return (
    <div style={{padding:"40px", textAlign:"center"}}>

      <h2>GoFoton AI</h2>

      {!started && (
        <button onClick={startConversation}>
          Start Conversation
        </button>
      )}

      <div ref={containerRef}></div>

    </div>
  );
}