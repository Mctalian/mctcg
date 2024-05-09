"use client"

import { Box, List, ListItem } from "@mui/material"
import { useState } from "react";
import { Card } from "@mctcg/lib/card.interface"
import { DeckDisplayType } from "@mctcg/lib/deck-display-type.interface";
import styles from "./SectionList.module.css";
import CardDialog from "./CardDialog";
import { useAppDispatch } from "@mctcg/store/hooks";
import { selectCard } from "@mctcg/store/decksSlice";
import DisplayCardMode from "./DisplayCardMode";

interface SectionListProps {
  list: Card[],
  displayType: DeckDisplayType
}

export default function SectionList({ list, displayType }: SectionListProps) {
  const dispatch = useAppDispatch();
  function isCardDisplay() {
    return displayType === DeckDisplayType.Card;
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

  if (!list) {
    return <></>
  }
  if (isCardDisplay()) {
    return cardMode();
  } else {
    return listMode();
  }
}