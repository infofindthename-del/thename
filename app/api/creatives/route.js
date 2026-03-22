import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // chiave segreta, mai con NEXT_PUBLIC_
);

export async function GET() {
  const { data, error } = await supabase
    .from('creatives')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('creatives')
    .insert([body]);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(request) {
  const body = await request.json();
  const { error } = await supabase
    .from('creatives')
    .update(body)
    .eq('id', body.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { error } = await supabase
    .from('creatives')
    .update({ visible: false })
    .eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
