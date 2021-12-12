const studentStatus1 = "Sai mật khẩu";
exports.studentStatus1 = studentStatus1;
const studentStatus2 = "Tốt nghiệp";
exports.studentStatus2 = studentStatus2;
const studentStatus3 = "Buộc thôi học";
exports.studentStatus3 = studentStatus3;
const studentStatus4 = "Hoạt động";
exports.studentStatus4 = studentStatus4;

const FieldName1 = "MSSV";
exports.FieldName1 = FieldName1;
const FieldName2 = "HoVaTen";
exports.FieldName2 = FieldName2;
const FieldName3 = "Lop";
exports.FieldName3 = FieldName3;
const FieldName4 = "SoDienThoai";
exports.FieldName4 = FieldName4;
const FieldName5 = "TinChi";
exports.FieldName5 = FieldName5;
const FieldName6 = "TrungBinhChung";
exports.FieldName6 = FieldName6;
const FieldName7 = "TrungBinhTichLuy";
exports.FieldName7 = FieldName7;
const FieldName8 = "XepLoai";
exports.FieldName8 = FieldName8;
const FieldName9 = "TinhTrang";
exports.FieldName9 = FieldName9;

async function screenshotElement(page, elementName, path) {
  await page.waitForSelector(elementName);
  const element = await (await page.$(elementName)).boundingBox();
  const { x, y, width, height } = element;
  await page.screenshot({ path: `${path}.png`, clip: { x, y, width, height } });
}
exports.screenshotElement = screenshotElement;
