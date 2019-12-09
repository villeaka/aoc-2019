const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").split("\n");

const res = input.reduce((fuel, mass) => {
  let f = Math.floor(mass / 3) - 2;

  while (f > 0) {
    fuel += f;

    f = Math.floor(f / 3) - 2;
  }

  return fuel;
}, 0);

console.log(res); // 4856963
