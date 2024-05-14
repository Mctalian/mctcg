import { GitHub } from "@mui/icons-material";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>No personal data is stored on the server.</p>
      <p>This website is fan-created and not affiliated with nor endorsed by Nintendo or The Pokémon Company.</p>
      <p>Made by <strong><a href="https://github.com/mctalian" target="_blank"><GitHub sx={{height: "0.8rem", lineHeight: "1.5", verticalAlign: "middle"}} fontSize="small"></GitHub> McTalian</a></strong> (2024)</p>
      <p>This is currently a rough prototype. Open source coming soon!</p>
      <a href="https://www.buymeacoffee.com/mctalian"><img className={styles.buyMeACoffee} src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=mctalian&button_colour=FF5F5F&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" /></a>
    </footer>
  )
}
