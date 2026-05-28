import { useState } from "react";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@workspace/chat-api/convex/_generated/api.js";
import { Id } from "@workspace/chat-api/convex/_generated/dataModel.js";
import { Button } from "@workspace/ui";
import { Spinner } from "./spinner";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";

interface SelectionScreenProps {
  sessionId: Id<"contactSessions">;
  onSelectChat: (conversationId: string) => void;
  onLogout: () => void;
}

export function SelectionScreen({
  sessionId,
  onLogout,
  onSelectChat,
}: SelectionScreenProps) {
  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!sessionId) {
      onLogout();
      return;
    }

    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId: sessionId,
      });

      onSelectChat(conversationId);
    } catch {
      onLogout();
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenConversation = (conversationId: Id<"conversations">) => {
    onSelectChat(conversationId);
  };

  return (
    <div className="max-w-md">
      <div className="p-8">
        <p className="text-gray-600 pb-2">Selection Screen</p>
        <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto">
          <Button
            className="w-full justify-between"
            variant="outline"
            colorScheme="primary"
            onClick={handleNewConversation}
            disabled={isPending}
          >
            Start chat
          </Button>
          <ChatList sessionId={sessionId} onOpen={handleOpenConversation} />
        </div>
      </div>
    </div>
  );
}

interface ChatListProps {
  sessionId: Id<"contactSessions">;
  onOpen: (conversationId: Id<"conversations">) => void;
}
function ChatList({ sessionId, onOpen }: ChatListProps) {
  const { results, isLoading, status, loadMore } = usePaginatedQuery(
    api.public.conversations.getMany,
    sessionId
      ? {
          contactSessionId: sessionId,
        }
      : "skip",
    {
      initialNumItems: 2,
    },
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!results.length) return <div>No chats</div>;

  return (
    <div>
      {results.map((conversation) => {
        return (
          <div key={conversation._id}>
            <Button
              onClick={() => {
                onOpen(conversation._id);
              }}
            >
              {conversation._id}
            </Button>
            <strong>{conversation.status}</strong>
            <p className="mb-6">{conversation.lastMessage?.text}</p>
          </div>
        );
      })}
      <InfiniteScrollTrigger
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={true}
        observerEnabled={false}
        onLoadMore={() => {
          loadMore(2);
        }}
      />
    </div>
  );
}
