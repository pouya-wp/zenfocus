// این یک توابع سرورلس ورسل است که نقش پروکسی معکوس رو بازی می‌کنه
export default async function handler(req, res) {
  // آدرس پادکستی که می‌خوای لود کنی
  const targetUrl = 'open.spotify.com';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // گرفتن کدهای HTML صفحه
    const html = await response.text();

    // تنظیم هدرها - حذف هدرهای ضد آی‌فریم و اجازه دادن به مرورگر برای رندر
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // ارسال HTML بازنویسی شده به فرانت‌باند شما
    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send('Proxy Error: ' + error.message);
  }
}
