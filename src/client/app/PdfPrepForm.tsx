import styles from "./page.module.css";
import { useId } from "react";

export default function PdfPrepForm({ deck, generateFormAction }) {
  const playerNameId = useId();
  const playerIdId = useId();
  const playerDobId = useId();
  const formatId = useId();
  return (
    <>
      <form action={generateFormAction}>
        <div className={styles.formField}>
          <label htmlFor={playerNameId}>Player Name</label>
          <input id={playerNameId} type="text" name="playerName" required/>
        </div>

        <div className={styles.formField}>
          <label htmlFor={playerIdId}>Player ID</label>
          <input id={playerIdId} type="text" name="playerId" required/>
        </div>

        <div className={styles.formField}>
          <label htmlFor={playerDobId}>Player DOB</label>
          <input id={playerDobId} type="date" name="playerDob" required/>
        </div>

        <div className={styles.formField}>
          <label htmlFor={formatId}>Format</label>
          <select id={formatId} name="format" required>
            <option value="standard">Standard</option>
            <option value="expanded">Expanded</option>
          </select>
        </div>

        <input className={styles.deckInput} type="hidden" name="deck" value={JSON.stringify(deck)}/>

        <button className={styles.formButton} type="submit">
          Generate PDF
        </button>
      </form>
    </>
  )
}