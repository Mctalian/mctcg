"use client"

import { Box, Button, List, ListItem } from "@mui/material"
import { Card } from "@mctcg/lib/card.interface"
import { DeckDisplayType } from "@mctcg/lib/deck-display-type.interface";
import { useAppDispatch } from "@mctcg/store/hooks";
import { selectCard } from "@mctcg/store/decksSlice";
import DisplayCardMode from "./DisplayCardMode";

interface SectionListProps {
  list: Card[],
  displayType: DeckDisplayType,
  addNewCard: () => void,
}

export default function SectionList({ list, displayType, addNewCard }: SectionListProps) {
  const dispatch = useAppDispatch();
  function isCardDisplay() {
    return displayType === DeckDisplayType.Card;
  }
  function listMode() {
    return (
      <List>
        { list.map((c) => (
          <ListItem key={`${c.id}`}>
            <Box sx={{
              width: "100%",
              backgroundClip: "border-box",
              backgroundImage: `url(${c.images.large})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "80px 112px",
              backgroundPosition: "80% -20px",
              cursor: "pointer",
            }} onClick={() => handleClick(c)}>
              {c.quantity}x <strong>{c.name}</strong> <em style={{ fontSize: "0.8rem", verticalAlign: "middle", lineHeight: "1.5" }}>({c.setAbbr} {c.setNumber} Reg: {c.regCode})</em>
            </Box>
          </ListItem>
        ))}
      </List>
    )
  }
  function handleClick(card: Card) {
    dispatch(selectCard(card));
  }
  function cardMode() {
    return (
      <>
        <DisplayCardMode list={list} handleClick={handleClick} />
      </>
    )
  }

  if (!list || list.length === 0) {
    return <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
      <span>You haven't added any cards yet.</span>
      <Button sx={{ flex: 1 }} onClick={addNewCard}>Add a Card</Button>
    </Box>
  }
  if (isCardDisplay()) {
    return cardMode();
  } else {
    return listMode();
  }
}