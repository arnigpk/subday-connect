export type Lang = 'ru' | 'kz';

export type SectionType = 'hero' | 'steps' | 'users' | 'partners' | 'trust' | 'faq' | 'cta' | 'footer';

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    og_image: string;
  };
  sections: Section[];
}

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  data: HeroData | StepsData | UsersData | PartnersData | TrustData | FaqData | CtaData | FooterData;
}

export interface HeroData {
  title: string;
  subtitle: string;
  app_store_url: string;
  google_play_url: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsData {
  title: string;
  items: StepItem[];
}

export interface UserAdvantage {
  title: string;
  description: string;
}

export interface UsersData {
  title: string;
  items: UserAdvantage[];
}

export interface PartnerAdvantage {
  title: string;
  description: string;
}

export interface PartnerStep {
  title: string;
  description: string;
}

export interface PartnersData {
  title: string;
  advantages: PartnerAdvantage[];
  steps: PartnerStep[];
  conditions: string;
}

export interface TrustLogo {
  url: string;
  alt: string;
}

export interface TrustMetric {
  value: string;
  label: string;
}

export interface TrustReview {
  text: string;
  author: string;
  role: string;
}

export interface PartnerLogo {
  url: string;
  name: string;
}

export interface TrustData {
  title: string;
  logos: TrustLogo[];
  metrics: TrustMetric[];
  reviews: TrustReview[];
  partner_logos_title: string;
  partner_logos: PartnerLogo[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  title: string;
  user_items: FaqItem[];
  partner_items: FaqItem[];
}

export interface CtaData {
  title: string;
  subtitle: string;
  app_store_url: string;
  google_play_url: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterData {
  city: string;
  email: string;
  phone: string;
  links: FooterLink[];
}

export interface LeadRecord {
  id: string;
  created_at: string;
  name: string;
  city: string;
  phone: string;
  venue: string;
  comment: string;
  status: string;
  note: string;
}
