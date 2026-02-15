import { SiteContent, Lang } from './types';

const contentRu: SiteContent = {
  meta: {
    title: 'subday — подписка на любимые напитки',
    description: 'Оформите подписку и получайте кофе и напитки в лучших заведениях вашего города каждый день.',
    og_image: ''
  },
  sections: [
    {
      id: 'hero', type: 'hero', order: 0,
      data: {
        title: 'subday — подписка\nна любимые напитки',
        subtitle: 'Одна подписка — кофе и напитки в лучших заведениях вашего города. Экономьте каждый день.',
        app_store_url: 'https://apps.apple.com/app/idXXXXXXXXX',
        google_play_url: 'https://play.google.com/store/apps/details?id=XXXXXXXXX'
      }
    },
    {
      id: 'steps', type: 'steps', order: 1,
      data: {
        title: 'Как это работает',
        items: [
          { title: 'Оформите подписку', description: 'Выберите тариф в приложении subday — это займёт пару минут' },
          { title: 'Покажите QR-код', description: 'Откройте приложение и покажите QR бариста в любом заведении-партнёре' },
          { title: 'Наслаждайтесь', description: 'Получайте любимые напитки каждый день без переплат' }
        ]
      }
    },
    {
      id: 'users', type: 'users', order: 2,
      data: {
        title: 'Для пользователей',
        items: [
          { title: 'Экономия до 70%', description: 'Одна подписка заменяет десятки отдельных покупок. Утренний кофе — дешевле.' },
          { title: 'Свобода выбора', description: 'Любое заведение-партнёр, любой напиток из меню подписки — без ограничений.' },
          { title: 'Всё в приложении', description: 'Оплата, история, бонусы — никаких карт лояльности и лишних действий.' }
        ]
      }
    },
    {
      id: 'partners', type: 'partners', order: 3,
      data: {
        title: 'Для партнёров',
        advantages: [
          { title: 'Рост повторных визитов', description: 'Подписчики возвращаются в 3–5 раз чаще обычных гостей.' },
          { title: 'Предсказуемый доход', description: 'Ежемесячные подписки — стабильный поток гостей.' },
          { title: 'Новые клиенты', description: 'Тысячи пользователей subday ищут заведения рядом.' },
          { title: 'Аналитика', description: 'Статистика посещений и предпочтений ваших гостей.' }
        ],
        steps: [
          { title: 'Оставьте заявку', description: 'Заполните форму на сайте или свяжитесь с нами.' },
          { title: 'Обсудим условия', description: 'Менеджер подберёт формат сотрудничества.' },
          { title: 'Подключение', description: 'Интегрируем заведение за 1 день.' },
          { title: 'Старт', description: 'Принимайте подписчиков и следите за аналитикой.' }
        ],
        conditions: 'Подключение бесплатное. Модель revenue share.'
      }
    },
    {
      id: 'trust', type: 'trust', order: 4,
      data: {
        title: 'Нам доверяют',
        logos: [],
        metrics: [
          { value: '5 000+', label: 'подписчиков' },
          { value: '50+', label: 'заведений' },
          { value: '100 000+', label: 'напитков' }
        ],
        reviews: [
          { text: 'subday изменил мои утренние привычки. Кофе каждый день — это просто и приятно.', author: 'Алия М.', role: 'Пользователь' },
          { text: 'Поток повторных гостей вырос на 40% после подключения к subday.', author: 'Марат К.', role: 'Владелец кофейни' },
          { text: 'Экономлю около 15 000 тенге в месяц на кофе. Подписка окупается за 3 дня!', author: 'Дана С.', role: 'Пользователь' },
          { text: 'Удобная система для заведения — подключились за день, гости довольны.', author: 'Ержан Т.', role: 'Управляющий кафе' }
        ],
        partner_logos_title: 'Наши партнёры',
        partner_logos: [
          { url: '/placeholder.svg', name: 'Партнёр 1' },
          { url: '/placeholder.svg', name: 'Партнёр 2' },
          { url: '/placeholder.svg', name: 'Партнёр 3' },
          { url: '/placeholder.svg', name: 'Партнёр 4' },
          { url: '/placeholder.svg', name: 'Партнёр 5' }
        ]
      }
    },
    {
      id: 'faq', type: 'faq', order: 5,
      data: {
        title: 'Частые вопросы',
        user_items: [
          { question: 'Как оформить подписку?', answer: 'Скачайте приложение subday, выберите тариф и оплатите — подписка активируется мгновенно.' },
          { question: 'В каких заведениях действует?', answer: 'Во всех заведениях-партнёрах в вашем городе. Список — в приложении.' },
          { question: 'Можно ли отменить?', answer: 'Да, в любой момент в настройках приложения.' },
          { question: 'Какие напитки входят?', answer: 'Зависит от тарифа и заведения. Подробности — в приложении.' }
        ],
        partner_items: [
          { question: 'Сколько стоит подключение?', answer: 'Бесплатно. Работаем по модели revenue share.' },
          { question: 'Нужно ли оборудование?', answer: 'Нет, достаточно смартфона для сканирования QR.' },
          { question: 'Как быстро начать?', answer: 'Подключение за 1 рабочий день.' },
          { question: 'Какая аналитика?', answer: 'Визиты, популярные напитки, динамика посещений.' }
        ]
      }
    },
    {
      id: 'cta', type: 'cta', order: 6,
      data: {
        title: 'Начните с subday сегодня',
        subtitle: 'Скачайте приложение или станьте партнёром',
        app_store_url: 'https://apps.apple.com/app/idXXXXXXXXX',
        google_play_url: 'https://play.google.com/store/apps/details?id=XXXXXXXXX'
      }
    },
    {
      id: 'footer', type: 'footer', order: 7,
      data: {
        city: 'Атырау, Казахстан',
        email: 'hello@subday.kz',
        phone: '+7 (7xx) xxx-xx-xx',
        links: [
          { label: 'Публичная оферта', url: '#offer' }
        ]
      }
    }
  ]
};

