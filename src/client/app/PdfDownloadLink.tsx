export default function PdfDownloadLink({ blob }) {
  const href = URL.createObjectURL(blob);
  return (
    <>
      <h2>Successfully generated your Decklist as a PDF!</h2>
      <a href={href} download="decklist.pdf">
        Download PDF
      </a>
    </>
  )
}
