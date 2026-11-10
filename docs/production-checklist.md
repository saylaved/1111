# Перед production

- [ ] Увімкнути мережу, встановити залежності package-manager-ом і зафіксувати lockfile.
- [ ] Запустити `npm run typecheck`, `npm run build`, `npm start`; пройти сайт у Safari/iOS, Chrome/Android, Firefox і desktop keyboard-only.
- [ ] Перевірити повну стрічку й за потреби конвертувати п’ять фото майстрів у AVIF/WebP із fallback/source sets; порівняти якість і вагу.
- [ ] Підтвердити у власника дату цін і всі цифри з живим профілем Altegio; розглянути серверне джерело цін/майстрів з revalidate 15 хв.
- [ ] Підтвердити доступність запису та booking URL, мапи/адресу/графік. Соцмережі додавати лише після отримання перевірених посилань.
- [ ] Вказати production URL і додати canonical, Open Graph image, sitemap/robots.
- [ ] Вирішити, чи beta photo-picker лишається евристикою, чи замінюється on-device face landmarks. Не відправляти фото без окремого згодового продуктового рішення.
- [ ] Якщо потрібна live-доступність цін: реалізувати server-only інтеграцію Altegio та кеш із revalidate 15 хв; не додавати секрети до браузерного коду.
