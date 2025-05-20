import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const HERO_IMAGE_FILE = path.join(process.cwd(), 'data', 'hero-image.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read hero image from file
async function readHeroImage() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(HERO_IMAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return default image
    return { imageUrl: '/images/landscaping-image.png' };
  }
}

// Write hero image to file
async function writeHeroImage(imageUrl) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(HERO_IMAGE_FILE, JSON.stringify({ imageUrl }));
    return true;
  } catch (error) {
    console.error('Error writing hero image:', error);
    return false;
  }
}

// Get hero image
export async function GET() {
  try {
    const heroImage = await readHeroImage();
    return NextResponse.json(heroImage);
  } catch (error) {
    console.error('Error getting hero image:', error);
    return NextResponse.json(
      { error: 'Failed to get hero image' },
      { status: 500 }
    );
  }
}

// Update hero image
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('heroImage');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    // Save to file
    const success = await writeHeroImage(imageUrl);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save hero image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error updating hero image:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image' },
      { status: 500 }
    );
  }
}

// Delete hero image
export async function DELETE() {
  try {
    // Reset to default image
    const success = await writeHeroImage('/images/landscaping-image.png');
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete hero image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: '/images/landscaping-image.png' });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero image' },
      { status: 500 }
    );
  }
} 