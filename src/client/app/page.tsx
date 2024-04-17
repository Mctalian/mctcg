"use client";

import React from "react";
import { Provider } from "react-redux";
import Image from "next/image";
import { AppBar, Toolbar } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, yellow } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { store } from "./store";
import PageContentStateMachine from "./PageContentStateMachine";
import Loader from "./Loader";
import Footer from "./Footer";


const darkTheme = createTheme({
  palette: {
    primary: red,
    secondary: yellow,
    mode: 'dark',
  },
});

export default function Page() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <Loader />
          <AppBar position="static">
            <Toolbar>
              <a href="/" style={{ textDecoration: "none", color: "white" }}>
                <Image src="/mctcg_white_transparent.png" alt="McTCG Logo" width={70} height={40} style={{ margin: "0 4px"}} />
              </a>
            </Toolbar>
          </AppBar>
          <PageContentStateMachine />
          <Footer />
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
