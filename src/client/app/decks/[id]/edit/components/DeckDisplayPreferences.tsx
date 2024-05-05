import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";
import { DeckDisplayType } from "../../../../../lib/deck-display-type.interface";
import { useId } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setDeckDisplayPreference } from "../../../../store/displayPreferencesSlice";

export default function DeckDisplayPreferences() {
  const { deckDisplay: displayType } = useAppSelector((state) => state.displayPreferences );
  const dispatch = useAppDispatch()
  const displayTypeLabelId = useId();
  const displayTypeId = useId();
  function setDisplayType(t: DeckDisplayType) {
    dispatch(setDeckDisplayPreference(t));
  }
  
  return (
    <FormControl>
      <FormLabel id={displayTypeLabelId}>Display Type</FormLabel>
      <Select
        labelId={displayTypeLabelId}
        id={displayTypeId}
        name="displayType"
        value={displayType}
        onChange={(e) => setDisplayType(e.target.value as DeckDisplayType)}
      >
        <MenuItem value={DeckDisplayType.List}>List</MenuItem>
        <MenuItem value={DeckDisplayType.Card}>Cards</MenuItem>
      </Select>
    </FormControl>
  )
}