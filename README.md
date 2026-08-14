# Subday Partner Portal

Собери продакшн-ready проект “subday” (писать строго subday) — одностраничный лендинг + админка (визуальный редактор) + CRM заявок партнёров + интеграция Telegram. Важно: проект должен запускаться на ВИРТУАЛЬНОМ ХОСТИНГЕ (shared hosting) — без сервера/VPS, без node/npm сборки. Реализация на PHP + HTML/CSS/JS (vanilla). Допускаются CDN-библиотеки (например SortableJS для drag&drop), но никакой сборки.

ЯЗЫКИ:

- RU по умолчанию, переключатель RU/KZ

- Контент хранить отдельно для RU и KZ (draft/published)

- Переключатель языка на сайте и в админке

ЦЕЛЬ САЙТА:

- Максимально продающий лендинг для пользователей и партнёров subday

- CTA на App Store / Google Play

- CTA “Оставить заявку” для партнёра

ДИЗАЙН:

- premium minimal, белый фон, много воздуха, аккуратные тени, крупная типографика

- акценты: чёрный/золото очень сдержанно

- MOBILE-FIRST: обязательно проверить адаптивность. Верхняя часть НЕ должна переполняться на телефоне.

- В шапке на мобилке убрать лишние кнопки. Не делать “Скачать/Стать партнёром” как отдельные жирные CTA в header. Достаточно: логотип + меню/бургер + язык.

ПУБЛИЧНЫЙ ЛЕНДИНГ (/index.php):

Секции (одна страница, якоря, sticky header):

1) Hero: “subday — подписка на напитки…” + короткий подзаголовок + 2 кнопки App Store / Google Play + кнопка “Оставить заявку” (для партнёров)

2) Как работает (3 шага)

3) Пользователям (карточки преимуществ, без слова “выгодно”)

4) Партнёрам (преимущества + “как подключиться” 4 шага + краткие условия)

5) “Нам доверяют” — ряд логотипов (КАРТИНКИ), отзывы (плейсхолдеры), метрики (плейсхолдеры)

6) FAQ (пользователям/партнёрам)

7) Финальный CTA (без нижней формы): кнопки стора + кнопка “Оставить заявку”

8) Footer: контакты, город “Атырау, Казахстан”, ссылки на документы (placeholders)

ВАЖНО: форма заявки партнёра НЕ должна быть внизу как секция-форма.

Вместо этого: по кнопке “Оставить заявку” открывается POPUP/MODAL с формой.

POPUP ФОРМА ЗАЯВКИ:

Поля: 

- Ваше имя

- Город

- Номер телефона

- Название заведения

- Комментарий

Отправка: AJAX (fetch) на /partner_submit.php

После успеха: показать красивое “Спасибо, мы свяжемся…”

Отправка заявки:

- Сохранять в data/partner_leads.ndjson (или json)

- Отправлять уведомление в Telegram (бот -> мне в личку)

SEO:

- meta title/description/OG

- FAQ JSON-LD (schema.org)

- быстрое открытие, без тяжёлых ресурсов

АДМИНКА:

Маршруты:

- /admin/login.php (логин)

- /admin/index.php (редактор лендинга)

- /admin/leads.php (CRM заявок)

- /admin/media.php (медиа библиотека)

- /admin/settings.php (настройки Telegram + общие)

- /admin/api.php (единый API: get/save/publish/upload/leads/settings)

АВТОРИЗАЦИЯ:

- Простая авторизация admin (session)

- Хранение пароля как password_hash в inc/config.php

- CSRF token для admin POST

ХРАНЕНИЕ КОНТЕНТА (без БД, чисто файлы, подход для shared hosting):

- data/home_ru_draft.json

- data/home_ru_published.json

- data/home_kz_draft.json

- data/home_kz_published.json

- data/settings.json

- uploads/ (для картинок)

Seed:

- Если файлов нет — создать дефолтный контент по структуре выше (с placeholders).

- Все тексты без слова “выгодно”.

ВИЗУАЛЬНЫЙ РЕДАКТОР (drag & drop) — “максимально функциональный и user-friendly”:

- Левый список блоков (sections)

- Drag&drop reorder блоков (SortableJS)

- Кнопка “Добавить блок” (выбор типа: Hero, Steps, Users, Partners, Trust, FAQ, CTA, Footer)

- Клик по блоку -> правая панель редактирования полей (inputs/textarea)

- Внутри блоков, где есть списки (steps, cards, faq, trust logos) — добавление/удаление + reorder элементов

- Кнопки: “Сохранить черновик”, “Опубликовать”, “Preview”

- Preview: /?preview=1&lang=ru показывает draft только если админ залогинен, иначе показывать published

- Валидация: обязательные поля (hero title, store links, CTA) — не позволять publish если пусто

ЗАГРУЗКА ИЗОБРАЖЕНИЙ И ЛОГО:

- В админке добавить загрузку логотипа сайта (png/jpg/webp/svg) -> сохранять в uploads/ -> записывать в контент

- В блоке “Нам доверяют” сделать загрузку логотипов (картинок) через file input + предпросмотр, НЕ через ссылку

- В media.php: список файлов, предпросмотр, копировать URL, удалить

CRM ЗАЯВОК (leads.php):

- Таблица заявок с колонками: дата, имя, город, телефон, заведение, статус

- Статусы: New / In progress / Done / Spam (редактируются)

- Поиск по телефону/городу/заведению

- Просмотр карточки заявки (в модалке или на странице)

- Поле “Заметка” (internal note)

- Экспорт CSV

- Хранение в data/partner_leads.ndjson (каждая запись отдельной строкой JSON) или data/partner_leads.json (массив) — выбрать надёжнее для shared hosting (лучше ndjson + file lock)

TELEGRAM ИНТЕГРАЦИЯ (settings.php):

- Поля:

  - enabled (toggle)

  - botToken

  - chatId (в личку мне)

- Кнопки:

  - Save settings

  - Test message

  - Helper “How to get chatId” (кнопка, которая читает getUpdates и предлагает выбрать chatId)

- Отправка заявки: форматированное сообщение (дата/имя/город/тел/заведение/коммент)

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:

- PHP 8+ совместимость

- Без composer

- Без БД

- Все записи/обновления файлов через file locking (flock)

- Папки data/ и uploads/ должны быть writable; добавить проверку и понятные ошибки в админке

- Добавить .htaccess в data/ чтобы запретить прямой доступ (если Apache). Если не Apache — оставить инструкцию в README.

РЕЗУЛЬТАТ:

- Выдай полный проект структурой папок, готовый к заливке в public_html на виртуальный хостинг.

- Добавь README с точными шагами:

  1) залить файлы

  2) выставить права data/ uploads/

  3) зайти /admin и сменить пароль

  4) настроить Telegram и протестировать

Контент/копирайт:

- Используй структуру и смысл из этого ТЗ: пользователям просто, партнёрам рост повторных визитов, Казахстан/Атырау, без “выгодно”, тон уверенный, премиальный и понятный.

- Ссылки стора placeholders:

  App Store: https://apps.apple.com/app/idXXXXXXXXX

  Google Play: https://play.google.com/store/apps/details?id=XXXXXXXXX

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://subday-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a08929ca-7ce9-4e37-a6c7-6e0d4b449c59).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
