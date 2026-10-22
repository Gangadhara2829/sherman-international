import React from 'react';
import { getPartners } from '@/lib/partners';
import PartnersManagerClient from './PartnersManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const partners = await getPartners({ includeInactive: true });
  return <PartnersManagerClient initialPartners={partners} />;
}
