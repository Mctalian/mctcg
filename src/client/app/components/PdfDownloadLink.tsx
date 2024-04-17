import { Button } from "@mui/material";
import styles from "./PdfDownloadLink.module.css";
import { sendGAEvent } from "@next/third-parties/google";

export default function PdfDownloadLink({ blob }) {
  const href = URL.createObjectURL(blob);
  return (
    <>
      <h2>Successfully generated your Official Pokémon Decklist PDF! 🎉</h2>
      <Button
        className={styles.download}
        href={href}
        download="decklist.pdf"
        variant="contained"
        onClick={() => sendGAEvent({ event: "buttonClicked", value: "downloadPdf"})}
      >Download PDF
      </Button>
    </>
  )
}
