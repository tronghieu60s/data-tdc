const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

/* Import Modules */

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
exports._interopRequireWildcard = _interopRequireWildcard;

/* Others Functions */

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
exports.isObjectEmpty = isObjectEmpty;

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomIntFromInterval = randomIntFromInterval;

function writeDataToJson(data, filePath = "./data.json") {
  let fileData = [];
  try {
    fileData = JSON.parse(fs.readFileSync(filePath));
  } catch (err) {}

  if (Array.isArray(data)) {
    fileData.push(...data);
  } else if (typeof data === "object") {
    fileData.push(data);
  }

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}
exports.writeDataToJson = writeDataToJson;

function writeDataToCsv(data, filePath = "./data.csv") {
  let csv = new ObjectsToCsv([]);
  if (Array.isArray(data)) {
    csv = new ObjectsToCsv([...data]);
  } else if (typeof data === "object") {
    csv = new ObjectsToCsv([data]);
  }
  return csv.toDisk(filePath, { append: true });
}
exports.writeDataToCsv = writeDataToCsv;
