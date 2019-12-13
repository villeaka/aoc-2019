const R = require("ramda");
const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const steps = R.pipe(
  R.split("\n"),
  R.map(R.split(",")),
)(input);

const getStartPoint = R.head;
const getEndPoint = R.last;
const getX = R.head;
const getY = R.last;

const isVerticalVector = (vector) => R.equals(getX(getStartPoint(vector)), getX(getEndPoint(vector)));

const calculateVectors = R.reduce(
  (acc, v) => {
    const [direction, count] = [R.head(v), +R.tail(v)];
    const origin = acc.length ? getEndPoint(R.last(acc)) : [0, 0];
    const op = R.includes(direction, ["U", "R"]) ? R.add : R.subtract;

    switch (direction) {
      case "U":
      case "D":
        return R.append([origin, [getX(origin), op(getY(origin), count)]], acc);
      case "R":
      case "L":
        return R.append([origin, [op(getX(origin), count), getY(origin)]], acc);
    }
  },
  [],
);

const calculatePathLengthAtPoint = (point) => R.reduce((acc, v) => {
    const x = getX(point);
    const y = getY(point);
    const startX = getX(getStartPoint(v));
    const startY = getY(getStartPoint(v));
    const endX = getX(getEndPoint(v));
    const endY = getY(getEndPoint(v));

    const isPointReachedVertically = isVerticalVector(v) && x === startX && y > Math.min(startY, endY) && y < Math.max(startY, endY);
    const isPointReachedHorizontally = !isVerticalVector(v) && y === startY && x > Math.min(startX, endX) && x < Math.max(startX, endX);

    if (isPointReachedVertically) {
      return R.reduced(acc + Math.abs(y - startY));
    }

    if (isPointReachedHorizontally) {
      return R.reduced(acc + Math.abs(x - startX));
    }

    return acc + Math.abs(startX - endX) + Math.abs(startY - endY);
  },
  0,
);

const getCrossPoints = (path1, path2) => path1.reduce((acc1, v1) => {
  const p1StartX = getX(getStartPoint(v1));
  const p1StartY = getY(getStartPoint(v1));
  const p1EndX = getX(getEndPoint(v1));
  const p1EndY = getY(getEndPoint(v1));

  const points = path2.reduce((acc2, v2) => {
    const p2StartX = getX(getStartPoint(v2));
    const p2StartY = getY(getStartPoint(v2));
    const p2EndX = getX(getEndPoint(v2));
    const p2EndY = getY(getEndPoint(v2));

    const isP1PerpendicularToP2 = p1StartX > Math.min(p2StartX, p2EndX)
      && p1StartX < Math.max(p2StartX, p2EndX)
      && p2StartY > Math.min(p1StartY, p1EndY)
      && p2StartY < Math.max(p1StartY, p1EndY);

    const isP2PerpendicularToP1 = p2StartX > Math.min(p1StartX, p1EndX)
      && p2StartX < Math.max(p1StartX, p1EndX)
      && p1StartY > Math.min(p2StartY, p2EndY)
      && p1StartY < Math.max(p2StartY, p2EndY);

    if (isP1PerpendicularToP2) {
      return R.append([p1StartX, p2StartY], acc2);
    }

    if (isP2PerpendicularToP1) {
      return R.append([p2StartX, p1StartY], acc2);
    }

    return acc2;
  }, []);

  return R.concat(points, acc1);
}, []);

const path1 = calculateVectors(R.head(steps));
const path2 = calculateVectors(R.last(steps));
const crossPoints = getCrossPoints(path1, path2);

const shortestDistance = crossPoints.reduce((acc, v) => {
  const distance = R.pipe(R.map(Math.abs), R.sum)(v);

  return Math.min(acc, distance) || distance;
}, 0);

console.log(`Part #1: ${shortestDistance}`);

const shortestTotalPathLength = crossPoints.reduce((res, point) => {
  const totalPathLength = calculatePathLengthAtPoint(point)(path1) + calculatePathLengthAtPoint(point)(path2);

  return Math.min(res, totalPathLength) || totalPathLength;
}, 0);

console.log(`Part #2: ${shortestTotalPathLength}`);
