import { Page } from "puppeteer";

export async function clickSpanByText(page: Page, tagetTag: string, targetText: string) {
  const spans = await page.$$(tagetTag);
  for (let span of spans) {
    const text = await page.evaluate(element => element.textContent, span);
    if (text === targetText) {
      await span.click();
      break; // 最初に見つかった要素に対してのみ操作を行い、ループを抜ける
    }
  }
}

export async function clickAriaLabel(page: Page, tagetTag: string, targetAriaLabel: string) {
  const divs = await page.$$(tagetTag);
  for (let div of divs) {
    const ariaLabel = await page.evaluate(element => element.getAttribute('aria-label'), div);
    if (ariaLabel === targetAriaLabel) {
      await div.click();
      break; // 最初に見つかった要素に対してのみ操作を行い、ループを抜ける
    }
  }
}