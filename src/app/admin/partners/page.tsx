import React from 'react';
import { getPartners, getPartnersPageHeader } from '@/lib/partners';
import PartnersManagerClient from './PartnersManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPartnersPage() {
  const [partners, header] = await Promise.all([
    getPartners({ includeInactive: true }),
    getPartnersPageHeader(),
  ]);

  return <PartnersManagerClient initialPartners={partners} initialHeader={header} />;
}
