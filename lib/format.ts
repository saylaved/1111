const uah = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

export const formatUAH = (n: number) => `${uah.format(Math.round(n))}\u00a0₴`;

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Kyiv" }).format(d);

export const formatRating = (n: number) =>
  new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
