import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import { Card as TcgCard } from "../../../lib/card.interface";
import styles from "./ListDeck.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/loadingSlice";
import { setSuccess } from "../../store/successSlice";

export default function ListDecks() {

  const dispatch = useAppDispatch();
  const { decks } = useAppSelector((state) => state.decks);

  async function validateDeck(e, deck) {
    e.preventDefault();
    dispatch(setLoading(true));

    const dto = {
      ...deck,
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
      dispatch(setSuccess(true));
    }
    dispatch(setLoading(false));
  }

  if (decks?.length > 0) {
    return (
      <Box>
        {decks.map((d, i) => (
          <Card key={d.name}>
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
                    <IconButton aria-label="validate deck" onClick={async (e) => await validateDeck(e, d.deck)}>
                      <CheckIcon/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate PDF">
                    <IconButton aria-label="generate pdf">
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
                  {d.deck.Pokemon.sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
                <Box sx={{ flexDirection: "column", margin: "0 0.5rem"}}>
                  Top 4 Trainers
                  {d.deck.Trainer.sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
                <Box sx={{ flexDirection: "column", margin: "0 0.5rem"}}>
                  Top 4 Energy
                  {d.deck.Energy.sort((a, b) => b.quantity - a.quantity).filter((_c, i) => i <= 3).map((c: TcgCard) => (
                    <p className={styles.cardRow}>{c.quantity}x {c.name} <span className={styles.setInfo}>({c.setAbbr} {c.setNumber})</span></p>
                  ))}
                </Box>
              </Box>
              <PieChart
                height={300}
                series={[
                  {
                    arcLabel: (item) => `${item.value}`,
                    innerRadius: 0,
                    outerRadius: 80,
                    data: [
                      { value: d.deck.Pokemon.reduce((acc, c) => acc += c.quantity, 0), label: "Pokémon", color: "green",},
                      { value: d.deck.Trainer.reduce((acc, c) => acc += c.quantity, 0), label: "Trainers", color: "orange", },
                      { value: d.deck.Energy.reduce((acc, c) => acc += c.quantity, 0), label: "Energy", color: "blue" },
                    ]
                  },
                  {
                    arcLabel: (item) => `${item.value}`,
                    innerRadius: 100,
                    outerRadius: 120,
                    data: [
                      { value: d.deck.Pokemon.filter(p => p.subtypes.includes("Basic")).reduce((acc, c) => acc += c.quantity, 0), label: "Basic", color: "#339933"},
                      { value: d.deck.Pokemon.filter(p => p.subtypes.includes("Stage 1")).reduce((acc, c) => acc += c.quantity, 0), label: "Stage 1", color: "#80c080"},
                      { value: d.deck.Pokemon.filter(p => p.subtypes.includes("Stage 2")).reduce((acc, c) => acc += c.quantity, 0), label: "Stage 2", color: "#003300"},
                      { value: d.deck.Pokemon.filter(p => p.subtypes.includes("VSTAR")).reduce((acc, c) => acc += c.quantity, 0), label: "VSTAR", color: "#001a00"},
                      { value: d.deck.Trainer.filter(p => p.subtypes.includes("Supporter")).reduce((acc, c) => acc += c.quantity, 0), label: "Supporters", color: "#332100"},
                      { value: d.deck.Trainer.filter(p => p.subtypes.includes("Item")).reduce((acc, c) => acc += c.quantity, 0), label: "Items", color: "#996300"},
                      { value: d.deck.Trainer.filter(p => p.subtypes.includes("Stadium")).reduce((acc, c) => acc += c.quantity, 0), label: "Stadiums", color: "#ffc04d"},
                      { value: d.deck.Trainer.filter(p => p.subtypes.includes("Pokémon Tool")).reduce((acc, c) => acc += c.quantity, 0), label: "Tools", color: "#ffa500"},
                      { value: d.deck.Energy.filter(p => p.subtypes.includes("Basic")).reduce((acc, c) => acc += c.quantity, 0), label: "Basic", color: "#000080" },
                      { value: d.deck.Energy.filter(p => p.subtypes.includes("Special")).reduce((acc, c) => acc += c.quantity, 0), label: "Special", color: "#3333ff" },
                    ]
                  }
                ]}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  } else {
    return <p>No decks yet!</p>
  }
}