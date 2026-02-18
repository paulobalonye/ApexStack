/* ============================================
   US Holiday Calendar
   Calculates all major US federal holidays
   including floating holidays
   ============================================ */

// Fixed-date holidays
function getFixedHolidays(year) {
  return [
    { date: `${year}-01-01`, name: "New Year's Day", message: "Wishing you a happy, healthy, and prosperous new year! Here's to building great things together in the year ahead." },
    { date: `${year}-02-14`, name: "Valentine's Day", message: "Happy Valentine's Day! We love working with amazing partners like you." },
    { date: `${year}-06-19`, name: 'Juneteenth', message: 'Today we honor and celebrate freedom, resilience, and progress. Wishing you a meaningful Juneteenth.' },
    { date: `${year}-07-04`, name: 'Independence Day', message: 'Happy Fourth of July! Wishing you a wonderful day of celebration with family and friends.' },
    { date: `${year}-11-11`, name: "Veterans Day", message: 'Today we honor the brave men and women who have served our country. Thank you for your service and sacrifice.' },
    { date: `${year}-12-25`, name: 'Christmas Day', message: 'Merry Christmas from our team to yours! Wishing you warmth, joy, and time well spent with loved ones.' },
  ];
}

// Nth weekday of month (0=Sun, 1=Mon, ..., 6=Sat)
function getNthWeekdayOfMonth(year, month, weekday, n) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  let dayOfWeek = firstDay.getUTCDay();
  let day = 1 + ((weekday - dayOfWeek + 7) % 7) + (n - 1) * 7;
  const d = new Date(Date.UTC(year, month, day));
  return d.toISOString().split('T')[0];
}

// Last weekday of month
function getLastWeekdayOfMonth(year, month, weekday) {
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  let dayOfWeek = lastDay.getUTCDay();
  let diff = (dayOfWeek - weekday + 7) % 7;
  const d = new Date(Date.UTC(year, month + 1, -diff));
  return d.toISOString().split('T')[0];
}

// Easter (Anonymous Gregorian Computus algorithm)
function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const d2 = new Date(Date.UTC(year, month - 1, day));
  return d2.toISOString().split('T')[0];
}

function getFloatingHolidays(year) {
  return [
    { date: getNthWeekdayOfMonth(year, 0, 1, 3), name: 'Martin Luther King Jr. Day', message: 'Today we honor the legacy of Dr. Martin Luther King Jr. and his dream of equality, justice, and unity for all.' },
    { date: getNthWeekdayOfMonth(year, 1, 1, 3), name: "Presidents' Day", message: "Happy Presidents' Day! A day to honor the leadership that has shaped our nation." },
    { date: getEaster(year), name: 'Easter', message: 'Happy Easter! Wishing you a day filled with joy, renewal, and time with those you love.' },
    { date: getLastWeekdayOfMonth(year, 4, 1), name: 'Memorial Day', message: 'On this Memorial Day, we remember and honor those who made the ultimate sacrifice for our freedom.' },
    { date: getNthWeekdayOfMonth(year, 8, 1, 1), name: 'Labor Day', message: 'Happy Labor Day! Celebrating the achievements of workers everywhere. Enjoy the well-deserved break.' },
    { date: getNthWeekdayOfMonth(year, 9, 1, 2), name: 'Columbus Day', message: 'Happy Columbus Day! A day to reflect on exploration, discovery, and the diverse history of our nation.' },
    { date: getNthWeekdayOfMonth(year, 10, 4, 4), name: 'Thanksgiving', message: "Happy Thanksgiving! We're grateful for partners like you. Wishing you a wonderful day of gratitude and celebration." },
  ];
}

export function getUSHolidaysForYear(year) {
  return [...getFixedHolidays(year), ...getFloatingHolidays(year)].sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayHoliday() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const year = now.getUTCFullYear();
  const holidays = getUSHolidaysForYear(year);
  return holidays.find(h => h.date === today) || null;
}
