const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const masses = R.pipe(R.split("\n"), R.map(Number))(input);

const calculateRequiredFuel = (mass) => Math.floor(mass / 3) - 2;

const calculateRequiredRecursiveFuel = R.compose(
  R.sum,
  R.unfold((n) => n > 0 ? [n, calculateRequiredFuel(n)] : false),
  calculateRequiredFuel,
);

const totalRequiredFuel = R.pipe(R.map(calculateRequiredFuel), R.sum)(masses);
const totalRequiredRecursiveFuel = R.pipe(R.map(calculateRequiredRecursiveFuel), R.sum)(masses);

console.log(`Part #1: ${totalRequiredFuel}`);
console.log(`Part #2: ${totalRequiredRecursiveFuel}`);
