import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const formData = await request.formData();
    const file = formData.get('file');
    const nome = formData.get('nome') || 'unknown';

    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${nome.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, buffer, { contentType: file.type, upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    return Response.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error('Upload error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
