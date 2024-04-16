import { useId } from 'react';
import styles from './DeckImportForm.module.css';

export default function DeckImportForm({ importFormAction, setDeckName, deckName }) {
  const deckNameId = useId();
  const deckListId = useId();
  return (
    <>
      <div className={styles.description}>
        <p>
          Begin by pasting your decklist below. Decklists can be generated from Pokemon TCG Live.
        </p>
      </div>
      <form action={importFormAction}>
        <div className={styles.formField}>
          <label htmlFor={deckNameId}>Deck Name</label>
          <input id={deckNameId} type="text" name="deckName" onChange={(e) => setDeckName(e.target.value)} value={deckName}/>
        </div>

        <div className={styles.formField}>
          <label htmlFor={deckListId}>Decklist</label>
          <textarea id={deckListId} className={styles.textarea} name="decklist" rows={12} cols={60} required/>
        </div>

        <button className={styles.formButton} type="submit">
          Import
        </button>
      </form>
    </>
  )
}