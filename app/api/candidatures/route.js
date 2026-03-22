import { createClient } from '@supabase/supabase-js';

const supabasePublic = createClient(
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

export async function POST(request) {
  try {
    const body = await request.json();

    const { error } = await supabasePublic
      .from('candidatures')
      .insert([{
        nome: body.nome,
        email: body.email,           // ← campo email salvato
        eta: body.eta,
        citta: body.citta,
        travel: body.travel,
        aree: body.aree,
        ruoli: body.ruoli,
        assistente: body.assistente,
        preferenze: body.preferenze,
        esigenze: body.esigenze,
        portfolio: body.portfolio,
        foto_url: body.foto_url,
        budget: body.budget,         // ← campo budget salvato
        disponibilita: body.disponibilita, // ← campo disponibilità salvato
        status: 'pending'
      }]);

    if (error) throw error;

    // 1. Notifica admin
    await sendEmail(
      ['info.findthename@gmail.com'],
      `Nuova candidatura the[name] — ${body.nome}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#0d0b0a;">
        <h1 style="font-size:28px;font-weight:300;margin-bottom:4px;">the[name]</h1>
        <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7a7068;margin-bottom:32px;">Nuova candidatura ricevuta</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;width:140px;">Nome</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.nome || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Eta</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.eta || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Citta</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.citta || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Ruoli</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.ruoli || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Travel</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.travel || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:10px;text-transform:uppercase;color:#7a7068;">Preferenze</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d8;font-size:14px;">${body.preferenze || '—'}</td></tr>
          <tr><td style="padding:10px 0;font-size:10px;text-transform:uppercase;color:#7a7068;">Portfolio</td><td style="padding:10px 0;font-size:14px;">${body.portfolio ? `<a href="${body.portfolio}">${body.portfolio}</a>` : '—'}</td></tr>
        </table>
        <div style="margin-top:32px;padding:16px 20px;background:#f5f0eb;">
          <p style="font-size:12px;color:#7a7068;margin:0;">Accedi all'admin per approvare o aggiungere al network.</p>
        </div>
      </div>`
    );

    // 2. Email di ringraziamento al creativo (se ha fornito email)
    if (body.email) {
      const firstName = body.nome?.split(' ')[0] || '';
      await sendEmail(
        [body.email],
        `the[name] — candidatura ricevuta / application received`,
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0d0b0a;background:#f5f0eb;">
          <div style="background:#0d0b0a;padding:40px 40px 32px;">
            <div style="font-family:Georgia,serif;font-size:36px;font-weight:300;font-style:italic;color:#f5f0eb;margin-bottom:4px;">the[name]</div>
            <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#7a7068;">Network · Production Agency</div>
          </div>
          <div style="padding:48px 40px;">
            <p style="font-size:20px;font-weight:300;line-height:1.4;margin:0 0 32px;font-family:Georgia,serif;font-style:italic;color:#0d0b0a;">
              Ciao ${firstName},<br/>
              <span style="font-size:14px;color:#7a7068;font-style:normal;font-family:Arial,sans-serif;letter-spacing:1px;">Hi ${firstName},</span>
            </p>
            <p style="font-size:15px;font-weight:300;line-height:1.9;color:#444;margin:0 0 12px;">
              abbiamo ricevuto la tua candidatura. Grazie per aver scelto di far parte di <strong style="color:#0d0b0a;">the[name]</strong>.
            </p>
            <p style="font-size:13px;font-weight:300;line-height:1.9;color:#7a7068;margin:0 0 32px;font-style:italic;">
              We have received your application. Thank you for choosing to be part of the[name].
            </p>
            <p style="font-size:15px;font-weight:300;line-height:1.9;color:#444;margin:0 0 12px;">
              Il nostro team la valuterà e ti risponderemo entro <strong style="color:#0d0b0a;">7 giorni</strong>. La selezione è curatoriale — prendiamo il tempo necessario per farlo bene.
            </p>
            <p style="font-size:13px;font-weight:300;line-height:1.9;color:#7a7068;margin:0 0 40px;font-style:italic;">
              Our team will review it and get back to you within <strong>7 days</strong>. The selection is curatorial — we take the time needed to do it well.
            </p>
            <div style="background:#0d0b0a;padding:32px 40px;margin:0 -40px 40px;">
              <p style="color:#f5f0eb;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Nel frattempo · In the meantime</p>
              <div style="display:flex;gap:32px;flex-wrap:wrap;">
                <a href="https://www.instagram.com/findthename" target="_blank" style="color:#c8d622;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;">Instagram ↗</a>
                <a href="https://chat.whatsapp.com/thename" target="_blank" style="color:#c8d622;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-family:Arial,sans-serif;">WhatsApp ↗</a>
              </div>
            </div>
            <p style="font-size:13px;color:#7a7068;line-height:1.8;margin:0;">
              Per qualsiasi domanda · For any questions:<br/>
              <a href="mailto:info.findthename@gmail.com" style="color:#7a3e30;text-decoration:none;">info.findthename@gmail.com</a>
            </p>
          </div>
          <div style="padding:24px 40px;border-top:1px solid #e0d8d0;">
            <p style="font-size:10px;color:#aaa;letter-spacing:1px;margin:0;">
              the[name] · Unfold the unseen. Find the[name]. Be the[name].
            </p>
          </div>
        </div>`
      );
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error('Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('candidatures')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    // 1. Aggiorna lo status sulla candidatura e recupera i dati
    const { data: candidatura, error } = await supabaseAdmin
      .from('candidatures')
      .update({ status: body.status })
      .eq('id', body.id)
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });

    // 2. ✅ Inserisce in creatives SOLO se promote=true (evita duplicati)
    //    Il semplice "approva" NON inserisce — lo fa solo "Accetta al network"
    if (body.promote === true && candidatura) {
      const { error: creativeError } = await supabaseAdmin
        .from('creatives')
        .insert([{
          nome: candidatura.nome,
          email: candidatura.email,
          ruolo: candidatura.ruoli?.split(',')[0]?.trim() || candidatura.ruoli,
          citta: candidatura.citta,
          bio: candidatura.preferenze,
          tags: candidatura.aree ? candidatura.aree.split(',').map(s => s.trim()).filter(Boolean) : [],
          portfolio: candidatura.portfolio,
          availability: 'available',
          foto_url: candidatura.foto_url,
          visible: true,
        }]);

      if (creativeError) return Response.json({ error: creativeError.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error('Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  const { error } = await supabaseAdmin
    .from('candidatures')
    .delete()
    .eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
