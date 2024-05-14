"use client"

import { Button, Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import styles from "./page.module.css";

export default function Page() {
  const pages = [
    {
      title: "Set List",
      descriptions: ["Want to print out a set list to quickly reference chronological release dates and to which set that weird squiggly 'W' belongs? Look no further!"],
      button: "Check it out",
      href: "/collection/set-list"
    },
    {
      title: "McTracker",
      descriptions: ["Casual Collector? Master Set Mogul? Full Art Fanatic? No matter the need, the McTracker strives to be your best collecting companion."],
      button: "Coming Soon!",
      href: "/collection"
    },
  ]
  return (
    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
      {pages.map((p) => {
        return (
          <Grid item xs={2} sm={4} md={4}>
            <Card sx={{margin: "1rem 0.5rem"}}>
              <CardHeader title={p.title} />
              <CardContent className={styles.cardContent}>
                {p.descriptions.map((d) => <p className={styles.description}>{d}</p>)}
              </CardContent>
              <CardActions>
                <Button size="small" href={p.href}>{p.button}</Button>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}