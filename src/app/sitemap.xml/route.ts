import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sherman-india.com';

  const [categories, products, services, industries, brands] = await Promise.all([
    prisma.productCategory.findMany({ where: { isActive: true } }),
    prisma.product.findMany({ where: { isPublished: true }, include: { category: true } }),
    prisma.service.findMany({ where: { isPublished: true } }),
    prisma.industry.findMany({ where: { isPublished: true } }),
    prisma.brand.findMany({ where: { isActive: true } }),
  ]);

  const staticPages = ['', '/products', '/services', '/industries', '/brands', '/about', '/contact'];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${path === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('')}

  ${categories
    .map(
      (cat) => `
    <url>
      <loc>${baseUrl}/products/${cat.slug}</loc>
      <lastmod>${cat.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('')}

  ${products
    .map(
      (p) => `
    <url>
      <loc>${baseUrl}/products/${p.category.slug}/${p.slug}</loc>
      <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('')}

  ${services
    .map(
      (s) => `
    <url>
      <loc>${baseUrl}/services/${s.slug}</loc>
      <lastmod>${s.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}

  ${industries
    .map(
      (ind) => `
    <url>
      <loc>${baseUrl}/industries/${ind.slug}</loc>
      <lastmod>${ind.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}

  ${brands
    .map(
      (b) => `
    <url>
      <loc>${baseUrl}/brands/${b.slug}</loc>
      <lastmod>${b.updatedAt.toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
