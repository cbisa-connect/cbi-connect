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
  const url = `${import.meta.env.PROD ? PUBLIC_SITE_URL : ''}/${person.slug}.vcf`;
  const a = document.createElement("a");
  a.href = url;
  a.download = `${person.slug}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const LinkedinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ----------------------------------------
// UI Components
// ----------------------------------------

function ActionCard({ icon: Icon, title, description, href, onClick, disabled = false, primary = false }) {
  const content = (
    <div className={cn(
      "flex items-center justify-between rounded-xl px-5 py-4 w-full",
      primary 
        ? "bg-[var(--cbi-green)] text-white" 
        : "bg-white border border-[var(--border)] text-[var(--text-primary)] hover:border-gray-200",
      disabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-sm transition-all duration-200"
    )}>
      <div className="flex items-center gap-4 text-left">
        <Icon className={cn("h-[22px] w-[22px] shrink-0", primary ? "text-white" : "text-[var(--text-secondary)]")} strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold tracking-tight">{title}</span>
          {description && (
            <span className={cn("text-[13px] mt-0.5", primary ? "text-white/80" : "text-[var(--text-secondary)]")}>
              {description}
            </span>
          )}
        </div>
      </div>
      {!disabled && <ChevronRight className={cn("h-5 w-5 shrink-0", primary ? "text-white/80" : "text-gray-300")} />}
    </div>
  );

  if (disabled) {
    return <div className="w-full">{content}</div>;
  }

  if (href) {
    return (
      <motion.a 
        href={href}
        className="w-full block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button 
      onClick={onClick} 
      className="w-full block"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}

// ----------------------------------------
// Pages
// ----------------------------------------

function LinktreePage({ person }) {
  const phoneDigits = normalizePhone(person.phone);
  const waDigits = normalizePhone(person.whatsapp);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -12 }} 
      className="mx-auto w-full max-w-[520px] px-5 py-12 flex flex-col items-center"
    >
      {/* Header */}
      <img src={`${import.meta.env.BASE_URL}logo-cbi.png`} alt="CBI Logo" className="h-16 w-auto mb-6 rounded-lg object-contain" />
      
      <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center tracking-tight mb-1">
        {person.name}
      </h1>
      <p className="text-[15px] text-[var(--text-secondary)] font-medium text-center mb-10">
        {person.position}
      </p>

      {/* Links */}
      <div className="w-full space-y-3.5 flex flex-col">
        <ActionCard 
          icon={LinkedinIcon} 
          title="LinkedIn" 
          description="Perfil profissional" 
          href={person.linkedin || undefined} 
          disabled={!person.linkedin}
        />
        
        <ActionCard 
          icon={Mail} 
          title="E-mail corporativo" 
          description={person.email} 
          href={`mailto:${person.email}`} 
        />
        
        <ActionCard 
          icon={Phone} 
          title="Telefone" 
          description={person.phone || "Não disponível"} 
          href={person.phone ? `tel:${phoneDigits}` : undefined} 
          disabled={!person.phone}
        />
        
        <ActionCard 
          icon={MessageCircle} 
          title="WhatsApp" 
          description="Iniciar conversa" 
          href={person.whatsapp ? `https://wa.me/${waDigits}` : undefined} 
          disabled={!person.whatsapp}
        />
        
        <ActionCard 
          icon={Globe} 
          title="Site da CBI" 
          description="cbisa.com.br" 
          href="https://cbisa.com.br" 
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
    <div className="min-h-[100dvh] flex flex-col items-center justify-start sm:justify-center">
      <AnimatePresence mode="wait">
        {slug === "" ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20 flex flex-col items-center">
            <img src={`${import.meta.env.BASE_URL}logo-cbi.png`} alt="CBI Logo" className="h-16 w-auto mb-6 rounded-lg object-contain" />
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">CBI Connect</h1>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium max-w-[280px]">
              Utilize o QR Code ou o link individual disponibilizado pelo executivo da CBI.
            </p>
          </motion.div>
        ) : contact ? (
          <LinktreePage key={contact.slug} person={contact} />
        ) : (
          <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20 flex flex-col items-center">
            <img src={`${import.meta.env.BASE_URL}logo-cbi.png`} alt="CBI Logo" className="h-16 w-auto mb-6 rounded-lg object-contain grayscale opacity-50" />
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Página não encontrada</h1>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium max-w-[280px]">
              Verifique o link ou QR Code escaneado.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
