// /api/proxy.js
export default async function handler(req, res) {
  try {
    // تبدیل آدرس به یک آبجکت استاندارد URL برای اینکه بخش Fetch ورسل ارور پارس ندهد
    const validUrl = new URL('open.spotify.com');

    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Target responded with status: ${response.status}`);
    }

    const html = await response.text();

    // تزریق هدرها و حذف بادی‌گاردهای ضد آی‌فریم
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).send(html);
  } catch (error) {
    // اگر باز هم ارور داد، دقیقاً جزئیات استک‌تریس را می‌بینیم
    return res.status(500).send('Proxy Runtime Error: ' + error.message);
  }
}
