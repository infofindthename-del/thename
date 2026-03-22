import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Colors matching the[name] brand
const INK = rgb(0.051, 0.043, 0.039);
const TERRA = rgb(0.478, 0.243, 0.188);
const MID = rgb(0.478, 0.439, 0.408);
const LIME = rgb(0.784, 0.839, 0.133);
const OFF = rgb(0.961, 0.941, 0.922);

async function createPDF(type, data) {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const form = pdfDoc.getForm();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const margin = 56;
  const contentWidth = width - margin * 2;

  function addField(name, x, y, w, h, value = '') {
    const field = form.createTextField(name);
    field.setText(value);
    field.addToPage(page, {
      x, y, width: w, height: h,
      borderWidth: 0,
      backgroundColor: rgb(0.96, 0.94, 0.92),
      textColor: INK,
      font: helvetica,
      fontSize: 11,
    });
    field.setFontSize(11);
  }

  function text(str, x, y, opts = {}) {
    if (!str) return;
    page.drawText(String(str), {
      x, y,
      size: opts.size || 10,
      font: opts.font || helvetica,
      color: opts.color || INK,
      maxWidth: opts.maxWidth || contentWidth,
    });
  }

  function line(y, x1 = margin, x2 = width - margin, color = MID, thickness = 0.5) {
    page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
  }

  function rect(x, y, w, h, color) {
    page.drawRectangle({ x, y, width: w, height: h, color });
  }

  // HEADER
  rect(0, height - 72, width, 72, INK);
  text('the[name]', margin, height - 36, { font: timesItalic, size: 22, color: OFF });
  text('Network · Production Agency', margin, height - 52, { font: helvetica, size: 8, color: rgb(0.7, 0.7, 0.65) });

  const titles = {
    candidatura: 'TALENT FORM',
    booking: 'BOOKING CONFIRMATION',
    quotation: 'PRODUCTION QUOTATION',
    nda: 'NON-DISCLOSURE AGREEMENT',
    licensing: 'IMAGE LICENSING AGREEMENT',
  };
  const titleStr = titles[type] || type.toUpperCase();
  const titleW = helveticaBold.widthOfTextAtSize(titleStr, 10);
  text(titleStr, width - margin - titleW, height - 40, { font: helveticaBold, size: 10, color: LIME });

  const dateStr = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateW = helvetica.widthOfTextAtSize(dateStr, 8);
  text(dateStr, width - margin - dateW, height - 56, { size: 8, color: rgb(0.6, 0.6, 0.55) });

  let y = height - 100;

  if (type === 'candidatura') {
    text('DATI CANDIDATO', margin, y, { font: helveticaBold, size: 9, color: TERRA });
    y -= 6; line(y); y -= 20;

    const fields1 = [
      ['Nome e Cognome', 'nome', data.nome],
      ['Email', 'email', data.email || ''],
      ['Età', 'eta', data.eta],
      ['Città di residenza', 'citta', data.citta],
    ];

    fields1.forEach(([label, name, val]) => {
      text(label.toUpperCase(), margin, y, { size: 8, color: MID, font: helveticaBold });
      y -= 4;
      addField(`field_${name}`, margin, y - 20, contentWidth, 22, val || '');
      y -= 34;
    });

    y -= 8;
    text('RUOLO PROFESSIONALE', margin, y, { font: helveticaBold, size: 9, color: TERRA });
    y -= 6; line(y); y -= 20;

    text('Ruoli selezionati', margin, y, { size: 8, color: MID, font: helveticaBold });
    y -= 4;
    addField('field_ruoli', margin, y - 20, contentWidth, 22, data.ruoli || '');
    y -= 34;

    text('DISPONIBILITÀ', margin, y, { size: 8, color: MID, font: helveticaBold });
    y -= 4;
    addField('field_travel', margin, y - 20, contentWidth / 2 - 8, 22, data.travel || '');
    addField('field_aree', margin + contentWidth / 2 + 8, y - 20, contentWidth / 2 - 8, 22, data.aree || '');
    y -= 34;

    y -= 8;
    text('PREFERENZE E PORTFOLIO', margin, y, { font: helveticaBold, size: 9, color: TERRA });
    y -= 6; line(y); y -= 20;

    text('Tipo di progetti preferiti', margin, y, { size: 8, color: MID, font: helveticaBold });
    y -= 4;
    addField('field_preferenze', margin, y - 40, contentWidth, 44, data.preferenze || '');
    y -= 58;

    text('Esigenze particolari', margin, y, { size: 8, color: MID, font: helveticaBold });
    y -= 4;
    addField('field_esigenze', margin, y - 40, contentWidth, 44, data.esigenze || '');
    y -= 58;

    text('Link portfolio / sito', margin, y, { size: 8, color: MID, font: helveticaBold });
    y -= 4;
    addField('field_portfolio', margin, y - 22, contentWidth, 22, data.portfolio || '');
    y -= 36;

    y -= 8;
    rect(margin - 8, y - 80, contentWidth + 16, 90, rgb(0.95, 0.92, 0.89));
    text('LIBERATORIA E CONSENSO AL TRATTAMENTO DATI (GDPR UE 2016/679)', margin, y - 12, { font: helveticaBold, size: 8, color: TERRA });
    const libText = 'Il/La sottoscritto/a dichiara di autorizzare the[name] all\'utilizzo del materiale fornito per scopi di presentazione sulla piattaforma, nel rispetto del GDPR UE 2016/679. I dati non saranno ceduti a terzi. Revoca: info.findthename@gmail.com';
    text(libText, margin, y - 28, { size: 8, color: MID, maxWidth: contentWidth });
    y -= 90;

    y -= 16;
    text('FIRMA', margin, y, { font: helveticaBold, size: 9, color: TERRA });
    y -= 6; line(y); y -= 28;

    text('Luogo e Data', margin, y, { size: 8, color: MID });
    addField('field_luogo_data', margin, y - 22, contentWidth / 2 - 16, 22, data.citta || '');

    text('Firma', margin + contentWidth / 2 + 8, y, { size: 8, color: MID });
    addField('field_firma', margin + contentWidth / 2 + 8, y - 22, contentWidth / 2 - 8, 22, '');

  } else {
    const sections = {
      booking: [
        { title: 'INFORMAZIONI PROGETTO', fields: [
          ['N. Documento', 'docNum', data.docNum],
          ['Nome Progetto', 'projectName', data.projectName],
          ['Data Servizio', 'serviceDate', data.serviceDate],
          ['Luogo', 'serviceLocation', data.serviceLocation],
          ['Descrizione', 'projectDesc', data.projectDesc],
        ]},
        { title: 'DATI CLIENTE', fields: [
          ['Azienda', 'clientName', data.clientName],
          ['Referente', 'clientContact', data.clientContact],
          ['Email', 'clientEmail', data.clientEmail],
          ['P.IVA', 'clientVat', data.clientVat],
        ]},
        { title: 'CREATIVI E COMPENSI', fields: [
          ['Talent 1 — Nome | Ruolo | Compenso', 't1', `${data.t1Name || ''} | ${data.t1Role || ''} | EUR ${data.t1Fee || ''}`],
          ['Talent 2 — Nome | Ruolo | Compenso', 't2', `${data.t2Name || ''} | ${data.t2Role || ''} | EUR ${data.t2Fee || ''}`],
          ['Talent 3 — Nome | Ruolo | Compenso', 't3', `${data.t3Name || ''} | ${data.t3Role || ''} | EUR ${data.t3Fee || ''}`],
        ]},
        { title: 'FEE E DIRITTI', fields: [
          ['Fee the[name] (EUR)', 'agencyFee', data.agencyFee],
          ['Utilizzi concessi', 'usageRights', data.usageRights],
          ['Territorio', 'territory', data.territory],
          ['Durata', 'duration', data.duration],
          ['Revisioni incluse', 'revisions', data.revisions],
        ]},
      ],
      nda: [
        { title: 'PARTI', fields: [
          ['Parte Divulgante', 'disclosingParty', data.disclosingParty],
          ['Email Divulgante', 'disclosingEmail', data.disclosingEmail],
          ['Parte Ricevente', 'receivingParty', data.receivingParty],
          ['Email Ricevente', 'receivingEmail', data.receivingEmail],
        ]},
        { title: 'PROGETTO', fields: [
          ['Nome Progetto', 'projectName', data.projectName],
          ['Descrizione', 'projectDesc', data.projectDesc],
          ['Durata riservatezza (anni)', 'ndaDuration', data.ndaDuration],
          ['Foro competente', 'jurisdiction', data.jurisdiction],
        ]},
      ],
      licensing: [
        { title: 'PARTI', fields: [
          ['Licenziante (Creativo)', 'talentName', data.talentName],
          ['Licenziatario (Cliente)', 'clientName', data.clientName],
          ['Email Cliente', 'clientEmail', data.clientEmail],
        ]},
        { title: 'CONTENUTO LICENZIATO', fields: [
          ['N. Licenza', 'licenseNumber', data.licenseNumber],
          ['Descrizione materiale', 'contentDesc', data.contentDesc],
          ['Progetto', 'projectName', data.projectName],
          ['Numero file', 'fileCount', data.fileCount],
          ['Formati', 'fileFormats', data.fileFormats],
        ]},
        { title: 'UTILIZZO E CORRISPETTIVO', fields: [
          ['Tipo licenza', 'licenseType', data.licenseType],
          ['Media / Canali', 'usageMedia', data.usageMedia],
          ['Territorio', 'territory', data.territory],
          ['Durata', 'usageDuration', data.usageDuration],
          ['Fee EUR + IVA 22%', 'licenseFee', data.licenseFee],
        ]},
      ],
    };

    const docSections = sections[type] || sections['nda'];

    docSections.forEach(section => {
      if (y < 120) return;
      text(section.title, margin, y, { font: helveticaBold, size: 9, color: TERRA });
      y -= 6; line(y); y -= 20;

      section.fields.forEach(([label, name, val]) => {
        if (y < 80) return;
        text(label.toUpperCase(), margin, y, { size: 7, color: MID, font: helveticaBold });
        y -= 4;
        const isLong = label.includes('Descrizione') || label.includes('Utilizzi');
        const fieldH = isLong ? 44 : 22;
        addField(`field_${name}`, margin, y - fieldH, contentWidth, fieldH, val || '');
        y -= (fieldH + 14);
      });
      y -= 12;
    });

    if (y > 120) {
      text('FIRME', margin, y, { font: helveticaBold, size: 9, color: TERRA });
      y -= 6; line(y); y -= 28;

      text('Luogo e Data', margin, y, { size: 8, color: MID });
      addField('field_luogo_data', margin, y - 24, 180, 24, '');

      text('Firma the[name]', margin + 200, y, { size: 8, color: MID });
      addField('field_firma1', margin + 200, y - 24, 140, 24, '');

      text('Firma Cliente', margin + 360, y, { size: 8, color: MID });
      addField('field_firma2', margin + 360, y - 24, 140, 24, '');
    }
  }

  // FOOTER
  rect(0, 0, width, 36, INK);
  text('the[name] · info.findthename@gmail.com · Documento modificabile — compilare i campi in grigio', margin, 14, { size: 7, color: rgb(0.5, 0.5, 0.45) });

  return await pdfDoc.save();
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    const pdfBytes = await createPDF(type, data || {});

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="thename-${type}-${Date.now()}.pdf"`,
      },
    });
  } catch (e) {
    console.error('PDF error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
