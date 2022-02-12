const {
  _interopRequireWildcard,
  writeDataToCsv,
} = require("../helpers/commonFunctions");

const Elements = _interopRequireWildcard(
  require("../helpers/crawlersElements")
);

const codeCourse = "19";
const rearInfoAccount = "&NH=2020-2021&HK=HK02";
const csvFilePath = `./data/K${codeCourse}-Result.csv`;
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

let studentData = "";

const main = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await crawlerLogin(page, "19211TT1201");

  for (let i = 1; i < 6000; i += 1) {
    for (let j = 0; j < codeFaculty.length; j += 1) {
      // generate student code
      const codeStudent = `${codeCourse}211${codeFaculty[j]}${rearStudentId}`;
      let infoAccount = await crawlerInfoAccount(page, codeStudent);
      writeDataToCsv(studentData, csvFilePath);
    }
  }

  console.log("Finish.");
};

const crawlerLogin = async (page, codeStudent) => {
  /* logout if user logged */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);

  /* login to parents mode */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);
  await page.waitForSelector(Elements.radParents);
  await page.click(Elements.radParents);

  /* login input with student code */
  await page.waitForSelector(Elements.txtUsername);
  await page.evaluate(
    (txt) => (document.querySelector(txt).value = ""),
    [Elements.txtUsername]
  );
  await page.type(Elements.txtUsername, codeStudent);
  await page.waitForSelector(Elements.txtPassword);
  await page.evaluate(
    (txt) => (document.querySelector(txt).value = ""),
    [Elements.txtPassword]
  );
  await page.type(Elements.txtPassword, "0000");
  await page.waitForSelector(Elements.btnLoginSubmit);
  await page.click(Elements.btnLoginSubmit);
};

const crawlerInfoAccount = async (page, codeStudent) => {
  await page.goto(
    `${Elements.crawlerUrlExamination}?Studentid=${codeStudent}${rearInfoAccount}`
  );

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
