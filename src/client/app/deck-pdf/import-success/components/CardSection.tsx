import { List, ListItem, ListItemText, ListSubheader } from "@mui/material";

export default function CardSection({ name, cards }) {
  return (
    <>
      <li key={`section-${name}`}>
        <ul>
          <ListSubheader>
            <h3>{name}: {cards.map((p) => p.quantity).reduce((acc, c) => acc += c, 0)} total ({cards.length} groups)</h3>
          </ListSubheader>
          {cards.map((card) => (
            <ListItem key={`${card.setAbbr}-${card.setNumber}`}>
              <ListItemText primary={`${card.quantity}x ${card.name} (${card.setAbbr} ${card.setNumber})`}></ListItemText>
            </ListItem>
          ))}
        </ul>
      </li>
    </>
    // <>
    //   <h3>{name}: {cards.map((p) => p.quantity).reduce((acc, c) => acc += c, 0)} ({cards.length})</h3>
    //   <ul>
    //     {cards.map((card) => (
    //       <li key={`${card.setAbbr}-${card.setNumber}`}>
    //         {card.quantity}x {card.name} ({card.setAbbr} {card.setNumber})
    //       </li>
    //     ))}
    //   </ul>
    // </>
  )
}
