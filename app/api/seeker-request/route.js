import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sendEmail(to, subject, html) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'the[name] <onboarding@resend.dev>', to, subject, html }),
  });
}

// ── POST: salva richiesta + invia email ───────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from('seeker_requests')
      .insert([{
        nome: body.nome,
        azienda: body.azienda,
        email: body.email,
        cerca: body.cerca,
        progetto: body.progetto,
        date_start: body.dateStart || null,
        date_end: body.dateEnd || null,
        budget: body.budget,
        note: body.note,
        status: 'new',
      }]);

    if (error) throw error;

    // 1. Notifica admin
    await sendEmail(
      ['info.findthename@gmail.com'],
      `Nuova richiesta seeker the[name] — ${body.azienda || body.nome}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#0d0b0a;">
        <div style="font-family:Georgia,serif;font-size:28px;font-weight:300;font-style:italic;margin-bottom:4px;">the[name]</div>
        <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;margin-bottom:32px;">Nuova richiesta seeker ricevuta</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;width:140px;">Nome</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.nome || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Azienda</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.azienda || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.email || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Cerca</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.cerca || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Progetto</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.progetto || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Budget</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.budget || '—'}</td></tr>
          <tr><td style="padding:10px 0;font-size:10px;text-transform:uppercase;color:#7a7068;">Note</td><td style="padding:10px 0;font-size:14px;">${body.note || '—'}</td></tr>
        </table>
        <div style="margin-top:32px;padding:16px 20px;background:#f5f0eb;">
          <p style="font-size:12px;color:#7a7068;margin:0;">Accedi all'admin per gestire la richiesta e fare il match con i creativi.</p>
        </div>
      </div>`
    );

    // 2. Conferma al seeker
    if (body.email) {
      const firstName = body.nome?.split(' ')[0] || '';
      await sendEmail(
        [body.email],
        `the[name] — richiesta ricevuta`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0d0b0a;background:#f5f0eb;">
          <div style="background:#0d0b0a;padding:40px 40px 32px;">
            <div style="font-family:Georgia,serif;font-size:36px;font-weight:300;font-style:italic;color:#f5f0eb;margin-bottom:4px;">the[name]</div>
            <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7a7068;">Network · Production Agency</div>
          </div>
          <div style="padding:48px 40px;">
            <p style="font-size:20px;font-weight:300;line-height:1.4;margin:0 0 32px;font-family:Georgia,serif;font-style:italic;">Ciao ${firstName},</p>
            <p style="font-size:15px;font-weight:300;line-height:1.9;color:#444;margin:0 0 12px;">
              Abbiamo ricevuto la tua richiesta per <strong style="color:#0d0b0a;">${body.cerca}</strong>.
              Il nostro team la valuterà e ti contatteremo entro <strong style="color:#0d0b0a;">24 ore</strong> con una selezione di profili su misura.
            </p>
            <p style="font-size:13px;color:#7a7068;line-height:1.8;margin:32px 0 0;">
              Per qualsiasi domanda:<br/>
              <a href="mailto:info.findthename@gmail.com" style="color:#7a3e30;text-decoration:none;">info.findthename@gmail.com</a>
            </p>
          </div>
          <div style="padding:24px 40px;border-top:1px solid #e0d8d0;">
            <p style="font-size:10px;color:#aaa;letter-spacing:1px;margin:0;">the[name] · Unfold the unseen. Find the[name]. Be the[name].</p>
          </div>
        </div>`
      );
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error('Seeker request error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ── GET: lista richieste ──────────────────────────────────────────
export async function GET() {
  const { data, error } = await supabase
    .from('seeker_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}

// ── PATCH: aggiorna stato ─────────────────────────────────────────
export async function PATCH(request) {
  const body = await request.json();
  const { error } = await supabase
    .from('seeker_requests')
    .update({ status: body.status })
    .eq('id', body.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
