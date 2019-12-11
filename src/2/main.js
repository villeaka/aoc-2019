const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const ops = R.pipe(R.split(","), R.map(Number))(input);

const calculateOpCode = (noun, verb) => R.pipe(
  R.adjust(1, () => noun),
  R.adjust(2, () => verb),
  R.addIndex(R.reduce)(
    (acc, v, i, og) => {
      const seq = i ? acc : og;

      if (i % 4) {
        return seq;
      }

      if (v === 99) {
        return R.reduced(seq);
      }

      const op = R.equals(1, v) ? R.add : R.multiply;
      const nthNth = (index, list) => R.nth(R.nth(index, list), list);

      return R.adjust(
        R.nth(i + 3, seq),
        () => op(nthNth(i + 1, seq), nthNth(i + 2, seq)),
        seq,
      );
    },
    [],
  ),
  R.head(),
)(ops);

const calculateNounAndVerbForOpCode = (opCode) => {
  const initList = (length) => R.range(1, length + 1);
  const reduceWhileNil = (reducer) => R.reduceWhile(
    R.isNil,
    reducer,
    null,
  );

  return reduceWhileNil((acc, verb) => {
    const noun = reduceWhileNil((acc2, v) => calculateOpCode(v, verb) === opCode ? v : null)(initList(100));

    return noun ? (100 * noun) + verb : null;
  })(initList(100));
}

console.log(`Part 1: ${calculateOpCode(12, 2)}`);
console.log(`Part 2: ${calculateNounAndVerbForOpCode(19690720)}`);
