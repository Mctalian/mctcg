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
        <p>For the first tool, you can create your decks from Pokemon TCG Live exports and generate a PDF decklist with a single click.</p>
        <p>Please head over to the <a href="/decks">Decks Page</a> to give it a try. I hope you find it useful!</p>
        <p>More features and improvements to come!</p>
      </section>
    </>
  );
}
