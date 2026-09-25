import React from 'react';
import prisma from '@/lib/prisma';
import ContentManagerClient from './ContentManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  let contents: any[] = [];
  try {
    contents = await prisma.siteContent.findMany();
  } catch (e) {
    console.warn('Failed to load site contents:', e);
  }
  return <ContentManagerClient initialContents={contents} />;
}
