import { assert, describe, expect, test } from "vitest";
import { getEvolutionChain } from "../api";
import { getSpeciesInChain } from "../helpers";

describe("getEvolutionChain", () => {
  test("output is a JSON string", async () => {
    const lapras = await getEvolutionChain("lapras");
    const laprasRaw = { name: "lapras", variations: [] };

    assert.typeOf(lapras, "string");
    assert.deepEqual(JSON.parse(lapras), laprasRaw);
  });

  test("variations contain all possible evolutions", async () => {
    const butterfree = await getEvolutionChain("butterfree");
    const species = getSpeciesInChain(JSON.parse(butterfree));

    assert.equal(species.length, 3);
  });

  test("variations are in order", async () => {
    const caterpie = await getEvolutionChain("caterpie");
    const metapod = await getEvolutionChain("metapod");
    const butterfree = await getEvolutionChain("butterfree");

    assert.equal(caterpie, metapod, butterfree);
  });

  test("invalid pokemon names return an empty object", async () => {
    const result = await getEvolutionChain("missingno");
    expect(result).toEqual({});
  });
});

describe("getSpeciesInChain", () => {
  test("identifies all species in an evolution chain", async () => {
    const data = {
      name: "gastly",
      variations: [
        { name: "haunter", variations: [{ name: "gengar", variations: [] }] },
      ],
    };

    assert.sameOrderedMembers(
      ["gastly", "haunter", "gengar"],
      getSpeciesInChain(data)
    );
  });

  test("works on chains with very wide variations", () => {
    const testVariations = new Array(9999)
      .fill("")
      .map((value, idx) => `testVariant${idx}`);

    const sample = {
      name: "wide",
      variations: testVariations.map((value) => ({
        name: value,
        variations: [],
      })),
    };

    assert.includeMembers(
      testVariations.concat(["wide"]),
      getSpeciesInChain(sample)
    );
  });
});
