"use client";

import { LoginScreen } from "./components/login-screen";
import { Spinner } from "./components/spinner";
import { ConversationScreen } from "./components/conversation-screen";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/chat-api/convex/_generated/api.js";
import { Id } from "@workspace/chat-api/convex/_generated/dataModel.js";
import { SelectionScreen } from "./components/selection-screen";

export type Screen = "loading" | "login" | "conversation" | "selection";

export default function ChatPage() {
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [sessionId, setSessionId] = useState<Id<"contactSessions"> | null>(
    null,
  );
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>();

  const validateSession = useMutation(api.public.contactSessions.validate);

  useEffect(() => {
    const checkSession = async () => {
      const storedSessionId = localStorage.getItem(
        "contactSessionId",
      ) as Id<"contactSessions">;

      if (!storedSessionId) {
        setScreen("login");
        return;
      }

      try {
        const result = await validateSession({
          contactSessionId: storedSessionId,
        });

        if (result.valid) {
          setSessionId(storedSessionId);
          setScreen("selection");
        } else {
          localStorage.removeItem("contactSessionId");
          setScreen("login");
        }
      } catch (err) {
        //console.error("Session validation error:", err);
        localStorage.removeItem("contactSessionId");
        setScreen("login");
      }
    };

    checkSession();
  }, [validateSession]);

  const handleLoginSuccess = (contactSessionId: Id<"contactSessions">) => {
    localStorage.setItem("contactSessionId", contactSessionId);
    setSessionId(contactSessionId);
    setScreen("selection");
  };

  const handleLogout = () => {
    localStorage.removeItem("contactSessionId");
    setSessionId(null);
    setScreen("login");
  };

  const handleChatSelect = (conversationId: Id<"conversations">) => {
    setConversationId(conversationId);
    setScreen("conversation");
  };

  const closeConversation = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const screens: Record<Screen, JSX.Element> = {
    loading: <Spinner />,
    login: <LoginScreen onError={setError} onSuccess={handleLoginSuccess} />,
    conversation:
      sessionId && conversationId ? (
        <ConversationScreen
          sessionId={sessionId}
          conversationId={conversationId}
          onBack={closeConversation}
        />
      ) : (
        <Spinner />
      ),
    selection: sessionId ? (
      <SelectionScreen
        sessionId={sessionId}
        onLogout={handleLogout}
        onSelectChat={handleChatSelect}
      />
    ) : (
      <Spinner />
    ),
  };

  return (
    <div className="w-[600px] border border-gray-200 rounded p-8 mx-auto my-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Chat</h1>
        {screen !== "login" && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Logout
          </button>
        )}
      </div>
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm max-w-md mb-4">
          {error}
        </div>
      )}
      {screens[screen]}
    </div>
  );
}
