const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").split(",").map(Number);

function calculateOpCode(noun, verb) {
  const ops = input.slice();
  ops[1] = noun;
  ops[2] = verb;

  return ops.reduce((res, curr, i, og) => {
    if (!i) {
      res = og;
    }
  
    if (i % 4 || (i + 3) >= og.length) {
      return res;
    }
  
    switch (curr) {
      case 1:
      case 2:
        res[res[i + 3]] = curr === 1
          ? res[res[i + 1]] + res[res[i + 2]]
          : res[res[i + 1]] * res[res[i + 2]];
        return res;
      case 99:
        return res[0];
      default:
        throw new Error("Unknown opcode!");
    }
  }, []);
}

function solvePart1() {
  return calculateOpCode(12, 2);
}

function solvePart2() {
  let noun = 1;
  let verb = 1;
  let res = 0;

  while (verb < 100) {
    while (noun < 100) {
      res = calculateOpCode(noun, verb);

      if (res === 19690720) {
        return (100 * noun) + verb;
      }

      noun++;
    }

    verb++;
    noun = 1;
  }

  return 0;
}

console.log(`Part 1: ${solvePart1()}`); // 4023471
console.log(`Part 2: ${solvePart2()}`); // 8051
