import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {  
  Add as AddIcon,
  ArrowDownward as ArrowDownwardIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import { Suspense } from "react";
import styles from "./DecksHeader.module.css"
import { useAppSelector } from "../../store/hooks";

export default function DecksHeader() {
  const { playerName, playerId } = useAppSelector((state) => state.playerInfo);
  return (
    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", marginBottom: "1rem" }}>
      <Box sx={{ justifyContent: "start"}}>
        <Button className={styles.button} sx={{ marginRight: "1rem"}} variant="contained" href="/decks/new"><AddIcon/>New Deck</Button>
      </Box>
      <Box sx={{ justifyContent: "end"}}>
        <Suspense fallback="Loading...">
          { !(playerName && playerId) ? (
            <Button className={styles.button} sx={{ marginRight: "1rem"}} variant="contained" href="/decks/player-info"><EditIcon/>Enter Player Info</Button>
          ) : (
            <p><strong>{playerName}</strong> <em>{playerId}</em><Tooltip title="Edit Player Info">
            <IconButton aria-label="edit deck" href={`/decks/player-info`}>
              <EditIcon/>
            </IconButton>
          </Tooltip></p>
          ) }
        </Suspense>
      </Box>
    </Box>
  )
}