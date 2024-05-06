import puppeteer, { Page } from 'puppeteer';
import { clickAriaLabel, clickSpanByText } from './search';

export async function loginToX(username:string , password:string) {
  const browser = await puppeteer.launch({ headless: false, args: ['--disable-dev-shm-usage'] }); // 実際にwindowを表示し、エラーが発生した場合はブラウザを閉じずに停止する
  
  const page = await browser.newPage();
  await login(page, username, password);
  
  // エリアラベルに「調べたいものを検索」と書かれたaタグをクリック
  clickAriaLabel(page, 'a', '調べたいものを検索');
  const as = await page.$$('a');
  await page.waitForNetworkIdle();
 
  // Trendingと書かれたspanタグをクリック
  clickSpanByText(page, 'span', 'Trending');
  await page.waitForNetworkIdle();

  // トレンド一覧を取得
  // data-testid属性に「trend」と書かれたdivタグを取得
  const trendItems = await page.$$('[data-testid="trend"]');
  for (let trendItem of trendItems) {
    const trend = await page.evaluate(element => element.textContent, trendItem);
    console.log(trend);
  }

  // await browser.close();
}

async function login(page: Page, username:string , password:string) {
  await page.goto('https://x.com/login');

  await page.waitForSelector('input[name="text"]');
  await page.type('input[name="text"]', username, {delay: 200});
  // 「次へ」と書かれたspanタグをクリック
  clickSpanByText(page, 'span', '次へ');

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', password);
  
  // 「ログイン」と書かれたspanタグをクリック
  clickSpanByText(page, 'span', 'ログイン');
  // ログイン後のページが読み込まれるのを待つ
  await page.waitForNavigation();
  console.log('ログイン成功');
  await page.waitForNetworkIdle({ idleTime: 2000});

  // 「アカウントのセキュリティを強化する」というテキストがあるかどうかを確認(documentは使用しない)
  const text = await page.$$eval('body', elements => elements.map(element => element.textContent)).then(texts => texts.join(''));
  if (text && text.includes('アカウントのセキュリティを強化する')) {
    console.log('アカウントのセキュリティを強化する画面が表示されました。');
    // aria-labelに「閉じる」と書かれたdivタグをクリック
    clickAriaLabel(page, 'div', '閉じる');
  } 
}
