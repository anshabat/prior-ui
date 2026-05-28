import { usePathname, useSearchParams } from "next/navigation";

export const useHref = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const currentPath = `${pathname}${query}`;
  return `${baseUrl}${currentPath}`;
};
