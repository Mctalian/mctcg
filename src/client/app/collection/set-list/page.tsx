"use client"

import { Box, CircularProgress } from "@mui/material";
import { compareDesc } from "date-fns";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useEffect, useState } from "react"
import styles from "./page.module.css";

export default function Page() {
  const [setList, setSetList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [setGroups, setSetGroups] = useState([]);
  const [loadingSetList, setLoadingSetList] = useState(true);

  function noGallerySets(s) {
     return !s.name.includes("Gallery") &&
      !s.name.includes("Collection") &&
      !(
        s.name.includes("Shiny Vault") &&
        !s.name.includes("Hidden Fates")
      )
  }

  useEffect(() => {
    // fetch("/api/v1/sets?cachedResultsOnly=false")
    setLoadingSetList(true);
    fetch("/api/v1/sets")
      .then((response) => {
        if (response.status !== 200) {
          return { error: response.statusText }
        }
        return response.json();
      })
      .then(j => {
        if (j.error) {
          return []
        }
        return j.sets;
      })
      .then((s) => {
        setSetList(s)
      })
  }, [])

  useEffect(() => {
    if (!setList.length) {
      return;
    }
    const series = new Set();
    setList.forEach((set: PokemonTCG.Set) => series.add(set.series));
    setSeriesList(Array.from(series));
  }, [setList])

  useEffect(() => {
    if (!seriesList.length) {
      return;
    }
    const groupings = seriesList.map((series) => {
      const seriesSets: PokemonTCG.Set[] = setList
        .filter((s:PokemonTCG.Set) => s.series === series)
        .filter(noGallerySets)
        .sort((a, b) => compareDesc(a.releaseDate, b.releaseDate) );
      const { startYear, endYear } = seriesSets.reduce((acc, s) => {
        const setYear = new Date(s.releaseDate).getFullYear();
        const sY = Math.min(acc.startYear, setYear);
        const eY = Math.max(acc.endYear, setYear);
        return { startYear: sY, endYear: eY }
      }, { startYear: 9999, endYear: 0 });
      return {
        name: series,
        seriesSets,
        startYear,
        endYear,
      };
    });
    setSetGroups(groupings.sort((a, b) => b.startYear - a.startYear ));
    setLoadingSetList(false);
  }, [seriesList])

  return (
    <>
      { loadingSetList && <CircularProgress /> }
      { setGroups &&
        <Box className={styles.setListMain} sx={{columnCount: 3 }}>
          {setGroups.map((g) => {
            return (
              <Box className={styles.series}>
                <span className={styles.seriesName}>{`${g.name} (${g.startYear}-${g.endYear})`}</span>
                {g.seriesSets.map((s) => {
                  return <Box className={styles.setRow} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <span className={styles.logoContainer}>
                      <img
                        className={styles.setLogo}
                        src={s.images.symbol}
                      />
                    </span>
                    <span className={styles.setNameContainer}>
                      <span className={styles.setName}>{s.name}</span>
                    </span>
                    <span className={styles.setYear}>{new Date(s.releaseDate).getFullYear()}</span>
                  </Box>
                })}
              </Box>
            );
          })}
        </Box>
      }
    </>
  )
}