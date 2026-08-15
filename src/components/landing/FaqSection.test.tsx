/**
 * Проверка вкладок и раскрытия вопросов в FAQ.
 *
 * В браузере это поведение живёт на анимациях framer-motion, и если кадры не
 * идут (свёрнутая вкладка, фоновый рендер), AnimatePresence mode="wait" может
 * держать старое содержимое — со стороны выглядит как «кнопка не работает».
 * Здесь проверяем саму логику, без зависимости от кадров.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { FaqSection } from './FaqSection';
import type { FaqData } from '@/lib/types';

const data: FaqData = {
  title: 'Частые вопросы',
  user_items: [
    { question: 'Как оформить подписку?', answer: 'Скачайте приложение.' },
    { question: 'В каких заведениях действует?', answer: 'У всех партнёров.' },
  ],
  partner_items: [
    { question: 'Сколько стоит подключение?', answer: 'Подключение бесплатное.' },
    { question: 'Нужно ли оборудование?', answer: 'Нет, хватит телефона.' },
  ],
};

const setup = () =>
  render(
    <LanguageProvider>
      <FaqSection data={data} />
    </LanguageProvider>
  );

describe('FaqSection', () => {
  it('по умолчанию показывает вопросы пользователей', () => {
    setup();
    expect(screen.getByText('Как оформить подписку?')).toBeInTheDocument();
    expect(screen.queryByText('Сколько стоит подключение?')).not.toBeInTheDocument();
  });

  it('вкладка «Партнёрам» подменяет список вопросов', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Партнёрам' }));

    await waitFor(() => {
      expect(screen.getByText('Сколько стоит подключение?')).toBeInTheDocument();
    });
    expect(screen.queryByText('Как оформить подписку?')).not.toBeInTheDocument();
  });

  it('и обратно на «Пользователям»', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Партнёрам' }));
    await waitFor(() => screen.getByText('Нужно ли оборудование?'));

    fireEvent.click(screen.getByRole('button', { name: 'Пользователям' }));
    await waitFor(() => {
      expect(screen.getByText('В каких заведениях действует?')).toBeInTheDocument();
    });
  });

  it('вопрос раскрывается и закрывается', async () => {
    setup();
    const q = screen.getByRole('button', { name: /Как оформить подписку\?/ });

    expect(screen.queryByText('Скачайте приложение.')).not.toBeInTheDocument();

    fireEvent.click(q);
    await waitFor(() => {
      expect(screen.getByText('Скачайте приложение.')).toBeInTheDocument();
    });

    fireEvent.click(q);
    await waitFor(() => {
      expect(screen.queryByText('Скачайте приложение.')).not.toBeInTheDocument();
    });
  });

  it('открытым остаётся только один вопрос', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Как оформить подписку\?/ }));
    await waitFor(() => screen.getByText('Скачайте приложение.'));

    fireEvent.click(screen.getByRole('button', { name: /В каких заведениях действует\?/ }));
    await waitFor(() => {
      expect(screen.getByText('У всех партнёров.')).toBeInTheDocument();
      expect(screen.queryByText('Скачайте приложение.')).not.toBeInTheDocument();
    });
  });
});
