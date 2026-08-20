import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const people = [
  {
    slug: "felipe-reis",
    name: "Felipe Reis",
    role: "Coordenação de Relações com Investidores",
    email: "felipe.reis@cbisa.com.br",
    phone: "",
    linkedin: "",
  },
  {
    slug: "alessandro-hidalgo",
    name: "Alessandro Hidalgo",
    role: "Diretoria Comercial e Operações",
    email: "alessandro.hidalgo@cbisa.com.br",
    phone: "",
    linkedin: "",
  },
  {
    slug: "andre-pereira",
    name: "André Pereira",
    role: "Diretoria Administrativa, Financeira e Tecnologia",
    email: "andre.pereira@cbisa.com.br",
    phone: "",
    linkedin: "",
  },
];

const PUBLIC_SITE_URL = "https://cbisa-connect.github.io/cbi-connect";
const BRAND_DARK = "#004438";

function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

function makeVCard(person) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${person.name}`,
    "ORG:Companhia Brasileira de Infraestrutura",
    `TITLE:${person.role}`,
    person.phone ? `TEL;TYPE=CELL:+${normalizePhone(person.phone)}` : "",
    `EMAIL;TYPE=WORK:${person.email}`,
    person.linkedin ? `URL:${person.linkedin}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

async function generateFiles() {
  const publicDir = path.resolve(__dirname, '../public');
  const qrDir = path.join(publicDir, 'exports/qr-codes');
  
  // Ensure directories exist
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  for (const person of people) {
    // Generate vCard
    const vcardContent = makeVCard(person);
    fs.writeFileSync(path.join(publicDir, `${person.slug}.vcf`), vcardContent);
    console.log(`Generated ${person.slug}.vcf`);

    const url = `${PUBLIC_SITE_URL}/#/${person.slug}`;
    
    // Generate SVG QR Code
    const svgCode = await QRCode.toString(url, {
      type: 'svg',
      color: {
        dark: BRAND_DARK,
        light: '#FFFFFF'
      },
      width: 512,
      margin: 2
    });
    fs.writeFileSync(path.join(qrDir, `qr-${person.slug}.svg`), svgCode);
    console.log(`Generated qr-${person.slug}.svg`);

    // Generate PNG QR Code
    await QRCode.toFile(path.join(qrDir, `qr-${person.slug}.png`), url, {
      color: {
        dark: BRAND_DARK,
        light: '#FFFFFF'
      },
      width: 512,
      margin: 2
    });
    console.log(`Generated qr-${person.slug}.png`);
  }
}

generateFiles().catch(console.error);
