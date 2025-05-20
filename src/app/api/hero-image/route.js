import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Default hero image path
const DEFAULT_HERO_IMAGE = '/images/landscaping-image.png';

// Store the current hero image path
let currentHeroImage = DEFAULT_HERO_IMAGE;

export async function GET() {
  return NextResponse.json({ imageUrl: currentHeroImage });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('heroImage');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueId = uuidv4();
    const extension = file.name.split('.').pop();
    const filename = `hero-${uniqueId}.${extension}`;

    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(publicDir, filename);
    await writeFile(filepath, buffer);

    // Delete the previous image if it's not the default
    if (currentHeroImage !== DEFAULT_HERO_IMAGE) {
      try {
        const previousImagePath = join(process.cwd(), 'public', currentHeroImage);
        await unlink(previousImagePath);
      } catch (error) {
        console.error('Error deleting previous image:', error);
      }
    }

    // Update current hero image path
    currentHeroImage = `/uploads/${filename}`;

    return NextResponse.json({ 
      message: 'Hero image updated successfully',
      imageUrl: currentHeroImage 
    });
  } catch (error) {
    console.error('Error uploading hero image:', error);
    return NextResponse.json(
      { error: 'Error uploading hero image' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Only delete if it's not the default image
    if (currentHeroImage !== DEFAULT_HERO_IMAGE) {
      const imagePath = join(process.cwd(), 'public', currentHeroImage);
      await unlink(imagePath);
    }

    // Reset to default image
    currentHeroImage = DEFAULT_HERO_IMAGE;

    return NextResponse.json({ 
      message: 'Hero image deleted successfully',
      imageUrl: DEFAULT_HERO_IMAGE 
    });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json(
      { error: 'Error deleting hero image' },
      { status: 500 }
    );
  }
} 