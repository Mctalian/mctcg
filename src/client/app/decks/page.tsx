"use client"

import { Suspense } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
const DecksHeader = dynamic(() => import("./components/DecksHeader"), { ssr: false});
const ListDecks = dynamic(() => import("./components/ListDecks"), { ssr: false });

export default function Page() {
  return (
    <>
      <DecksHeader />
      <Box>
        <Suspense fallback="Loading...">
          <ListDecks />
        </Suspense>
      </Box>
    </>
  )
}