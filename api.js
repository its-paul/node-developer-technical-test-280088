/// <reference path="_typedefs.js" />

import { getJson, getSpeciesInChain, transformEvoChain } from "./helpers.js";

/** @type Object.<string, string> */
const chainCache = {};

/**
 * Gets a formatted evolution chain by Pokemon name
 * @param {string} pokemonName
 * @returns {Promise<string>} A JSON string representing the evolution chain
 */
export async function getEvolutionChain(pokemonName) {
  const pkmn = pokemonName.toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(chainCache, pkmn)) {
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/${pkmn}/`;

    try {
      /** @type {{ species: { url: string }}} */
      const pokemonResult = await getJson(baseUrl);
      /** @type {{ evolution_chain: { url: string }}} */
      const speciesResult = await getJson(pokemonResult.species.url);

      if (speciesResult.evolution_chain.url) {
        /** @type {{ chain: ChainLink }} */
        const chainResult = await getJson(speciesResult.evolution_chain.url);
        const transformedChain = transformEvoChain(chainResult.chain);

        /** Cache result to avoid unnecessary API calls */
        populateCache(transformedChain);
      }
    } catch (err) {
      console.error(
        `Couldn't get evolution chain for pokemon ${pkmn}:`,
        err.message
      );
      return {};
    }
  }

  return chainCache[pkmn];
}

/**
 * Populates the known evolution chain cache for pokemon variations in `chain`
 * @param {TransformedEvoChain} chain
 */
function populateCache(chain) {
  const speciesList = getSpeciesInChain(chain);
  const result = JSON.stringify(chain);

  for (let i = 0; i < speciesList.length; i++) {
    chainCache[speciesList[i]] = result;
  }
}
