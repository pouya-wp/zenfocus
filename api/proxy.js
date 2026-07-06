// /api/proxy.js
export default async function handler(req, res) {
  // اضافه کردن حتمی پروتکل امن https به ابتدای آدرس پروکسی برای حل مشکل پارسر ورسل
  const targetUrl = 'open.spotify.com';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Target responded with status: ${response.status}`);
    }

    const html = await response.text();

    // تنظیم هدرهای مجاز برای دور زدن سیستم امنیتی مرورگر کاربر
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // ارسال مستقیم کدهای تصفیه شده به آی‌فریم ری‌اکت
    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send('Proxy Runtime Error: ' + error.message);
  }
}
