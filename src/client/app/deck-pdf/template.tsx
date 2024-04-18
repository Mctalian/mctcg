"use client"

import { useAppSelector } from "../store/hooks";
import { usePathname, useRouter } from "next/navigation";
import MissingDataRedirect from "./components/MissingDataRedirect";

export default function Template({ children }: { children: React.ReactNode }) {
  const { deck } = useAppSelector((state) => state.deck);
  const { blob, error } = useAppSelector((state) => state.pdf);
  const pathname = usePathname();

  switch (pathname) {
    case '/deck-pdf':
      return (
        <>{children}</>
      )
    case '/deck-pdf/import-success':
      return (
        <MissingDataRedirect dataReady={deck} children={children} />
      )
    case '/deck-pdf/prepare':
      return (
        <MissingDataRedirect dataReady={deck} children={children} />
      )
    case '/deck-pdf/success':
      return (
        <MissingDataRedirect dataReady={blob} children={children} />
      )
    case '/deck-pdf/error':
      return (
        <MissingDataRedirect dataReady={error} children={children} />
      )
  }

  return (
    <>{children}</>
  )
}