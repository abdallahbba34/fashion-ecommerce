import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Début de l\'upload...');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] Aucun fichier fourni');
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log('[Upload] Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      console.error('[Upload] Type invalide:', file.type);
      return NextResponse.json(
        {
          error: 'Type de fichier invalide. Utilisez JPG, PNG, WEBP ou GIF',
          receivedType: file.type,
          validTypes
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('[Upload] Fichier trop volumineux:', file.size);
      return NextResponse.json(
        {
          error: 'Fichier trop volumineux. Taille maximale : 5MB',
          receivedSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          maxSize: '5 MB'
        },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return URL
    const url = `/uploads/${filename}`;

    console.log('[Upload] ✅ Upload réussi:', url);

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
      message: 'Image uploadée avec succès'
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Upload] ❌ Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'upload du fichier',
        message: error?.message || 'Erreur inconnue',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
