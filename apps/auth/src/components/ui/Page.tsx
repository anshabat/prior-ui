import type { ReactNode } from "react";
import { Heading, Stack, Text } from "@workspace/ui";

export interface PageProps {
  title: string;
  subtitle?: ReactNode;
  // For the browser tab, when it should differ from the visible heading
  documentTitle?: string;
  children: ReactNode;
}

export function Page({
  title,
  subtitle,
  documentTitle = title,
  children,
}: PageProps) {
  return (
    <Stack gap="48">
      <title>{documentTitle}</title>
      <Stack as="hgroup" gap="8">
        <Heading as="h1">{title}</Heading>
        {subtitle && <Text tone="weak">{subtitle}</Text>}
      </Stack>
      {children}
    </Stack>
  );
}
