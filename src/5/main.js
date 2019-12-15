const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const ops = R.pipe(R.split(","), R.map(Number))(input);

const nthNth = (index, list) => R.nth(R.nth(index, list), list);

/**
 * Extended version of Day 2's implementation.
 */
const calculateDiagnosticCode = (moduleId) => R.addIndex(R.reduce)(
  (acc, v, i, og) => {
    const ADD_OP = 1;
    const MULTIPLY_OP = 2;
    const INSERT_OP = 3;
    const OUTPUT_OP = 4;
    const JUMP_IF_T_OP = 5;
    const JUMP_IF_F_OP = 6;
    const LT_OP = 7;
    const EQ_OP = 8;
    const HALT_OP = 99;

    const POSITION_MODE = 0;
    const IMMEDIATE_MODE = 1;

    const seq = R.nth(0, acc) || og;
    const output = R.nth(1, acc);
    const isOpIndex = R.either(
      R.equals(0),
      R.equals(R.nth(2, acc)),
    )(i);

    if (!isOpIndex) {
      return acc;
    }

    const value = R.toString(seq[i]);
    const opCode = +value.slice(-2);
    const modes = R.pipe(R.slice(0, -2), R.split(""), R.map(Number), R.reverse)(value);

    const valueAtOffset = R.partialRight(
      (offset, index, list, modes) => {
        const mode = R.nth(offset - 1, modes) || POSITION_MODE;

        const getter = R.cond([
          [R.equals(POSITION_MODE), () => nthNth],
          [R.equals(IMMEDIATE_MODE), () => R.nth],
          [R.T, () => { throw new Error(`Unknown mode ${mode}!`); }],
        ])(mode);

        return getter(index + offset, list);
      },
      [i, seq, modes],
    );

    switch (opCode) {
      case HALT_OP:
        return R.reduced(output);
      case OUTPUT_OP:
        return [seq, valueAtOffset(1), (i + 2)];
      case INSERT_OP:
        return [
          R.adjust(
            R.nth(i + 1, seq),
            () => moduleId,
            seq,
          ),
          output,
          (i + 2),
        ];
      case JUMP_IF_T_OP:
      case JUMP_IF_F_OP:
        return (opCode === JUMP_IF_T_OP && valueAtOffset(1)) || (opCode === JUMP_IF_F_OP && !valueAtOffset(1))
          ? [seq, output, valueAtOffset(2)]
          : [seq, output, (i + 3)];
      case ADD_OP:
      case MULTIPLY_OP:
      case LT_OP:
      case EQ_OP:
        return [
          R.adjust(
            R.nth(i + 3, seq),
            () => R.cond([
              [R.equals(ADD_OP), () => R.add(valueAtOffset(1), valueAtOffset(2))],
              [R.equals(MULTIPLY_OP), () => R.multiply(valueAtOffset(1), valueAtOffset(2))],
              [R.equals(LT_OP), () => R.lt(valueAtOffset(1), valueAtOffset(2)) ? 1 : 0],
              [R.equals(EQ_OP), () => R.equals(valueAtOffset(1), valueAtOffset(2)) ? 1 : 0],
            ])(opCode),
            seq,
          ),
          output,
          (i + 4),
        ];
      default:
        throw new Error(`Unknown op code ${opCode}!`);
    }
  },
  [],
)(ops);

console.log(`Part #1: ${calculateDiagnosticCode(1)}`);
console.log(`Part #2: ${calculateDiagnosticCode(5)}`);
