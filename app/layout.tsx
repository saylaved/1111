import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { SHOP } from "@/lib/data";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lypskiy barbershop · сімейний барбершоп на Мечникова, 5",
  description:
    "П’ять майстрів, рейтинг 4,99 з 953 відгуків. Щодня 10:00–20:00, Київ, вул. Мечникова, 5. Онлайн-запис без передоплати.",
  openGraph: {
    title: "Lypskiy barbershop",
    description: "Сімейний барбершоп у Києві. Запис онлайн без передоплати.",
    locale: "uk_UA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: SHOP.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: "вул. Мечникова, 5",
    addressLocality: "Київ",
    addressCountry: "UA",
  },
  geo: { "@type": "GeoCoordinates", latitude: SHOP.geo.lat, longitude: SHOP.geo.lng },
  openingHours: "Mo-Su 10:00-20:00",
  priceRange: "300–1600 UAH",
  aggregateRating: { "@type": "AggregateRating", ratingValue: SHOP.rating, reviewCount: SHOP.reviews },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${unbounded.variable} ${onest.variable}`}>
      <body className="bg-void text-chrome">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
