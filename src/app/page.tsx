import React from 'react';
import prisma from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import CategoryGrid from '@/components/CategoryGrid';
import ServicesSection from '@/components/ServicesSection';
import IndustriesSection from '@/components/IndustriesSection';
import WeProudlyServeCarousel from '@/components/WeProudlyServeCarousel';
import WhyShermanSection from '@/components/WhyShermanSection';
import EnquiryCtaBanner from '@/components/EnquiryCtaBanner';
import { normalizeHeroContent, normalizeAboutContent } from '@/lib/content';

export const revalidate = 60; // Revalidate dynamic content every minute

export default async function HomePage() {
  // Fetch dynamic content and entities from database
  const [heroRecord, aboutRecord, categories, services, industries, proudlyServedClients] =
    await Promise.all([
      prisma.siteContent.findUnique({ where: { key: 'hero_section' } }),
      prisma.siteContent.findFirst({
        where: { key: { in: ['about_company', 'about_overview'] } },
      }),
      prisma.productCategory.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.industry.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.proudlyServedClient.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

  const heroContent = normalizeHeroContent(heroRecord);
  const aboutContent = normalizeAboutContent(aboutRecord);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <HeroSection
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        content={heroContent.content}
        image={heroContent.image}
      />

      {/* 2. ABOUT SHERMAN */}
      <AboutSection
        title={aboutContent.title}
        subtitle={aboutContent.subtitle}
        content={aboutContent.content}
      />

      {/* 3. PRODUCT CATEGORIES */}
      <CategoryGrid categories={categories} />

      {/* 4. SERVICES */}
      <ServicesSection services={services} />

      {/* 5. INDUSTRIES */}
      <IndustriesSection industries={industries} />

      {/* 6. WE PROUDLY SERVE - CLIENT LOGOS CAROUSEL */}
      <WeProudlyServeCarousel clients={proudlyServedClients} />

      {/* 7. WHY SHERMAN / TRUST SECTION */}
      <WhyShermanSection />

      {/* 8. ENQUIRY CTA BANNER */}
      <EnquiryCtaBanner />
    </div>
  );
}
