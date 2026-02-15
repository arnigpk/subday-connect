import { useState, useMemo, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { StepsSection } from '@/components/landing/StepsSection';
import { AppMockup } from '@/components/landing/AppMockup';
import { UsersSection } from '@/components/landing/UsersSection';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { PartnerModal } from '@/components/landing/PartnerModal';
import { Preloader } from '@/components/landing/Preloader';
import { CoffeeBeansBackground } from '@/components/landing/CoffeeBeansBackground';
import {
  HeroData, StepsData, UsersData, PartnersData,
  TrustData, FaqData, CtaData, FooterData, Section
} from '@/lib/types';
import { Helmet } from 'react-helmet-async';

function renderSection(section: Section, onPartnerClick: () => void) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={section.id} data={section.data as HeroData} onPartnerClick={onPartnerClick} />;
    case 'steps':
      return (
        <div key={section.id}>
          <StepsSection data={section.data as StepsData} />
          <AppMockup />
        </div>
      );
    case 'users':
      return <UsersSection key={section.id} data={section.data as UsersData} />;
    case 'partners':
      return <PartnersSection key={section.id} data={section.data as PartnersData} onPartnerClick={onPartnerClick} />;
    case 'trust':
      return <TrustSection key={section.id} data={section.data as TrustData} />;
    case 'faq':
      return <FaqSection key={section.id} data={section.data as FaqData} />;
    case 'cta':
      return <CtaSection key={section.id} data={section.data as CtaData} onPartnerClick={onPartnerClick} />;
    case 'footer':
      return <FooterSection key={section.id} data={section.data as FooterData} />;
    default:
      return null;
  }
}

export default function Index() {
  const { data: content, isLoading } = useContent('published');
  const [modalOpen, setModalOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const sections = useMemo(() => {
    if (!content?.sections) return [];
    return [...content.sections].sort((a, b) => a.order - b.order);
  }, [content]);

  const faqItems = useMemo(() => {
    const faq = sections.find((s) => s.type === 'faq');
    if (!faq) return null;
    const d = faq.data as FaqData;
    return [...d.user_items, ...d.partner_items];
  }, [sections]);

  const faqJsonLd = faqItems?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowPreloader(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showPreloader) {
    return <Preloader show={true} />;
  }

  return (
    <>
      <Helmet>
        <title>{content?.meta?.title || 'subday'}</title>
        <meta name="description" content={content?.meta?.description || ''} />
        <meta property="og:title" content={content?.meta?.title || 'subday'} />
        <meta property="og:description" content={content?.meta?.description || ''} />
        {content?.meta?.og_image && <meta property="og:image" content={content.meta.og_image} />}
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
      </Helmet>

      <CoffeeBeansBackground />
      <Header />

      <main>
        {sections.map((section) => renderSection(section, () => setModalOpen(true)))}
      </main>

      <PartnerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
