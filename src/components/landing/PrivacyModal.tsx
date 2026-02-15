import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Политика конфиденциальности</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 pr-4">
            <p className="text-xs">Дата размещения: 28 января 2026 г.</p>
            <p><strong>Оператор персональных данных:</strong> ТОО «Subday Group», БИН 980102400093</p>
            <p><strong>Адрес:</strong> РК, Атырауская обл., г. Атырау, мкр. Береке, д.23, кв.37</p>
            <p><strong>Контакты:</strong> supp@subday.app, +7 707 700 0994</p>

            <h3 className="text-foreground font-semibold mt-6">1. Какие данные мы обрабатываем</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Данные аккаунта:</strong> номер телефона, имя/ник, идентификаторы аккаунта.</li>
              <li><strong>Данные покупок и использования:</strong> приобретённые Пакеты, статусы оплат, история Погашений, гостевой доступ.</li>
              <li><strong>Технические данные:</strong> модель устройства, ОС, IP-адрес, идентификаторы приложения, журналы ошибок.</li>
              <li><strong>Данные для рассылок:</strong> push-токены, номер телефона для WhatsApp, идентификатор Telegram.</li>
              <li><strong>Геолокация:</strong> для показа ближайших партнёров (если разрешена).</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-6">2. Цели обработки</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>регистрация и предоставление доступа к сервису;</li>
              <li>проведение оплат и учёт Пакетов/Погашений;</li>
              <li>предоставление гостевого доступа по правилам;</li>
              <li>поддержка и обработка обращений;</li>
              <li>безопасность и антифрод;</li>
              <li>сервисные уведомления (не рекламные);</li>
              <li>маркетинговые сообщения — только при наличии отдельного согласия.</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-6">3. Правовые основания</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>исполнение договора (Оферта/Соглашение);</li>
              <li>согласие Пользователя (маркетинг, геолокация, мессенджеры);</li>
              <li>законные интересы (безопасность/антифрод);</li>
              <li>требования законодательства РК.</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-6">4. Кому мы передаём данные</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Партнёрам:</strong> минимально необходимое для подтверждения Погашения.</li>
              <li><strong>Kaspi и платёжной инфраструктуре:</strong> для обработки оплаты.</li>
              <li><strong>Подрядчикам:</strong> хостинг/облако/уведомления/аналитика.</li>
              <li><strong>Госорганам:</strong> по законному требованию.</li>
            </ul>

            <h3 className="text-foreground font-semibold mt-6">5. Сроки хранения</h3>
            <p>Храним данные столько, сколько нужно для целей обработки, учёта и разрешения споров, затем удаляем или обезличиваем.</p>

            <h3 className="text-foreground font-semibold mt-6">6. Права пользователя</h3>
            <p>Вы можете запросить доступ/уточнение/удаление данных, а также отозвать маркетинговое согласие. Контакт: supp@subday.app.</p>

            <h3 className="text-foreground font-semibold mt-6">7. Безопасность</h3>
            <p>Используем организационные и технические меры защиты данных.</p>

            <h3 className="text-foreground font-semibold mt-6">8. Изменение политики</h3>
            <p>Новая редакция публикуется в приложении и действует с даты публикации.</p>

            <div className="border-t border-border pt-4 mt-6">
              <h3 className="text-foreground font-semibold">Согласие на обработку персональных данных</h3>
              <p>Я даю ТОО «Subday Group», БИН 980102400093, согласие на сбор, хранение, обработку и передачу моих персональных данных в объёме и целях, указанных в Политике конфиденциальности Subday, включая регистрацию, проведение оплат, учёт Пакетов/Погашений, гостевой доступ, поддержку, безопасность и антифрод.</p>
              <p className="text-xs mt-2">Дата: Дата принятия правил — Подтверждение: авторизация, регистрация, вход в приложение.</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
