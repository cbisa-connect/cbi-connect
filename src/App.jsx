import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import {
  Building2,
  Mail,
  Phone,
  MessageCircle,
  Download,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Basic UI components
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-950 disabled:pointer-events-none disabled:opacity-50",
      variant === "default" && "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90",
      variant === "outline" && "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow", className)} {...props} />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const BRAND = {
  green: "#008444",
  dark: "#004438",
  ink: "#0F172A",
  muted: "#64748B",
  surface: "#FFFFFF",
  background: "#F5F8F6",
  line: "#DDE9E3",
};

const people = [
  {
    slug: "felipe-reis",
    name: "Felipe Reis",
    role: "Coordenação de Relações com Investidores",
    email: "felipe.reis@cbisa.com.br",
    phone: "",
    linkedin: "",
    initials: "FR",
    active: true,
  },
  {
    slug: "alessandro-hidalgo",
    name: "Alessandro Hidalgo",
    role: "Diretoria Comercial e Operações",
    email: "alessandro.hidalgo@cbisa.com.br",
    phone: "",
    linkedin: "",
    initials: "AH",
    active: true,
  },
  {
    slug: "andre-pereira",
    name: "André Pereira",
    role: "Diretoria Administrativa, Financeira e Tecnologia",
    email: "andre.pereira@cbisa.com.br",
    phone: "",
    linkedin: "",
    initials: "AP",
    active: true,
  },
];

const PUBLIC_SITE_URL = "https://theydreez.github.io/cbi-connect";

function getContactUrl(slug) {
  return `${PUBLIC_SITE_URL}/#/${encodeURIComponent(slug)}`;
}

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

function downloadVCard(person) {
  const url = `${import.meta.env.PROD ? PUBLIC_SITE_URL : ''}/${person.slug}.vcf`;
  const a = document.createElement("a");
  a.href = url;
  a.download = `${person.slug}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${compact ? "h-9 w-9" : "h-11 w-11"} grid place-items-center rounded-2xl text-white shadow-lg`}
        style={{ background: `linear-gradient(145deg, ${BRAND.green}, ${BRAND.dark})` }}
      >
        <Building2 className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </div>
      <div>
        <div className="text-lg font-black tracking-tight" style={{ color: BRAND.dark }}>CBI</div>
        {!compact && <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Connect</div>}
      </div>
    </div>
  );
}

function Avatar({ person, large = false }) {
  return (
    <div
      className={`${large ? "h-24 w-24 text-2xl" : "h-12 w-12 text-sm"} grid shrink-0 place-items-center rounded-3xl font-black text-white shadow-lg`}
      style={{ background: `linear-gradient(145deg, ${BRAND.green}, ${BRAND.dark})` }}
      aria-label={`Foto de ${person.name} ainda não cadastrada`}
    >
      {person.initials}
    </div>
  );
}

function ActionButton({ icon: Icon, label, href, onClick, primary = false, disabled = false }) {
  const cls = `flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : primary ? "text-white shadow-lg hover:brightness-105" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`;
  const style = primary && !disabled ? { background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.dark})` } : undefined;
  if (href && !disabled) return <a className={cls} style={style} href={href}><Icon className="h-4 w-4" />{label}</a>;
  return <button className={cls} style={style} onClick={disabled ? undefined : onClick} disabled={disabled}><Icon className="h-4 w-4" />{label}</button>;
}

function ContactPage({ person }) {
  const [copied, setCopied] = useState(false);
  const pageUrl = getContactUrl(person.slug);
  const phoneDigits = normalizePhone(person.phone || "");
  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="mx-auto w-full max-w-xl">
      <Card className="overflow-hidden rounded-[32px] border-0 bg-white shadow-[0_30px_80px_rgba(0,68,56,0.14)] ring-1 ring-emerald-950/5">
        <div className="relative h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.dark})` }}>
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" />
          <div className="absolute -bottom-24 left-12 h-44 w-44 rounded-full bg-white/10 blur-sm" />
          <div className="absolute left-6 top-6"><BrandMark compact /></div>
          <div className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">Cartão digital</div>
        </div>
        <CardContent className="relative px-6 pb-7 pt-0 sm:px-8">
          <div className="-mt-12 flex items-end justify-between gap-4">
            <Avatar person={person} large />
            <div className="mb-1 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="mr-1 inline h-4 w-4" /> CBI
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-2xl font-black tracking-tight text-slate-950">{person.name}</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{person.role}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Companhia Brasileira de Infraestrutura</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <ActionButton icon={Phone} label={person.phone ? "Ligar" : "Telefone pendente"} href={person.phone ? `tel:${person.phone}` : undefined} disabled={!person.phone} />
            <ActionButton icon={MessageCircle} label={person.phone ? "WhatsApp" : "WhatsApp pendente"} href={person.phone ? `https://wa.me/${phoneDigits}` : undefined} disabled={!person.phone} />
            <ActionButton icon={Mail} label="E-mail" href={`mailto:${person.email}`} />
            <ActionButton icon={Download} label="Salvar contato" onClick={() => downloadVCard(person)} primary />
          </div>
          <div className="mt-7 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                <QRCode value={pageUrl} size={132} fgColor={BRAND.dark} bgColor="#FFFFFF" />
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h2 className="text-sm font-extrabold text-slate-900">Compartilhe este contato</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Aponte a câmera para o QR Code ou copie o link do cartão.</p>
                <Button onClick={copyLink} variant="outline" className="mt-3 h-9 rounded-xl border-slate-200 bg-white text-xs font-bold">
                  {copied ? <Check className="mr-2 h-4 w-4 text-emerald-600" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Link copiado" : "Copiar link"}
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-400">
            <span>CBI Connect</span>
            <span>Contato corporativo digital</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const slug = currentHash.replace(/^#\//, "");
  const contact = people.find((item) => item.slug === slug && item.active);

  return (
    <div className="min-h-screen" style={{ background: BRAND.background }}>
      <header className="sticky top-0 z-20 border-b border-emerald-950/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <BrandMark />
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><ShieldCheck className="h-4 w-4" /> Ambiente CBI</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <AnimatePresence mode="wait">
          {slug === "" ? (
             <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-20 text-center">
               <h1 className="text-3xl font-black text-slate-900">CBI Connect</h1>
               <p className="mt-2 text-lg text-slate-500">Contato corporativo digital</p>
               <div className="mt-12 rounded-3xl bg-white p-10 ring-1 ring-slate-200 max-w-md mx-auto shadow-sm">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                   Utilize o QR Code ou o link individual disponibilizado pelo colaborador da CBI.
                 </p>
               </div>
             </motion.div>
          ) : contact ? (
            <ContactPage key={contact.slug} person={contact} />
          ) : (
             <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-20 text-center">
               <div className="rounded-3xl bg-white p-10 ring-1 ring-slate-200 max-w-md mx-auto shadow-sm">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                   Cartão não localizado. Utilize o endereço ou QR Code fornecido pelo colaborador da CBI.
                 </p>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
