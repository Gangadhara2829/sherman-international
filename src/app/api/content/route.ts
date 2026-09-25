import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { normalizeWebsiteContent, parseContentValue } from '@/lib/content';

export async function GET() {
  try {
    const rawContents = await prisma.siteContent.findMany();
    const normalized = normalizeWebsiteContent(rawContents);
    return NextResponse.json({
      contents: rawContents,
      normalized,
    });
  } catch (error) {
    console.error('Failed to fetch site content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, section, title, subtitle, content, metadata, image } = body;

    if (!key) {
      return NextResponse.json({ error: 'Section key is required' }, { status: 400 });
    }

    // Fetch existing record to merge partial updates safely
    const existing = await prisma.siteContent.findUnique({ where: { key } });
    const existingMeta = parseContentValue(existing?.metadata) || {};
    const existingContentParsed = parseContentValue(existing?.content);

    let finalContent = content !== undefined ? content : existing?.content;
    let finalMetadata = metadata !== undefined ? metadata : existingMeta;

    // Handle special sections with structured objects
    if (key === 'vision_mission') {
      const vision =
        body.vision !== undefined
          ? body.vision
          : existingContentParsed?.vision || existing?.content || '';
      const mission =
        body.mission !== undefined
          ? body.mission
          : existingContentParsed?.mission || '';

      finalContent = JSON.stringify({
        vision: typeof vision === 'string' ? vision.trim() : vision,
        mission: typeof mission === 'string' ? mission.trim() : mission,
      });
    } else if (key === 'contact_info') {
      const company =
        body.company !== undefined
          ? body.company
          : existingContentParsed?.company || 'Sherman International (P) Limited';
      const address =
        body.address !== undefined
          ? body.address
          : existingContentParsed?.address || existing?.content || '';
      const phone =
        body.phone !== undefined
          ? body.phone
          : existingContentParsed?.phone || '011 23320623';
      const phoneSecondary =
        body.phoneSecondary !== undefined
          ? body.phoneSecondary
          : existingContentParsed?.phoneSecondary || '+91 98100 24890';
      const email =
        body.email !== undefined
          ? body.email
          : existingContentParsed?.email || 'admin@sherman-india.com';
      const workingHours =
        body.workingHours !== undefined
          ? body.workingHours
          : existingContentParsed?.workingHours || 'Monday to Friday: 9:30 AM – 6:00 PM IST';
      const whatsapp =
        body.whatsapp !== undefined
          ? body.whatsapp
          : existingContentParsed?.whatsapp || '+919810024890';
      const googleMapsUrl =
        body.googleMapsUrl !== undefined
          ? body.googleMapsUrl
          : existingContentParsed?.googleMapsUrl || '';

      finalContent = JSON.stringify({
        company,
        address,
        phone,
        phoneSecondary,
        email,
        workingHours,
        whatsapp,
        googleMapsUrl,
      });
    } else if (typeof finalContent === 'object' && finalContent !== null) {
      finalContent = JSON.stringify(finalContent);
    }

    const payload = {
      section: section || existing?.section || 'general',
      title: title !== undefined ? title : existing?.title,
      subtitle: subtitle !== undefined ? subtitle : existing?.subtitle,
      content: finalContent,
      metadata:
        typeof finalMetadata === 'string'
          ? finalMetadata
          : JSON.stringify(finalMetadata || {}),
      image: image !== undefined ? image : existing?.image,
    };

    const siteContent = await prisma.siteContent.upsert({
      where: { key },
      update: payload,
      create: {
        key,
        ...payload,
      },
    });

    // If saving about_overview, also sync about_company key (and vice-versa) for complete compatibility
    if (key === 'about_overview' || key === 'about_company') {
      const mirrorKey = key === 'about_overview' ? 'about_company' : 'about_overview';
      await prisma.siteContent.upsert({
        where: { key: mirrorKey },
        update: payload,
        create: {
          key: mirrorKey,
          ...payload,
        },
      }).catch((e) => console.warn('Mirror content sync warning:', e));
    }

    return NextResponse.json({ success: true, siteContent });
  } catch (error: any) {
    console.error('Failed to save content:', error);
    return NextResponse.json({ error: error.message || 'Failed to save content' }, { status: 500 });
  }
}
