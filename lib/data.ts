// Source: public Altegio booking form (n561092.alteg.io/company/530369), snapshot 10.11.2026.
// Next step: load from Altegio book_services / book_staff with 15-minute revalidation.

export const PRICE_SNAPSHOT = new Date("2026-11-10T12:00:00+02:00");
export const FAMILY_TWO_SONS_FROM = 1800;

export const BOOKING_URL = "https://n561092.alteg.io/company/530369";
export const masterBookingUrl = (id: number) =>
  `${BOOKING_URL}/personal/select-master?o=m${id}`;

export const SHOP = {
  name: "Lypskiy barbershop",
  city: "Київ",
  street: "вул. Мечникова, 5",
  opens: 10,
  closes: 20,
  timeZone: "Europe/Kyiv",
  rating: 4.99,
  reviews: 953,
  belowFive: 5,
  geo: { lat: 50.4373588, lng: 30.53146351 },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=50.4373588,30.53146351",
} as const;

export type LevelKey = "top" | "barber" | "junior";

export const LEVELS: { key: LevelKey; label: string; hint: string }[] = [
  { key: "top", label: "Топ-барбер", hint: "Едуард, Артем, Роман" },
  { key: "barber", label: "Барбер", hint: "Павло" },
  { key: "junior", label: "Молодший", hint: "Назар" },
];

export type Master = {
  id: number;
  name: string;
  genitive: string;
  level: LevelKey;
  levelLabel: string;
  english: boolean;
  rating: number;
  reviews: number;
  from: number;
  photo: string;
  width: number;
  height: number;
};

export const MASTERS: Master[] = [
  { id: 1542858, name: "Едуард Хавень", genitive: "Едуарда", level: "top", levelLabel: "Топ-барбер", english: false, rating: 5.0, reviews: 189, from: 1000, photo: "/masters/m-1542858.jpg", width: 720, height: 720 },
  { id: 1543365, name: "Артем Хавень", genitive: "Артема", level: "top", levelLabel: "Топ-барбер", english: false, rating: 4.97, reviews: 212, from: 1000, photo: "/masters/m-1543365.jpg", width: 720, height: 720 },
  { id: 2089003, name: "Роман Басюк", genitive: "Романа", level: "top", levelLabel: "Топ-барбер", english: true, rating: 5.0, reviews: 270, from: 1000, photo: "/masters/m-2089003.jpg", width: 487, height: 487 },
  { id: 2911482, name: "Павло Хавень", genitive: "Павла", level: "barber", levelLabel: "Барбер", english: false, rating: 5.0, reviews: 125, from: 800, photo: "/masters/m-2911482.jpg", width: 614, height: 800 },
  { id: 2191354, name: "Назар Михальчук", genitive: "Назара", level: "junior", levelLabel: "Молодший барбер", english: false, rating: 4.99, reviews: 122, from: 700, photo: "/masters/m-2191354.jpg", width: 413, height: 413 },
];

export type Service = { title: string; duration: string; price: number };

export const PRICES: Record<LevelKey, Service[]> = {
  top: [
    { title: "Чоловіча стрижка", duration: "45 хв", price: 1000 },
    { title: "Стрижка + борода", duration: "1 год", price: 1500 },
    { title: "Борода і вуса", duration: "30 хв", price: 600 },
    { title: "Стрижка машинкою", duration: "45 хв", price: 800 },
    { title: "Подовжена стрижка", duration: "1 год", price: 1200 },
    { title: "Дитяча стрижка", duration: "45 хв", price: 800 },
    { title: "Батько + син", duration: "1 год 30 хв", price: 1600 },
    { title: "Камуфляж сивини", duration: "30 хв", price: 600 },
  ],
  barber: [
    { title: "Чоловіча стрижка", duration: "1 год", price: 800 },
    { title: "Стрижка + борода", duration: "1 год 30 хв", price: 1200 },
    { title: "Борода і вуса", duration: "45 хв", price: 500 },
    { title: "Стрижка машинкою", duration: "45 хв", price: 700 },
    { title: "Подовжена стрижка", duration: "1 год", price: 1000 },
    { title: "Дитяча стрижка", duration: "1 год", price: 700 },
    { title: "Батько + син", duration: "2 год", price: 1400 },
    { title: "Камуфляж сивини", duration: "30 хв", price: 400 },
  ],
  junior: [
    { title: "Чоловіча стрижка", duration: "1 год 15 хв", price: 700 },
    { title: "Стрижка + борода", duration: "2 год", price: 1000 },
    { title: "Борода і вуса", duration: "45 хв", price: 400 },
    { title: "Стрижка машинкою", duration: "1 год", price: 500 },
    { title: "Подовжена стрижка", duration: "1 год 15 хв", price: 800 },
    { title: "Дитяча стрижка", duration: "1 год 15 хв", price: 600 },
    { title: "Батько + син", duration: "2 год 15 хв", price: 1200 },
    { title: "Камуфляж сивини", duration: "30 хв", price: 300 },
  ],
};

