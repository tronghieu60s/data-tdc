const fs = require("fs");
const {
  _interopRequireWildcard,
  writeDataToCsv,
  capitalizeFirstLetter,
} = require("../helpers/commonFunctions");

const Elements = _interopRequireWildcard(
  require("../helpers/crawlersElements")
);
const Fields = _interopRequireWildcard(require("../helpers/crawlersFunctions"));

const codeCourse = "19";
const rearInfoAccount = "&NH=2020-2021&HK=HK02";
const csvFilePath = `./data/K${codeCourse}-TDC.csv`;
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

let isDialog = false;
let isHaveData = false;
let studentData = "";
let accountStatus = "";
let maxNoAccess = codeFaculty.length * 10;
let countNotAccess = 0;

const main = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  console.log("Start.");

  page.on("dialog", async (dialog) => {
    isDialog = true;
    const dialogMessage = dialog.message().replace(/\n/g, "");
    // console.log(dialogMessage);

    crawlerStatusAccount(dialogMessage);
    await dialog.dismiss();
  });

  for (let i = 1; i < 6000; i += 1) {

    if(countNotAccess > maxNoAccess) {
      break;
    }

    studentData = {};
    await page.goto(Elements.crawlerUrl);

    const rearStudentId = ("0000" + i).slice(-4);
    console.log(rearStudentId);

    await crawlerLogin(page);

    for (let j = 0; j < codeFaculty.length; j += 1) {
      isDialog = false;

      if (isHaveData) {
        await page.goto(Elements.crawlerUrl);
        await crawlerLogin(page);
      }
      isHaveData = false;

      // generate student code
      const codeStudent = `${codeCourse}211${codeFaculty[j]}${rearStudentId}`;

      await crawlerLoginInput(page, codeStudent);
      // wait for dialog set value
      await page.waitForTimeout(1000);

      // if dialog check status user
      if (isDialog) {
        if (accountStatus === Fields.studentStatus1) {
          countNotAccess += 1;
        } else {
          isHaveData = true;
          countNotAccess = 0;
          console.log(codeStudent);
          await crawlerLoginInput(page, "19211QT0001");
          let infoAccount = await crawlerInfoAccount(page, codeStudent);
          crawlerDataGenerate(
            codeStudent,
            null,
            infoAccount,
            capitalizeFirstLetter(accountStatus)
          );
          writeDataToCsv(studentData, csvFilePath);
        }
        continue;
      }

      isHaveData = true;
      countNotAccess = 0;
      console.log(codeStudent);

      // get info student
      let infoData = await crawlerInfoData(page);
      let infoAccount = await crawlerInfoAccount(page, codeStudent);
      crawlerDataGenerate(codeStudent, infoData, infoAccount);

      // write data to csv
      writeDataToCsv(studentData, csvFilePath);
    }
  }

  console.log("Finish.");
};

const crawlerLogin = async (page) => {
  /* logout if user logged */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);

  /* login to parents mode */
  await page.waitForSelector(Elements.btnLogin);
  await page.click(Elements.btnLogin);
  await page.waitForSelector(Elements.radParents);
  await page.click(Elements.radParents);
};

const crawlerLoginInput = async (page, codeStudent) => {
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

const crawlerInfoData = async (page) => {
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

  return { scoreOne, scoreTwo, scoreThree, scoreFour };
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

const crawlerStatusAccount = async (message) => {
  if (message.indexOf(Fields.studentStatus1) > -1) {
    accountStatus = Fields.studentStatus1;
  } else if (message.indexOf(Fields.studentStatus2) > -1) {
    accountStatus = Fields.studentStatus2;
  } else if (message.indexOf(Fields.studentStatus3) > -1) {
    accountStatus = Fields.studentStatus3;
  }
};

const crawlerDataGenerate = (
  codeStudent,
  infoData,
  infoAccount,
  infoStatus = Fields.studentStatus4
) => {
  studentData[Fields.FieldName1] = codeStudent;
  studentData[Fields.FieldName2] = infoAccount?.studentName;
  studentData[Fields.FieldName3] = infoAccount?.studentClass;
  studentData[Fields.FieldName4] = infoAccount?.studentPhone;
  studentData[Fields.FieldName5] = infoData?.scoreOne;
  studentData[Fields.FieldName6] = infoData?.scoreTwo;
  studentData[Fields.FieldName7] = infoData?.scoreThree;
  studentData[Fields.FieldName8] = capitalizeFirstLetter(infoData?.scoreFour || '');
  studentData[Fields.FieldName9] = infoStatus;
};

module.exports = main;
