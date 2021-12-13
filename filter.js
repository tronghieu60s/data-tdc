const fs = require("fs");
const csv = require("csv-parser");
const { writeDataToCsv } = require("./src/helpers/commonFunctions");

const results = [];
const resultsCsv = [];
const csvFilePath = "./data/K19-Result.csv";
const csvFilePathFilter = "./data/K19-Filter.csv";

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    // const resultsLookup = results.reduce((a, e) => {
    //   a[e.MSSV.substring(7, 12)] = ++a[e.MSSV.substring(7, 12)] || 0;
    //   return a;
    // }, {});

    // results
    //   .filter((e) => resultsLookup[e.MSSV.substring(7, 12)])
    //   .map((e) => console.log(e.MSSV));

    let currentIndex = 1;
    let currentIndexError = 0;
    for (let index = 0; index < results.length; index += 1) {
      const { MSSV } = results[index - currentIndexError];
      const codeStudent = MSSV.substring(7, 12);
      const codeStudentIndex = ("0000" + currentIndex).slice(-4);
      if (codeStudent !== codeStudentIndex) {
        currentIndexError += 1;
        console.log(currentIndex);
        resultsCsv.push({ MSSV: currentIndex });
      }
      currentIndex += 1;
    }

    writeDataToCsv(resultsCsv, csvFilePathFilter);
  });
