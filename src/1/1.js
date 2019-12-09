const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").split("\n");

console.log(input.reduce((fuel, mass) => fuel += Math.floor(mass / 3) - 2, 0)); // 3239890
