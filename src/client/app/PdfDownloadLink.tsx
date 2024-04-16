import { Button } from "@mui/material";
import styles from "./PdfDownloadLink.module.css";

export default function PdfDownloadLink({ blob }) {
  const href = URL.createObjectURL(blob);
  return (
    <>
      <h2>Successfully generated your Official Pokémon Decklist PDF! 🎉</h2>
      <Button className={styles.download} href={href} download="decklist.pdf" variant="contained">
        Download PDF
      </Button>
    </>
  )
}
