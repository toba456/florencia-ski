import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('reviews GET error:', err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const reviewerName = formData.get('reviewer_name');
    const ratingRaw = formData.get('rating');
    const text = formData.get('text');
    const image = formData.get('image');

    if (
      typeof reviewerName !== 'string' ||
      !reviewerName.trim() ||
      typeof text !== 'string' ||
      !text.trim() ||
      typeof ratingRaw !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rating = Number(ratingRaw);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    if (reviewerName.length > 100 || text.length > 1000) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    let imageUrl: string | null = null;

    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
      }
      if (image.size > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 });
      }

      const extension = EXTENSION_BY_MIME[image.type] ?? 'jpg';
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const bytes = new Uint8Array(await image.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(fileName, bytes, { contentType: image.type });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('reviews').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      reviewer_name: reviewerName.trim(),
      rating,
      text: text.trim(),
      image_url: imageUrl,
      approved: false,
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('reviews POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
