import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EnquiryProvider } from '@/components/EnquiryModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sherman International (P) Limited | Engineering Solutions & Channel Partner',
  description:
    'Sherman International is an established strategic channel partner and engineering solutions provider in India, specializing in flow measurement, combustion control, dynamic balancing machines, and railway electrification.',
  keywords: [
    'Sherman International',
    'Sherman India',
    'Flow Measurement',
    'Process Switches',
    'Balancing Machine',
    'Process Technology',
    'Vibration Monitoring System',
    'Combustion Control',
    'Fluid Control',
    'Railway OHE Fittings',
    'ZEECO Flame Scanner',
    'Scherzinger Fuel Flow Divider',
    'CEMB Balancing Machine',
  ],
  authors: [{ name: 'Sherman International (P) Limited' }],
  metadataBase: new URL('https://www.sherman-india.com'),
  openGraph: {
    title: 'Sherman International (P) Limited | Engineering Solutions',
    description:
      'Strategic bridge between leading global manufacturers and Indian industry. Flow measurement, combustion control, balancing machines, and railway electrification.',
    url: 'https://www.sherman-india.com',
    siteName: 'Sherman International',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/sherman-logo.png',
    apple: '/images/sherman-logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active categories with their published products for mega menu
  const categories = await prisma.productCategory.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isPublished: true },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          brand: { select: { name: true } },
        },
        orderBy: { displayOrder: 'asc' },
        take: 6,
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image: cat.image,
    icon: cat.icon,
    products: cat.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brandName: p.brand?.name || null,
      shortDescription: p.shortDescription,
    })),
  }));

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased bg-white text-slate-900 font-sans">
        <EnquiryProvider>
          <Header categories={formattedCategories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnquiryProvider>
      </body>
    </html>
  );
}
