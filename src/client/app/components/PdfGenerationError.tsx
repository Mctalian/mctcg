import styles from "./PdfGenerationError.module.css";

export default function PdfGenerationError({ error }) {
  return (
    <>
      <h2>Error generating PDF:</h2>
      <pre className={styles.errorCode}>{error}</pre>
    </>
  )
}
