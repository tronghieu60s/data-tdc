const {
  _interopRequireWildcard,
  writeDataToCsv,
} = require("../helpers/commonFunctions");
const { screenshotElement } = require("../helpers/crawlersFunctions");

const Elements = _interopRequireWildcard(
  require("../helpers/crawlersElements")
);

const main = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(Elements.crawlerUrl);

  await crawlerLogin(page);

  const eXamData = await crawlerScreenshot(page);

  const studentData = await crawlerInfoAccount(page, eXamData);

  writeDataToCsv(studentData, "crawler-data.csv");
};

const crawlerLogin = async (page) => {
  /* move to login */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);
  await page.waitForSelector(Elements.radParents);
  await page.click(Elements.radParents);

  /* login input */
  await page.waitForSelector(Elements.txtUsername);
  await page.type(Elements.txtUsername, "19211TT1201");
  await page.waitForSelector(Elements.txtPassword);
  await page.type(Elements.txtPassword, "0000");
  await page.waitForSelector(Elements.btnLoginSubmit);
  await page.click(Elements.btnLoginSubmit);
};

const crawlerScreenshot = async (page) => {
  /* screenshot account tuition */
  await page.waitForSelector(Elements.lnkAccount);
  await page.click(Elements.lnkAccount);

  const ddlHocKy = await (
    await page.waitForSelector(Elements.ddlHocKy)
  ).evaluate((el) => el.textContent);

  const ddlNamHoc = await (
    await page.waitForSelector(Elements.ddlNamHoc)
  ).evaluate((el) => el.textContent);

  await screenshotElement(page, Elements.tableZero, "19211TT1201-tuition");

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

  /* screenshot score all */
  await page.waitForSelector(Elements.rdbTatca);
  await page.click(Elements.rdbTatca);
  await screenshotElement(page, Elements.tableOne, "19211TT1201-score-all");

  /* screenshot score aml */
  await page.waitForSelector(Elements.rdbTichluy);
  await page.click(Elements.rdbTichluy);
  await screenshotElement(page, Elements.tableOne, "19211TT1201-score-aml");

  /* screenshot score dtl */
  await page.waitForSelector(Elements.rdbChitiet);
  await page.click(Elements.rdbChitiet);
  await screenshotElement(page, Elements.tableOne, "19211TT1201-score-dtl");

  return { ddlHocKy, ddlNamHoc, scoreOne, scoreTwo, scoreThree, scoreFour };
};

const crawlerInfoAccount = async (page, data) => {
  const studentData = {};

  const queryString = `?Studentid=19211TT1201&NH=${data.ddlNamHoc}&HK=${data.ddlHocKy}`;
  await page.goto(`${Elements.crawlerUrlExamination}${queryString}`);

  /* Student Name */
  const studentName = await (
    await page.waitForSelector(Elements.lbInfo)
  ).evaluate((el) => el.textContent);

  /* Student Class */
  const studentClass = await (
    await page.waitForSelector(Elements.lblLop)
  ).evaluate((el) => el.textContent);

  /* Student Phone */
  const studentPhone = await (
    await page.waitForSelector(Elements.lblPhone)
  ).evaluate((el) => el.textContent);

  /* Pass Data */
  studentData["Mã Số"] = "19211TT1201";
  studentData["Họ Và Tên"] = studentName.split("[")?.[0]?.trim();
  studentData["Lớp"] = studentClass.trim();
  studentData["Số Điện Thoại"] = studentPhone.trim();
  studentData["Tín Chỉ"] = data.scoreOne;
  studentData["Trung Bình Chung"] = data.scoreTwo;
  studentData["Trung Bình Tích Lũy"] = data.scoreThree;
  studentData["Xếp Loại"] = data.scoreFour;

  return studentData;
};

module.exports = main;
