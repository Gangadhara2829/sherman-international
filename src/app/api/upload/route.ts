import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminSession } from '@/lib/auth';
import { validateImageFile } from '@/lib/image';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate image format and file size
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const timestamp = Date.now();
    const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    const filename = `${timestamp}-${cleanName}`;

    // Target directory: public/uploads/{folder}
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '');
    const targetDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFolder}/${filename}`;

    // Track in MediaAsset if possible
    try {
      await prisma.mediaAsset.create({
        data: {
          fileName: filename,
          fileUrl: publicUrl,
          fileType: file.type,
          fileSize: file.size,
          altText: cleanName.replace(/\.[^/.]+$/, ''),
        },
      });
    } catch (e) {
      // Non-blocking if mediaAsset log fails
    }

    return NextResponse.json({ url: publicUrl, filename, size: file.size, type: file.type });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
