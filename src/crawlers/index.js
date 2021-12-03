const fs = require("fs");
const {
  _interopRequireWildcard,
  writeDataToCsv,
} = require("../helpers/commonFunctions");

const Elements = _interopRequireWildcard(
  require("../helpers/crawlersElements")
);
const Fields = _interopRequireWildcard(require("../helpers/crawlersFunctions"));
const codeCourse = "19";
const csvFilePath = `./K${codeCourse}-TDC.csv`;
const codeFaculty = [
  "CD",
  "CK",
  "CT",
  "DC",
  "DD",
  "DH",
  "DK",
  "DT",
  "KD",
  "KS",
  "KT",
  "LG",
  "LH",
  "NH",
  "OT",
  "QT",
  "TA",
  "TC",
  "TH",
  "TM",
  "TN",
  "TT",
];

const main = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(Elements.crawlerUrl);

  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.dismiss();
  });

  if (fs.existsSync(csvFilePath)) {
    fs.unlinkSync(csvFilePath);
  }

  for (let i = 1; i < 6000; i += 1) {
    for (let j = 0; j < codeFaculty.length; j += 1) {
      let studentData = {};

      const codeStudent = `${codeCourse}211${codeFaculty[j]}${i}`;
      await crawlerLogin(page, codeStudent);
      let infoData = await crawlerInfoData(page);

      const params = {
        Studentid: codeStudent,
        NH: infoData.ddlNamHoc,
        HK: infoData.ddlHocKy,
      };
      const queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      let infoAccount = await crawlerInfoAccount(page, queryString);

      studentData[Fields.FieldName1] = codeStudent;
      studentData[Fields.FieldName2] = infoAccount.studentName;
      studentData[Fields.FieldName3] = infoAccount.studentClass;
      studentData[Fields.FieldName4] = infoAccount.studentPhone;
      studentData[Fields.FieldName5] = infoData.scoreOne;
      studentData[Fields.FieldName6] = infoData.scoreTwo;
      studentData[Fields.FieldName7] = infoData.scoreThree;
      studentData[Fields.FieldName8] = infoData.scoreFour;

      writeDataToCsv(infoAccount, csvFilePath);
    }
  }

  // let accStatus = "";
  // if (alertLogin.indexOf(studentStatus2) > -1) {
  //   accStatus = capitalizeFirstLetter(studentStatus2);
  // } else if (alertLogin.indexOf(studentStatus3) > -1) {
  //   accStatus = capitalizeFirstLetter(studentStatus3);
  // }

  // let infoAccount = {};
  // infoAccount[Fields.FieldName1] = "19211TT1201";
  // if (alertLogin.length === 0) {
  //   accStatus = capitalizeFirstLetter(studentStatus4);
  // } else {
  //   infoAccount = await crawlerInfoData(page);
  //   infoAccount = await crawlerInfoAccount(page, infoAccount);
  // }
  // infoAccount = { ...infoAccount, [Fields.FieldName9]: accStatus };
  // writeDataToCsv(infoAccount, csvFilePath);
};

const crawlerLogin = async (page, codeStudent) => {
  /* move to login */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);
  await page.waitForSelector(Elements.radParents);
  await page.click(Elements.radParents);

  /* login input */
  await page.waitForSelector(Elements.txtUsername);
  await page.type(Elements.txtUsername, codeStudent);
  await page.waitForSelector(Elements.txtPassword);
  await page.type(Elements.txtPassword, "0000");
  await page.waitForSelector(Elements.btnLoginSubmit);
  await page.click(Elements.btnLoginSubmit);
};

const crawlerInfoData = async (page) => {
  /* screenshot account tuition */
  await page.waitForSelector(Elements.lnkAccount);
  await page.click(Elements.lnkAccount);

  const ddlHocKy = await (
    await page.waitForSelector(Elements.ddlHocKy)
  ).evaluate((el) => el.textContent);

  const ddlNamHoc = await (
    await page.waitForSelector(Elements.ddlNamHoc)
  ).evaluate((el) => el.textContent);

  // await screenshotElement(page, Elements.tableZero, "19211TT1201-tuition");

  /* screenshot score */
  await page.waitForSelector(Elements.lnkDiem);
  await page.click(Elements.lnkDiem);

  /* Student Score */
  const allScore = await (
    await page.waitForSelector(Elements.allScore)
  ).evaluate((el) => el.textContent);
  const allScoreArr = allScore.split(":");
  const scoreOne = parseFloat(allScoreArr[1].trim());
  const scoreTwo = parseFloat(allScoreArr[2].trim());
  const scoreThree = parseFloat(allScoreArr[3].trim());
  const scoreFour = allScoreArr[4].trim();

  // /* screenshot score all */
  // await page.waitForSelector(Elements.rdbTatca);
  // await page.click(Elements.rdbTatca);
  // await screenshotElement(page, Elements.tableOne, "19211TT1201-score-all");

  // /* screenshot score aml */
  // await page.waitForSelector(Elements.rdbTichluy);
  // await page.click(Elements.rdbTichluy);
  // await screenshotElement(page, Elements.tableOne, "19211TT1201-score-aml");

  // /* screenshot score dtl */
  // await page.waitForSelector(Elements.rdbChitiet);
  // await page.click(Elements.rdbChitiet);
  // await screenshotElement(page, Elements.tableOne, "19211TT1201-score-dtl");

  return { ddlHocKy, ddlNamHoc, scoreOne, scoreTwo, scoreThree, scoreFour };
};

const crawlerInfoAccount = async (page, queryString) => {
  await page.goto(`${Elements.crawlerUrlExamination}${queryString}`);

  /* Student Name */
  let studentName = await (
    await page.waitForSelector(Elements.lbInfo)
  ).evaluate((el) => el.textContent);
  studentName = studentName.split("[")?.[0]?.trim();

  /* Student Class */
  let studentClass = await (
    await page.waitForSelector(Elements.lblLop)
  ).evaluate((el) => el.textContent);
  studentClass = studentClass.trim();

  /* Student Phone */
  let studentPhone = await (
    await page.waitForSelector(Elements.lblPhone)
  ).evaluate((el) => el.textContent);
  studentPhone = studentPhone.trim();

  return { studentName, studentClass, studentPhone };
};

module.exports = main;
