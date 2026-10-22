export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  websiteUrl?: string | null;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnersPageHeader {
  heading: string;
  intro: string;
}

export const DEFAULT_PARTNERS_HEADER: PartnersPageHeader = {
  heading: 'Our Partners & Principals',
  intro:
    'Sherman International acts as a strategic technical channel partner and authorized representative for premier global instrumentation and equipment manufacturers across process industries in India.',
};
