import { Card } from "@mctcg/lib/card.interface";
import { Box } from "@mui/material";
import styles from "./DisplayCardMode.module.css";

interface DisplayCardModeProps {
  list: Card[];
  handleClick: (c: Card) => void;
  disableHover?: boolean
  sizeCoefficient?: number
}

export default function DisplayCardMode({ list, handleClick, disableHover = false, sizeCoefficient = 2, }: DisplayCardModeProps) {
  const widthRatio = 5;
  const heightRatio = 7;
  const fontSize = 16;
  const width = widthRatio * sizeCoefficient * fontSize;
  const height = heightRatio * sizeCoefficient * fontSize;
  const classes = [styles.container]
  if (disableHover) {
    classes.push(styles.disableHover)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
      { list.map((c) => (
        <Box
          key={`${c.id}`}
          className={classes.join(" ")}
          sx={{ width: width}}
          onClick={() => handleClick(c)}
        >
          <img 
            className={styles.cardImage}
            src={c.images.large}
            alt={`${c.quantity} ${c.name} ${c.setAbbr} ${c.setNumber}`}
            width={width}
            height={height}
          />
          { c.quantity > 0 && <span className={styles.quantity}>{c.quantity}</span> }
        </Box>
      ))}
    </Box>
  )
}