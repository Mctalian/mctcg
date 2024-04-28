import dynamic from "next/dynamic";
import { Suspense } from "react";
const EditDeck = dynamic(() => import("./components/EditDeck"), { ssr: false });
import { Box, Button } from "@mui/material";

export default function Page({ params }: { params: { id: string }}) {
  return (
    <>
      <Box sx={{ display: "flex", alignSelf: "flex-start" }}>
        <Button href="/decks" variant="contained">Back to Decks</Button>
      </Box>
      <Suspense fallback="Loading...">
        <EditDeck deckIndex={+params.id} />
      </Suspense>
    </>
  )
}
