const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").split("\n").map((path) => path.split(","));

function calculateVectors(steps) {
  return steps.reduce((res, curr, i) => {
    const [direction, steps] = [curr[0], +curr.slice(1)];
    const origin = i ? res[i - 1][1] : [0, 0];

    switch (direction) {
      case "U":
        res.push([origin, [origin[0], origin[1] + steps]]);
        break;
      case "D":
        res.push([origin, [origin[0], origin[1] - steps]]);
        break;
      case "R":
        res.push([origin, [origin[0] + steps, origin[1]]]);
        break;
      case "L":
        res.push([origin, [origin[0] - steps, origin[1]]]);
        break;
      default:
        throw new Error(`Invalid direction "${direction}"!`);
    }

    return res;
  }, [])
}

function isVerticalVector(vector) {
  return vector[0][0] === vector[1][0];
}

function calculatePathLengthAtPoint(path, point) {
  let crossed = false;

  return path.reduce((res, vector) => {
    if (crossed) {
      return res;
    }

    const vertical = isVerticalVector(vector);

    if (vertical && point[0] === vector[0][0] && point[1] > Math.min(vector[0][1], vector[1][1]) && point[1] < Math.max(vector[0][1], vector[1][1])) {
      res += Math.abs(point[1] - vector[0][1]);
      crossed = true;
    } else if (point[1] === vector[0][1] && point[0] > Math.min(vector[0][0], vector[1][0]) && point[0] < Math.max(vector[0][0], vector[1][0])) {
      res += Math.abs(point[0] - vector[0][0]);
      crossed = true;
    } else {
      res += Math.abs(vector[0][0] - vector[1][0]) + Math.abs(vector[0][1] - vector[1][1]);
    }

    return res;
  }, 0);
}

const path1 = calculateVectors(input[0]);
const path2 = calculateVectors(input[1]);

const crossPoints = path2.reduce((res, curr) => {
  const vertical = isVerticalVector(curr);

  const points = path1.reduce((r, c) => {
    if (vertical) {
      if (!isVerticalVector(c)) {
        const verticalX = curr[0][0];
        const verticalY = c[0][1];

        if (verticalX > Math.min(c[0][0], c[1][0]) && verticalX < Math.max(c[0][0], c[1][0])
          && verticalY > Math.min(curr[0][1], curr[1][1]) && verticalY < Math.max(curr[0][1], curr[1][1])) {
          r.push([verticalX, verticalY]);
        }
      }
    } else {
      if (isVerticalVector(c)) {
        const horizontalX = c[0][0];
        const horizontalY = curr[0][1];

        if (horizontalX > Math.min(curr[0][0], curr[1][0]) && horizontalX < Math.max(curr[0][0], curr[1][0])
          && horizontalY > Math.min(c[0][1], c[1][1]) && horizontalY < Math.max(c[0][1], c[1][1])) {
          r.push([horizontalX, horizontalY]);
        }
      }
    }

    return r;
  }, []);

  if (points.length) {
    res.push(...points);
  }

  return res;
}, []);

const shortestDistance = crossPoints.reduce((res, curr) => {
  const distance = curr.map(Math.abs).reduce((r, c) => (r += c), 0);

  return res ? Math.min(res, distance) : distance;
}, 0);

console.log(shortestDistance); // 352

const shortestPathLength = crossPoints.reduce((res, point) => {
  const pathTotalLength = calculatePathLengthAtPoint(path1, point) + calculatePathLengthAtPoint(path2, point);

  return res ? Math.min(res, pathTotalLength) : pathTotalLength;
}, 0);

console.log(shortestPathLength); // 43848
