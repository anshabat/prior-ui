import { api } from "@workspace/chat-api/convex/_generated/api.js";
import { Id } from "@workspace/chat-api/convex/_generated/dataModel.js";
import { useAction, useQuery } from "convex/react";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";

interface ConversationScreenProps {
  sessionId: Id<"contactSessions">;
  conversationId: Id<"conversations">;
  onBack: () => void;
}

const MESSAGES_LIMIT = 10;

export function ConversationScreen({
  sessionId,
  conversationId,
  onBack,
}: ConversationScreenProps) {
  const conversation = useQuery(api.public.conversations.getOne, {
    contactSessionId: sessionId,
    conversationId,
  });

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && sessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId: sessionId,
        }
      : "skip",
    { initialNumItems: MESSAGES_LIMIT },
  );

  const handleLoadMore = () => {
    messages.loadMore(MESSAGES_LIMIT);
  };

  const uiMessages = toUIMessages(messages.results ?? []);

  const createMessage = useAction(api.public.messages.create);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const message = formData.get("message") as string;

    if (!message.trim() || !conversation?.threadId) return;

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: message,
      contactSessionId: sessionId,
    });
  };

  return (
    <div className="max-w-md">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
      >
        ← Back
      </button>
      <div className="flex flex-col h-[600px] border border-gray-200 rounded">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <InfiniteScrollTrigger
            canLoadMore={messages.status === "CanLoadMore"}
            isLoadingMore={messages.status === "LoadingMore"}
            onLoadMore={handleLoadMore}
          />
          {uiMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              name="message"
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
