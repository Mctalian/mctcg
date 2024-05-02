import { Box, List, ListItem } from "@mui/material"
import { DisplayType } from "./EditDeck"
import { Card } from "../../../../../lib/card.interface"
import styles from "./SectionList.module.css";

interface SectionListProps {
  list: Card[],
  displayType: DisplayType
}

export default function SectionList({ list, displayType }: SectionListProps) {
  function isCardDisplay() {
    return displayType === DisplayType.Card;
  }
  function listMode() {
    return (
      <List>
        { list.map((c) => (
          <ListItem key={`${c.setAbbr}-${c.setNumber}`}>
            {c.quantity}x {c.name} ({c.setAbbr} {c.setNumber} Reg: {c.regCode})
          </ListItem>
        ))}
      </List>
    )
  }
  function cardMode() {
    const widthRatio = 5;
    const heightRatio = 7;
    const sizeCoefficient = 2;
    const fontSize = 16;
    const width = widthRatio * sizeCoefficient * fontSize;
    const height = heightRatio * sizeCoefficient * fontSize;
    return (
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        { list.map((c) => (
          <Box className={styles.container} sx={{ width: width}}>
            <img 
              className={styles.cardImage}
              key={`${c.setAbbr}-${c.setNumber}`}
              src={c.images.large}
              alt={`${c.quantity} ${c.name} ${c.setAbbr} ${c.setNumber}`}
              width={width}
              height={height}
            />
            <span className={styles.quantity}>{c.quantity}</span>
          </Box>
          
        ))}
      </Box>
    )
  }

  if (isCardDisplay()) {
    return cardMode();
  } else {
    return listMode();
  }
}