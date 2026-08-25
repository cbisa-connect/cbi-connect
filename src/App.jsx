import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Download,
  Globe,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import directorsData from "./data/directors.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PUBLIC_SITE_URL = "https://cbisa-connect.github.io/cbi-connect";

function normalizePhone(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

function downloadVCard(person) {
  const baseUrl = import.meta.env.PROD
    ? `${PUBLIC_SITE_URL}/`
    : import.meta.env.BASE_URL;
  
  const url = new URL(`${person.slug}.vcf`, baseUrl).toString();
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${person.slug}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function ActionCard({ icon: Icon, title, description, href, onClick, primary = false, external = false }) {
  const className = cn(
    "group flex min-h-[68px] w-full items-center gap-4 rounded-2xl border px-4 py-3.5",
    "transition-[transform,background-color,border-color,box-shadow] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cbi-primary)] focus-visible:ring-offset-2",
    primary
      ? "border-[var(--cbi-primary)] bg-[var(--cbi-primary)] text-white shadow-[0_12px_28px_rgba(15,74,59,0.18)]"
      : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[rgba(15,74,59,0.28)] hover:bg-[var(--surface-secondary)]"
  );
  
  const content = (
    <>
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          primary
            ? "bg-white/12 text-white"
            : "bg-[var(--cbi-primary-soft)] text-[var(--cbi-primary)]"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-semibold leading-tight">
          {title}
        </span>
        {description && (
          <span
            className={cn(
              "mt-1 block truncate text-[13px]",
              primary ? "text-white/72" : "text-[var(--text-secondary)]"
            )}
          >
            {description}
          </span>
        )}
      </span>
      <ChevronRight
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
          primary ? "text-white/60" : "text-[var(--text-secondary)]"
        )}
      />
    </>
  );
  
  if (href) {
    return (
      <motion.a 
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        whileTap={{ scale: 0.985 }}
      >
        {content}
      </motion.a>
    );
  }
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.985 }}
    >
      {content}
    </motion.button>
  );
}

function LinktreePage({ person }) {
  const phoneDigits = normalizePhone(person.phone);
  const waDigits = normalizePhone(person.whatsapp);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="mx-auto w-full min-h-[100dvh] pb-12 flex flex-col"
    >
      {/* Top Banner (Institucional Area) */}
      <div className="w-full bg-[var(--cbi-primary)] pt-12 pb-[72px] px-6 text-center relative overflow-hidden">
        {/* Subtle geometric detail */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, white 1%, transparent 40%)' }}></div>
        
        <img 
          src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} 
          alt="CBI Logo" 
          className="brand-logo mx-auto relative z-10" 
        />
        <div className="mt-4 inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm relative z-10 border border-white/20">
          <span className="text-[11px] font-semibold tracking-widest text-white uppercase">Cartão Executivo Digital</span>
        </div>
      </div>

      {/* Profile Card Section (Overlaps header) */}
      <div className="px-4 -mt-10 relative z-20">
        <div className="mx-auto w-full max-w-[460px] rounded-3xl bg-white p-6 text-center shadow-[var(--shadow)] border border-[var(--border)]">
          {/* Avatar */}
          <div className="mx-auto -mt-16 mb-4 flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[var(--cbi-primary-soft)] text-4xl font-bold text-[var(--cbi-primary)] shadow-md ring-4 ring-white">
            {person.photo ? (
              <img src={person.photo} alt={person.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              person.initials
            )}
          </div>
          
          <h1 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
            {person.name}
          </h1>
          <p className="mt-1.5 text-[15px] font-semibold text-[var(--cbi-primary)]">
            {person.position}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[var(--text-secondary)] uppercase tracking-wide">
            {person.department}
          </p>
          
          {person.description && (
            <p className="mt-5 text-[14px] leading-relaxed text-[var(--text-secondary)] max-w-sm mx-auto">
              {person.description}
            </p>
          )}

          {/* Quick Actions (3 buttons) */}
          <div className="mt-6 flex justify-center gap-3">
            {person.email && (
              <a href={`mailto:${person.email}`} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-secondary)] text-[var(--cbi-primary)] transition-all hover:bg-[var(--cbi-primary-soft)] hover:text-[var(--cbi-primary-strong)] active:scale-95">
                <Mail className="h-5 w-5" strokeWidth={1.8} />
              </a>
            )}
            {person.phone && (
              <a href={`tel:${phoneDigits}`} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-secondary)] text-[var(--cbi-primary)] transition-all hover:bg-[var(--cbi-primary-soft)] hover:text-[var(--cbi-primary-strong)] active:scale-95">
                <Phone className="h-5 w-5" strokeWidth={1.8} />
              </a>
            )}
            {person.whatsapp && (
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-secondary)] text-[var(--cbi-primary)] transition-all hover:bg-[var(--cbi-primary-soft)] hover:text-[var(--cbi-primary-strong)] active:scale-95">
                <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="mx-auto w-full max-w-[460px] px-4 pt-8 pb-10 space-y-3.5 flex flex-col">
        {person.linkedin && (
          <ActionCard 
            icon={Linkedin} 
            title="LinkedIn" 
            description="Perfil profissional" 
            href={person.linkedin} 
            external={true}
          />
        )}
        
        {person.email && (
          <ActionCard 
            icon={Mail} 
            title="E-mail corporativo" 
            description={person.email} 
            href={`mailto:${person.email}`} 
          />
        )}
        
        <ActionCard 
          icon={Globe} 
          title="Site da CBI" 
          description="cbisa.com.br" 
          href="https://cbisa.com.br" 
          external={true}
        />
        
        <div className="pt-2">
          <ActionCard 
            icon={Download} 
            title="Salvar contato" 
            description="Adicionar aos contatos" 
            onClick={() => downloadVCard(person)}
            primary={true}
          />
        </div>
      </div>

      <div className="mt-auto text-center px-6">
        <p className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
          Companhia Brasileira de Infraestrutura
        </p>
      </div>
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

  const slug = currentHash.replace(/^#\/?(director\/|pages\/)?/, "");
  const contact = directorsData.find((item) => item.slug === slug && item.active);

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--background)]">
      <AnimatePresence mode="wait">
        {slug === "" ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20 flex flex-col items-center justify-center min-h-[100dvh]">
            <img src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} alt="CBI Logo" className="brand-logo mb-8 rounded-lg bg-[var(--cbi-primary)] p-4" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">CBI Connect</h1>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium max-w-[280px]">
              Utilize o QR Code ou o link individual disponibilizado pelo executivo da CBI.
            </p>
          </motion.div>
        ) : contact ? (
          <LinktreePage key={contact.slug} person={contact} />
        ) : (
          <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20 flex flex-col items-center justify-center min-h-[100dvh]">
            <img src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} alt="CBI Logo" className="brand-logo mb-8 rounded-lg bg-[var(--cbi-primary)] p-4 opacity-50 grayscale" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Página não encontrada</h1>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium max-w-[280px]">
              Verifique o link ou QR Code escaneado.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
