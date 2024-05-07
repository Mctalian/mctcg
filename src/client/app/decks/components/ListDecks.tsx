import { Box, Card, CardContent, CardHeader, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Card as TcgCard } from "../../../lib/card.interface";
import styles from "./ListDeck.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/loadingSlice";
import { setSuccess } from "../../store/successSlice";
import { useRouter } from "next/router";
import { updateDeck } from "../../store/decksSlice";
import { SortType } from "../../../lib/sort-type.enum";

export default function ListDecks() {

  const dispatch = useAppDispatch();
  const { decks } = useAppSelector((state) => state.decks);
  const { playerName, playerId, playerDob, preferredSort } = useAppSelector((state) => state.playerInfo);

  async function validateDeck(e, d, i) {
    e.preventDefault();

    const name = `${d.name}`;
    const sortType = `${d.sortType || SortType.SetChronological}` as SortType;

    const dto = {
      ...d.deck,
    };
    const response = await fetch("/api/v1/deck/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });
    if (response.status !== 200) {
      console.error(response.statusText);
    } else {
      dispatch(updateDeck({
        deckIndex: i,
        deck: {
          name,
          deck: await response.json(),
          sortType
        }
      }));
      dispatch(setSuccess(true));
    }
    dispatch(setLoading(false));
  }

  async function generatePdf(e, deck) {
    e.preventDefault();

    if (playerName && playerId && playerDob) {
      const dto = {
        ...deck,
        playerName,
        playerId,
        playerDob,
        sortType: preferredSort
      };
      const response = await fetch("/api/v1/deck/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      if (response.status !== 200) {
        console.error(response.statusText);
      } else {
        const blob = await response.blob();
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `decklist.pdf`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } else {
      const router = useRouter();
      router.push("/decks/player-info");
    }
    dispatch(setLoading(false));
  }

  if (decks?.length > 0) {
    dispatch(setLoading(false));
    return (
      <Box>
        {decks.map((d, i) => (
          <Card key={d.name} sx={{ margin: "0.5rem"}}>
            <CardHeader
              title={d.name}
              action={
                <>
                  <Tooltip title="Edit Deck">
                    <IconButton aria-label="edit deck" href={`/decks/${i}/edit`}>
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Validate Deck">
                    <IconButton aria-label="validate deck" onClick={async (e) => dispatch(setLoading(true)) && await validateDeck(e, d, i)}>
                      <CheckIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate PDF">
                    <IconButton aria-label="generate pdf" onClick={async (e) => dispatch(setLoading(true)) && await generatePdf(e, d.deck)}>
                      <FileDownloadIcon/>
                    </IconButton>
                  </Tooltip>
                </>
              }
              subheader={`${d.deck.format} ${d.deck.errors?.length > 0 ? "(Invalid)" : "(Valid)"}`}
            />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "row"}}>
                <Box sx={{ flexDirection: "column", margin: "0 0.5rem"}}>
                  Top 4 Pokemon
                  {d.deck.Pokemon.slice().sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p key={`${c.setAbbr}-${c.setNumber}`} className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
                <Box sx={{ flexDirection: "column", margin: "0 0.5rem"}}>
                  Top 4 Trainers
                  {d.deck.Trainer.slice().sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p key={`${c.setAbbr}-${c.setNumber}`} className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
                <Box sx={{ flexDirection: "column", margin: "0 0.5rem"}}>
                  Top 4 Energy
                  {d.deck.Energy.slice().sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p key={`${c.setAbbr}-${c.setNumber}`} className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  } else {
    return <p>No decks yet!</p>
  }
}