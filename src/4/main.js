const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const range = R.pipe(
  R.split("-"),
  R.map(Number),
  R.apply(R.range),
  R.map(R.toString),
)(input);

const isAscending = R.pipe(
  R.split(""),
  (v) => R.equals(v, R.sort((a, b) => a > b, v)),
);

const hasRepeatValues = R.compose(
  R.any(R.pipe(R.length, R.gt(R.__, 1))),
  R.groupWith(R.equals),
);

const hasExactlyTwoRepeatValues = R.compose(
  R.any(R.pipe(R.length, R.equals(R.__, 2))),
  R.groupWith(R.equals),
);

const count = R.length(R.filter(R.allPass([isAscending, hasRepeatValues]), range));
const count2 = R.length(R.filter(R.allPass([isAscending, hasExactlyTwoRepeatValues]), range));

console.log(`Part #1: ${count}`);
console.log(`Part #2: ${count2}`);
