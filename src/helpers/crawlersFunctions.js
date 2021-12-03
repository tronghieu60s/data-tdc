async function screenshotElement(page, elementName, path) {
  await page.waitForSelector(elementName);
  const element = await (await page.$(elementName)).boundingBox();
  const { x, y, width, height } = element;
  await page.screenshot({ path: `${path}.png`, clip: { x, y, width, height } });
}
exports.screenshotElement = screenshotElement;
