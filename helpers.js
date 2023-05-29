/// <reference path="_typedefs.js" />

/**
 * Helper to fetch JSON response from a URL
 * @param {string} url
 * @returns {Promise<JSON>}
 */
export function getJson(url) {
  return fetch(url).then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`getJson response status ${resp.status} for url ${url}`);
  });
}

/**
 * Takes a {@link ChainLink} from a PokeAPI evolution chain response and transforms it to the required task format
 * @param {ChainLink} chain
 * @returns {TransformedEvoChain}
 */
export function transformEvoChain(chain) {
  return {
    name: chain.species.name,
    variations: chain.evolves_to.map((subtree) => transformEvoChain(subtree)),
  };
}

/**
 * Get the names of each pokemon appearing in `evoChain`
 * @param {TransformedEvoChain} evoChain
 * @returns {Array<string>} An array of Pokemon names
 */
export function getSpeciesInChain(evoChain) {
  let list = [];

  list.push(evoChain.name);
  for (let i = 0; i < evoChain.variations.length; i++) {
    list = list.concat(getSpeciesInChain(evoChain.variations[i]));
  }

  return list;
}