export const REVIEWS: { text: string; author: string; master: string }[] = [
  { text: "Я вже без перебільшення рік ходжу до цього майстра, і ніколи не пішов додому незадоволений.", author: "Тимур", master: "Назар" },
  { text: "Артем, як завжди, на високому професійному рівні. Дякую!", author: "Сергій", master: "Артем" },
  { text: "Дякую за ідеальну зачіску! Супер майстер своєї справи.", author: "Роман", master: "Едуард" },
  { text: "Неймовірний майстер. Дякую за чудовий сервіс.", author: "Антон", master: "Роман" },
  { text: "Дуже сподобалась стрижка та корекція бороди, буду звертатись ще.", author: "Андрій", master: "Павло" },
];

export type ShapeKey = "oval" | "round" | "square" | "heart" | "diamond" | "oblong";

export const SHAPES: Record<ShapeKey, { label: string; tip: string; recos: { service: string; why: string; from: number }[] }> = {
  oval: { label: "Овал", tip: "Універсальна форма: пасує майже все.", recos: [
    { service: "Подовжена стрижка", why: "Текстурний верх і природна лінія підкреслять пропорції.", from: 1200 },
    { service: "Чоловіча стрижка", why: "Класичний side part або кроп.", from: 1000 } ] },
  round: { label: "Коло", tip: "Мета: додати вертикаль і кути.", recos: [
    { service: "Чоловіча стрижка", why: "Об’єм зверху і щільні боки (high fade) витягують силует.", from: 1000 },
    { service: "Стрижка + борода", why: "Борода з чіткою лінією підборіддя додає довжини.", from: 1500 } ] },
  square: { label: "Квадрат", tip: "Сильну щелепу варто підкреслити, а не ховати.", recos: [
    { service: "Стрижка машинкою", why: "Buzz cut або короткий кроп з переходом.", from: 800 },
    { service: "Борода і вуса", why: "Коротка охайна борода повторює лінію щелепи.", from: 600 } ] },
  heart: { label: "Серце", tip: "Широке чоло й вузьке підборіддя: балансуємо низ.", recos: [
    { service: "Подовжена стрижка", why: "Середня довжина з пасмами на чоло.", from: 1200 },
    { service: "Стрижка + борода", why: "Повніша борода візуально розширює підборіддя.", from: 1500 } ] },
  diamond: { label: "Ромб", tip: "Виражені вилиці: потрібна м’якість на скронях.", recos: [
    { service: "Подовжена стрижка", why: "Довший верх з м’яким бічним проділом.", from: 1200 },
    { service: "Борода і вуса", why: "Борода середньої щільності врівноважує вилиці.", from: 600 } ] },
  oblong: { label: "Видовжене", tip: "Не додаємо висоти, тримаємо ширину.", recos: [
    { service: "Чоловіча стрижка", why: "Помірний верх, боки без сильного fade, можливий чубчик.", from: 1000 },
    { service: "Стрижка + борода", why: "Борода з об’ємом з боків, а не вниз.", from: 1500 } ] },
};
