import { Card } from "@mctcg/lib/card.interface";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import styles from "./DisplayCardMode.module.css";

interface DisplayCardModeProps {
  list: Card[];
  handleClick: (c: Card) => void;
  disableHover?: boolean
  sizeCoefficient?: number
}

export default function DisplayCardMode({ list, handleClick, disableHover = false, sizeCoefficient = 2, }: DisplayCardModeProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const widthRatio = 5;
  const heightRatio = 7;
  const fontSize = 16;
  const mobileCoefficient = isMobile ? 0.8 : 1;
  const width = widthRatio * sizeCoefficient * mobileCoefficient * fontSize;
  const height = heightRatio * sizeCoefficient * mobileCoefficient * fontSize;
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