const contentKz: SiteContent = {
  meta: {
    title: 'subday — сүйікті сусындарға жазылым',
    description: 'Жазылымды рәсімдеңіз және қалаңыздағы үздік мекемелерде күн сайын кофе мен сусындар алыңыз.',
    og_image: ''
  },
  sections: [
    {
      id: 'hero', type: 'hero', order: 0,
      data: {
        title: 'subday - specialty coffee &\nHoReCa',
        subtitle: 'Бір жазылым — қалаңыздағы үздік мекемелерде кофе мен сусындар. Күн сайын үнемдеңіз.',
        app_store_url: 'https://apps.apple.com/app/idXXXXXXXXX',
        google_play_url: 'https://play.google.com/store/apps/details?id=XXXXXXXXX'
      }
    },
    {
      id: 'steps', type: 'steps', order: 1,
      data: {
        title: 'Қалай жұмыс істейді',
        items: [
          { title: 'Жазылымды рәсімдеңіз', description: 'subday қосымшасында тарифті таңдаңыз — бірнеше минут қана' },
          { title: 'QR-кодты көрсетіңіз', description: 'Қосымшаны ашып, кез келген серіктес мекемеде баристаға QR көрсетіңіз' },
          { title: 'Рахаттаныңыз', description: 'Сүйікті сусындарыңызды күн сайын артық төлемсіз алыңыз' }
        ]
      }
    },
    {
      id: 'users', type: 'users', order: 2,
      data: {
        title: 'Пайдаланушыларға',
        items: [
          { title: '70%-ға дейін үнемдеу', description: 'Бір жазылым ондаған жеке сатып алуларды алмастырады.' },
          { title: 'Таңдау еркіндігі', description: 'Кез келген серіктес мекеме, жазылым мәзіріндегі кез келген сусын.' },
          { title: 'Бәрі қосымшада', description: 'Төлем, тарих, бонустар — артық карталар мен әрекеттер жоқ.' }
        ]
      }
    },
    {
      id: 'partners', type: 'partners', order: 3,
      data: {
        title: 'Серіктестерге',
        advantages: [
          { title: 'Қайта келулер өсімі', description: 'Жазылушылар кәдімгі қонақтардан 3-5 есе жиі оралады.' },
          { title: 'Тұрақты табыс', description: 'Ай сайынғы жазылымдар — тұрақты қонақ ағыны.' },
          { title: 'Жаңа клиенттер', description: 'subday мыңдаған пайдаланушылары жақын мекемелер іздейді.' },
          { title: 'Аналитика', description: 'Қонақтарыңыздың келу және таңдау статистикасы.' }
        ],
        steps: [
          { title: 'Өтінім қалдырыңыз', description: 'Сайттағы форманы толтырыңыз немесе бізге хабарласыңыз.' },
          { title: 'Шарттарды талқылаймыз', description: 'Менеджер ынтымақтастық форматын таңдайды.' },
          { title: 'Қосылу', description: 'Мекемені 1 күнде қосымшаға біріктіреміз.' },
          { title: 'Бастау', description: 'Жазылушыларды қабылдаңыз және аналитиканы қадағалаңыз.' }
        ],
        conditions: 'Қосылу тегін. Revenue share моделі.'
      }
    },
    {
      id: 'trust', type: 'trust', order: 4,
      data: {
        title: 'Бізге сенеді',
        logos: [],
        metrics: [
          { value: '5 000+', label: 'жазылушы' },
          { value: '50+', label: 'мекеме' },
          { value: '100 000+', label: 'сусын' }
        ],
        reviews: [
          { text: 'subday таңғы әдеттерімді өзгертті. Күн сайын кофе — қарапайым және жағымды.', author: 'Әлия М.', role: 'Пайдаланушы' },
          { text: 'subday қосылғаннан кейін қайта келетін қонақтар 40%-ға өсті.', author: 'Марат К.', role: 'Кофехана иесі' },
          { text: 'Айына 15 000 теңге үнемдеймін. Жазылым 3 күнде өзін ақтайды!', author: 'Дана С.', role: 'Пайдаланушы' },
          { text: 'Мекемеге ыңғайлы жүйе — бір күнде қосылдық, қонақтар ризашылды.', author: 'Ержан Т.', role: 'Кафе басқарушысы' }
        ],
        partner_logos_title: 'Біздің серіктестер',
        partner_logos: [
          { url: '/placeholder.svg', name: 'Серіктес 1' },
          { url: '/placeholder.svg', name: 'Серіктес 2' },
          { url: '/placeholder.svg', name: 'Серіктес 3' },
          { url: '/placeholder.svg', name: 'Серіктес 4' },
          { url: '/placeholder.svg', name: 'Серіктес 5' }
        ]
      }
    },
    {
      id: 'faq', type: 'faq', order: 5,
      data: {
        title: 'Жиі қойылатын сұрақтар',
        user_items: [
          { question: 'Жазылымды қалай рәсімдеу?', answer: 'subday қосымшасын жүктеп, тарифті таңдап, төлеңіз — жазылым бірден белсенді болады.' },
          { question: 'Қандай мекемелерде жарамды?', answer: 'Қалаңыздағы барлық серіктес мекемелерде. Тізім қосымшада.' },
          { question: 'Бас тартуға бола ма?', answer: 'Иә, қосымша параметрлерінде кез келген уақытта.' },
          { question: 'Қандай сусындар кіреді?', answer: 'Тариф пен мекемеге байланысты. Толығырақ — қосымшада.' }
        ],
        partner_items: [
          { question: 'Қосылу қанша тұрады?', answer: 'Тегін. Revenue share моделімен жұмыс істейміз.' },
          { question: 'Арнайы жабдық керек пе?', answer: 'Жоқ, QR сканерлеу үшін смартфон жеткілікті.' },
          { question: 'Қаншалықты тез бастауға болады?', answer: '1 жұмыс күні ішінде қосылу.' },
          { question: 'Қандай аналитика аламын?', answer: 'Келулер, танымал сусындар, келу динамикасы.' }
        ]
      }
    },
    {
      id: 'cta', type: 'cta', order: 6,
      data: {
        title: 'Бүгін subday-мен бастаңыз',
        subtitle: 'Қосымшаны жүктеңіз немесе серіктес болыңыз',
        app_store_url: 'https://apps.apple.com/app/idXXXXXXXXX',
        google_play_url: 'https://play.google.com/store/apps/details?id=XXXXXXXXX'
      }
    },
    {
      id: 'footer', type: 'footer', order: 7,
      data: {
        city: 'Атырау, Қазақстан',
        email: 'hello@subday.kz',
        phone: '+7 (7xx) xxx-xx-xx',
        links: [
          { label: 'Публичная оферта', url: '#offer' }
        ]
      }
    }
  ]
};

export function getDefaultContent(lang: Lang): SiteContent {
  return lang === 'kz' ? contentKz : contentRu;
}
