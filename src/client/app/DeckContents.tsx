import CardSection from "./CardSection";

export default function DeckContents({ deck, deckName, setStartPdfFlow }) {
  return (
    <div>
      <h2>{deckName}</h2>
      <button onClick={(e) => setStartPdfFlow(true)}>Generate PDF</button>
      <CardSection name="Pokémon" cards={deck.Pokemon} />
      <CardSection name="Trainers" cards={deck.Trainer} />
      <CardSection name="Energy" cards={deck.Energy} />
    </div>
  )
}