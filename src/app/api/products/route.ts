import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const brandSlug = searchParams.get('brand');
  const featured = searchParams.get('featured');

  try {
    const where: any = { isPublished: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      categoryId,
      brandId,
      shortDescription,
      description,
      specifications,
      features,
      applications,
      image,
      isPublished,
      isFeatured,
      displayOrder,
    } = body;

    if (!name || !categoryId || !description) {
      return NextResponse.json(
        { error: 'Name, category, and description are required.' },
        { status: 400 }
      );
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        categoryId,
        brandId: brandId || null,
        shortDescription: shortDescription || null,
        description,
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || []),
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        applications: typeof applications === 'string' ? applications : JSON.stringify(applications || []),
        image: image || null,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.code === 'P2002' ? 'Product slug already exists' : 'Failed to create product' },
      { status: 500 }
    );
  }
}
