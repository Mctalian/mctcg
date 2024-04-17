import { GitHub } from "@mui/icons-material";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>No personal data is stored on the server.</p>
      <p>This website is fan-created and not affiliated with or endorsed by Nintendo or The Pokémon Company.</p>
      <p>Made by <a href="https://github.com/mctalian" target="_blank"><GitHub fontSize="small"></GitHub> McTalian</a> (2024)</p>
      <p>This is currently a rough prototype. Open source coming soon!</p>
    </footer>
  )
}
