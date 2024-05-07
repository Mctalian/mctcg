import { decrementCardQuantity, incrementCardQuantity, removeCardFromDeck } from "@mctcg/store/decksSlice";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { Add, Delete, Remove } from "@mui/icons-material";
import { Box, Button, Dialog, DialogTitle } from "@mui/material";

interface CardDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function CardDialog({ open, handleClose }: CardDialogProps) {
  const dispatch = useAppDispatch();
  const card = useAppSelector((state) => state.decks.selectedCard);
  const widthRatio = 5;
  const heightRatio = 7;
  const sizeCoefficient = 4;
  const fontSize = 16;
  const width = widthRatio * sizeCoefficient * fontSize;
  const height = heightRatio * sizeCoefficient * fontSize;
  function incrementCardDisabled() {
    return card.quantity >= 4 && !(card.supertype === "Energy" && card.subtypes.includes("Basic"));
  }
  function decrementCardDisabled() {
    return card.quantity === 0;
  }
  function incrementQuantity() {
    const cardSection = card.supertype === "Pokémon" ? "Pokemon" : card.supertype;
    dispatch(incrementCardQuantity({
      cardSection,
      cardIdentifier: `${card.setAbbr}-${card.setNumber}`,
    }));
  }
  function decrementQuantity() {
    const cardSection = card.supertype === "Pokémon" ? "Pokemon" : card.supertype;
    dispatch(decrementCardQuantity({
      cardSection,
      cardIdentifier: `${card.setAbbr}-${card.setNumber}`,
    }));
    if (card.quantity === 1) {
      handleClose();
    }
  }
  function removeCard() {
    dispatch(removeCardFromDeck(card))
    handleClose();
  }
  function dialogContents() {
    if (!card) {
      return <>
        <DialogTitle>Loading...</DialogTitle>
      </>
    }
    return (
      <>
        <DialogTitle>{card.name} ({card.setAbbr} {card.setNumber})</DialogTitle>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem"}}>
          <img src={card.images.large} width={width} height={height} />
          {!decrementCardDisabled() && (<Button sx={{ marginTop: "1rem" }} variant="contained" onClick={removeCard}><Delete /> Remove from Deck</Button>) }
          <Box sx={{ marginTop: "1rem" }}>
            <Button
              variant="contained"
              sx={{ marginRight: "0.5rem"}}
              disabled={decrementCardDisabled()}
              onClick={decrementQuantity}
            >
              <Remove/>
            </Button>
            <span>In Deck: {card.quantity}</span>
            <Button
              variant="contained" 
              sx={{ marginLeft: "0.5rem"}}
              disabled={incrementCardDisabled()}
              onClick={incrementQuantity}
            >
              <Add />
            </Button>
          </Box>
        </Box>
      </>
    )
  }
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
    >
      {dialogContents()}
    </Dialog>
  )
}