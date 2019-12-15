const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const orbits = R.pipe(R.split("\n"), R.map(R.split(")")))(input);

const uniqueFlatMap = (v, k) => R.reject(R.equals(k), R.flatten(v));

const findObjKeyForValue = (value) => R.pipe(
  R.pickBy(R.includes(value)),
  R.keys,
  R.head,
);

const countOrbitsForObject = (orbitMap) => R.reduce(
  (acc, v) => {
    const hasIndirectOrbits = R.has(v, orbitMap);

    return hasIndirectOrbits
      ? R.inc(acc) + countOrbitsForObject(orbitMap)(R.prop(v, orbitMap))
      : R.inc(acc);
  },
  0,
);

const calculatePathFromObject = R.curry((object, orbitMap) => {
  const key = findObjKeyForValue(object)(orbitMap);

  if (!key) {
    return "";
  }

  return R.flatten([key, calculatePathFromObject(key, orbitMap)]);
});

const orbitingObjectsToOrbitMap = R.pipe(
  R.groupBy(R.head),
  R.mapObjIndexed(uniqueFlatMap),
)(orbits);

const calculatePathLengthBetweenObjects = (object1, object2) => R.pipe(
  R.converge(R.symmetricDifference, [calculatePathFromObject(object1), calculatePathFromObject(object2)]),
  R.length,
)(orbitingObjectsToOrbitMap);

const totalNumberOfOrbits = R.pipe(
  R.mapObjIndexed((v, k, o) => countOrbitsForObject(o)(v)),
  R.values,
  R.sum,
)(orbitingObjectsToOrbitMap);

const distanceToSanta = calculatePathLengthBetweenObjects("YOU", "SAN");

console.log(`Part #1: ${totalNumberOfOrbits}`);
console.log(`Part #2: ${distanceToSanta}`);
