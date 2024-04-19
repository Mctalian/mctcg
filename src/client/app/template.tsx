"use client"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { Provider } from "react-redux"
import Footer from "./components/Footer"
import Loader from "./components/Loader"
import styles from "./template.module.css"
import { store } from "./store/store"
import TitleBar from "./components/TitleBar"

export default function Template({ children }) {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <Loader />
        <TitleBar />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
      </Provider>
    </LocalizationProvider>
  )
}