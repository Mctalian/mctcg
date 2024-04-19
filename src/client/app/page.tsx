import Image from 'next/image';
import styles from "./page.module.css";
import logo from './mctcg_gold_transparent.png';

export default function Page() {

  return (
    <>
      <Image className={styles.logo} src={logo} alt="McTCG" width={300} height={170} />
      <h1 className={styles.header}>Welcome to McTCG</h1>
      <section className={styles.section}>
        <p>As a fan of the <a href="https://www.pokemon.com/us/pokemon-tcg" target='_blank'>Pokemon Trading Card Game</a>, I wanted to create some tools that I thought would be useful for collectors and players.</p>
        <p><a href="/deck-pdf">Deck PDF</a> is the first of these tools, hoping to make decklists for tournaments simple and consistent.</p>
        <p>Please give it a shot. I hope you find it useful!</p>
      </section>
    </>
  );
}
