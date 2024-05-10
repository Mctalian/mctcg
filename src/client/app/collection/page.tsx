"use client"

import { Button, Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";

export default function Page() {
  const pages = [
    {
      title: "Set List",
      description: "Want to print out a set list to quickly reference chronological release dates and to which set that weird squiggly 'W' belongs? Look no further!",
      button: "Check it out",
      href: "/collection/set-list"
    },
    {
      title: "McTracker",
      description: "Casual Collector? Master Set Mogul? Full Art Fanatic? No matter the need, the McTracker strives to be your best collecting companion.",
      button: "Start collecting",
      href: "/collection"
    },
  ]
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
              <Button size="small" href={p.href}>{p.button}</Button>
            </CardActions>
          </Card>
        )
      })}
    </Grid>
  )
}