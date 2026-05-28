"use client";

import { Button } from "@workspace/ui";
import { useMutation } from "convex/react";
import { api } from "@workspace/chat-api/convex/_generated/api.js";

interface LoginScreenProps {
  onError: (error: string | null) => void;
  onSuccess: (contactSessionId: string) => void;
}

export function LoginScreen({ onError, onSuccess }: LoginScreenProps) {
  const createContactSession = useMutation(api.public.contactSessions.create);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const contactSessionId = await createContactSession({
        name,
        email,
      });

      onSuccess(contactSessionId);
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Failed to create contact session",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        name="name"
        placeholder="Name"
        autoComplete="off"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
        autoComplete="off"
        className="border border-gray-300 rounded px-3 py-2"
      />
      <Button colorScheme="primary" variant="solid" size="md">
        Submit
      </Button>
    </form>
  );
}
