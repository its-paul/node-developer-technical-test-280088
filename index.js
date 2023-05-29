import { getEvolutionChain } from "./api.js";

if (process.argv.length === 3) {
  console.log(await getEvolutionChain(process.argv[2]));
} else {
  console.log(`Usage: npm start -- <pokemonName>`);
}
