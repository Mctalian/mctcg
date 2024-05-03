import { Card } from "./card.interface";
import { Deck } from "./deck.interface";
import { PlayingCard } from "./playing-card.interface";
import { powerShuffle, shuffle } from "./shuffle";

export interface DeckStats {
  mulliganPercentage: number;
  maxMulligansInAGame: number;
  totalMulligans: number;
  averageMulligans: number;
  handFrequency: Map<string, number>;
  prizeFrequency: Map<string, number>;
}

export class Simulator implements DeckStats {
  private readonly cards: PlayingCard[];
  public mulliganPercentage: number = 0;
  public maxMulligansInAGame: number = 0;
  public totalMulligans: number = 0;
  public averageMulligans: number = 0;
  public handFrequency = new Map<string, number>();
  public prizeFrequency = new Map<string, number>();

  constructor(
    deck: Deck,
    private readonly numberOfPrizes: number = 6,
    private readonly handSize: number = 7,
  ) {
    const d = deck.deck;
    this.cards = [
      ...this.enumerateSection(d.Pokemon, "Pokemon"),
      ...this.enumerateSection(d.Trainer, "Trainer"),
      ...this.enumerateSection(d.Energy, "Energy")
    ];
  }

  private enumerateSection(section: Card[], type: "Pokemon" | "Trainer" | "Energy") {
    const pcs: PlayingCard[] = []
    for (const c of section) {
      for (let q = 0; q < c.quantity; ++q) {
        pcs.push({
          name: c.name,
          setAbbrev: c.setAbbr,
          setNumber: c.setNumber,
          type,
          subtypes: c.subtypes,
          isBasicPokemon: type === "Pokemon" && c.subtypes.includes("Basic")
        })
      }
    }
    return pcs;
  }

  public run(numberOfRuns: number = 10000, skipPowerShuffle = false) {
    console.log(numberOfRuns);
    let mulligans = 0;
    let gamesWithMulligan = 0;
    const freqInHand = new Map<string, number>();
    const freqInPrizes = new Map<string, number>();
    for (let n = 0; n < numberOfRuns; ++n) {
      let deck = [...this.cards]
      if (!skipPowerShuffle){
        deck = powerShuffle(deck);
      }
      deck = shuffle(deck);
      const { openingHand, prizes, mulligans: mulligansInGame } = this.startGame(deck, n);
      this.maxMulligansInAGame = Math.max(this.maxMulligansInAGame, mulligansInGame);
      mulligans += mulligansInGame;
      if (mulligansInGame > 0) {
        gamesWithMulligan += 1;
      }
      const s = new Set<string>();
      for (const c of openingHand) {
        const key = `${c.name}-${c.setAbbrev}-${c.setNumber}`;
        s.add(key);
      }
      for (const k of s) {
        freqInHand.set(k, (freqInHand.get(k) || 0) + 1);
      }
      for (const c of prizes) {
        const key = `${c.name}-${c.setAbbrev}-${c.setNumber}`;
        freqInPrizes.set(key, (freqInPrizes.get(key) || 0) + 1);
      }
    }
    freqInHand.forEach((f, c) => {
      this.handFrequency.set(c, f / numberOfRuns);
    })
    this.handFrequency = new Map([...this.handFrequency.entries()].sort((a, b) => b[1] - a[1]))
    freqInPrizes.forEach((f, c) => {
      this.prizeFrequency.set(c, f / numberOfRuns);
    })
    this.prizeFrequency = new Map([...this.prizeFrequency.entries()].sort((a, b) => b[1] - a[1]));
    this.mulliganPercentage = gamesWithMulligan / numberOfRuns;
    this.averageMulligans = mulligans / numberOfRuns;
    this.totalMulligans = mulligans;
  }

  private startGame(deck: PlayingCard[], n: number) {
    let mulligan = true;
    let mulligans = 0;
    let openingHand;
    let prizes;
    while (mulligan) {
      openingHand = deck.slice(0,this.handSize);
      prizes = deck.slice(this.handSize, this.numberOfPrizes + this.handSize);
      if (openingHand.every(c => !c.isBasicPokemon)) {
        mulligans += 1;
        deck = shuffle(deck);
      } else {
        mulligan = false;
      }
    }
    return {
      openingHand,
      prizes,
      mulligans,
    }
  }

}