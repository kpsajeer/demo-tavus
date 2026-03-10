"use client";
import { useRef, useState, use, useEffect } from "react";

export default function Page({ params }) {

    const { id } = use(params);

    const videoContainerRef = useRef(null);
    const callObjectRef = useRef(null);

    const [connecting, setConnecting] = useState(false);
    const [started, setStarted] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);

    const [sending, setSending] = useState(false);

    useEffect(() => {
        return () => {
            if (callObjectRef.current) {
                callObjectRef.current.leave();
                callObjectRef.current.destroy();
            }
        };
    }, []);

    async function startConversation() {

        setConnecting(true);
        setMessages([]);
        const Daily = (await import("@daily-co/daily-js")).default;

        const res = await fetch("/api/get-conversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        setConversationId(data.conversation_id);

        const callObject = Daily.createCallObject();
        callObjectRef.current = callObject;

        // Render video tracks
        callObject.on("track-started", (event) => {

            if (event.track.kind !== "video") return;
            if (!videoContainerRef.current) return;

            const video = document.createElement("video");

            video.srcObject = new MediaStream([event.track]);
            video.autoplay = true;
            video.playsInline = true;

            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "cover";
            video.style.borderRadius = "10px";

            videoContainerRef.current.innerHTML = "";
            videoContainerRef.current.appendChild(video);

            setConnecting(false);
            setStarted(true);
        });

        await callObject.join({
            url: data.conversation_url
        });

        callObject.on("left-meeting", () => {
            setStarted(false);
            setConnecting(false);
        });

    }

    async function sendQuestion() {

        if (!question.trim() || sending) return;
        setSending(true);

        const newMessages = [
            ...messages,
            { role: "user", text: question }
        ];

        setMessages(newMessages);

        const res = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                message: question
            })
        });

        const data = await res.json();

        if (data.response) {

            setMessages([
                ...newMessages,
                {
                    role: "avatar",
                    text: data.response
                }
            ]);

        }
        setSending(false);
        setQuestion("");

    }

    if (!started && !connecting) {
        return (
            <div style={{
                height: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    background: "#fff",
                    padding: "40px",
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    color: "#333"
                }}>

                    <h2>Start Your Conversation</h2>
                    <p>Click below to begin your AI avatar session</p>

                    <button
                        disabled={connecting}
                        onClick={startConversation}
                        style={{
                            marginTop: "20px",
                            padding: "12px 24px",
                            background: "#7bb661",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        Start Session
                    </button>

                </div>
            </div>
        );
    }
    if (connecting) {
        return (
            <div style={{
                height: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
            }}>
                Connecting to avatar...
            </div>
        );
    }

    return (
        <div style={{ padding: "30px", maxWidth: "850px", margin: "auto" }}>

            <h2 style={{ textAlign: "center" }}>
                Conversation Studio
            </h2>

            <div
                ref={videoContainerRef}
                style={{
                    marginBottom: "15px",
                    height: "420px",
                    background: "#000",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            />

            <div style={{
                display: "flex",
                gap: "10px"
            }}>

                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendQuestion();
                    }}
                    placeholder="Type your question here..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                />

                <button
                    disabled={sending}
                    onClick={sendQuestion}
                    style={{
                        background: "#7bb661",
                        color: "#fff",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "6px"
                    }}
                >
                    Send Question
                </button>

            </div>

            <div style={{
                marginTop: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "150px"
            }}>

                <strong>CHAT TRANSCRIPT</strong>

                {messages.length === 0 && (
                    <p style={{ color: "#777" }}>
                        Live transcript will appear here.
                    </p>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{ marginTop: "8px" }}>
                        <b>{msg.role === "user" ? "You" : "Avatar"}:</b> {msg.text}
                    </div>
                ))}

            </div>

        </div>
    );
}