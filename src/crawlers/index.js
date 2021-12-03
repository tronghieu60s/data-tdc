const crawlerUrl = "http://online.tdc.edu.vn/";
const btnLogin = "#lbtDangnhap";
const radParents = "#ContentPlaceHolder1_ctl00_ctl00_rbtnParents";
const txtUsername = "#ContentPlaceHolder1_ctl00_ctl00_txtUserName";
const txtPassword = "#ContentPlaceHolder1_ctl00_ctl00_txtPassword";

const main = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(crawlerUrl);

  /* move to login */
  await page.waitForSelector(btnLogin);
  await page.click(btnLogin);
  await page.waitForSelector(radParents);
  await page.click(radParents);
  await page.waitForSelector(txtUsername);

  /* login input */
  await page.type(txtUsername, "standard_user");
  await page.waitForSelector(txtPassword);
  await page.type(txtPassword, "standard_user");
};

module.exports = main;
