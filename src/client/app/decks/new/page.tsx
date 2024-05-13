"use client"

import { SortType } from "@mctcg/lib/sort-type.enum";
import { addDeck } from "@mctcg/store/decksSlice";
import { useAppDispatch, useAppSelector } from "@mctcg/store/hooks";
import { Button, Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const dispatch = useAppDispatch();
  const { selectedDeckIndex } = useAppSelector((state) => state.decks );
  const router = useRouter();

  useEffect(() => {
    if (selectedDeckIndex !== -1) {
      router.push(`/decks/${selectedDeckIndex}/edit`);
    }
  }, [selectedDeckIndex]);

  const pages = [
    {
      title: "New Blank Deck",
      description: "Start a new deck from scratch.",
      button: "Get Started",
      fn: (e) => {
        e.preventDefault();
        dispatch(addDeck({
          name: `Deck ${crypto.randomUUID()}`,
          sortType: SortType.SetChronological,
          deck: {
            Pokemon: [],
            Trainer: [],
            Energy: [],
          }
        }))

      },
      href: ""
    },
    {
      title: "PTCG Live Import",
      description: "Have your favorite deck on the Pokemon TCG Live App? Create your deck from an export.",
      button: "Import",
      fn: () => {},
      href: "/decks/import"
    },
  ];

  return (
    <Grid container spacing={2}>
      {pages.map((p) => {
        return (
          <Card sx={{margin: "1rem 0.5rem", maxWidth: "25%"}}>
            <CardHeader title={p.title} />
            <CardContent>
              {p.description}
            </CardContent>
            <CardActions>
              <Button size="small" href={p.href} onClick={p.fn}>{p.button}</Button>
            </CardActions>
          </Card>
        )
      })}
    </Grid>
  )
}
