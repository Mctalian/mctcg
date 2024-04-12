export default function CardSection({ name, cards }) {
  return (
    <>
      <h3>{name}: {cards.map((p) => p.quantity).reduce((acc, c) => acc += c, 0)} ({cards.length})</h3>
      <ul>
        {cards.map((card) => (
          <li key={`${card.setAbbr}-${card.setNumber}`}>
            {card.quantity}x {card.name} ({card.setAbbr} {card.setNumber})
          </li>
        ))}
      </ul>
    </>
  )
}
