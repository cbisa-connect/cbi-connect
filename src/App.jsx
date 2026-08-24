import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Linkedin,
  Globe,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import directorsData from "./data/directors.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------
// Helpers
// ----------------------------------------

const PUBLIC_SITE_URL = "https://cbisa-connect.github.io/cbi-connect";

function getContactUrl(slug) {
  return `${PUBLIC_SITE_URL}/#/${encodeURIComponent(slug)}`;
}

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

// ----------------------------------------
// UI Components
// ----------------------------------------

function Avatar({ person, large = false }) {
  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.name}
        className={cn(
          "shrink-0 rounded-full object-cover shadow-sm ring-4 ring-white",
          large ? "h-28 w-28" : "h-12 w-12"
        )}
      />
    );
  }
  
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white shadow-sm ring-4 ring-white",
        large ? "h-28 w-28 text-3xl" : "h-12 w-12 text-sm"
      )}
      style={{ backgroundColor: "var(--cbi-green)" }}
      aria-label={`Foto de ${person.name}`}
    >
      {person.initials}
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, href, onClick, disabled = false }) {
  const content = (
    <div className={cn(
      "flex items-center justify-between rounded-[24px] bg-white p-4 transition-all duration-200",
      disabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
      "border border-[var(--border)]"
    )}>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#F7F9F8] text-[var(--cbi-green)]">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight">{title}</span>
          <span className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5">{description}</span>
        </div>
      </div>
      {!disabled && <ChevronRight className="h-5 w-5 text-gray-300 mr-2" />}
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
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button 
      onClick={onClick} 
      className="w-full block text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.button>
  );
}

// ----------------------------------------
// Pages
// ----------------------------------------

function ExecutiveCard({ person }) {
  const phoneDigits = normalizePhone(person.phone);
  const waDigits = normalizePhone(person.whatsapp);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -16 }} 
      className="mx-auto w-full max-w-[520px] pb-12"
    >
      {/* Header Profile Section */}
      <div className="flex flex-col items-center pt-12 pb-8 px-6 text-center">
        <div className="mb-8 text-[var(--cbi-green)]">
          <Building2 className="h-10 w-10 mx-auto" strokeWidth={1.5} />
        </div>
        
        <Avatar person={person} large />
        
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {person.name}
        </h1>
        <p className="mt-1.5 text-[15px] font-medium text-[var(--cbi-green)]">
          {person.position}
        </p>
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {person.department}
        </p>
        
        {person.description && (
          <p className="mt-6 text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-sm mx-auto">
            {person.description}
          </p>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="px-5 space-y-3">
        {/* Main CTA */}
        <motion.button
          onClick={() => downloadVCard(person)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[24px] text-[15px] font-semibold text-white shadow-md mb-6"
          style={{ backgroundColor: "var(--cbi-green)" }}
        >
          <Download className="h-5 w-5" />
          Salvar contato
        </motion.button>

        <ActionCard 
          icon={Linkedin} 
          title="Conectar no LinkedIn" 
          description={person.linkedin ? "Perfil profissional" : "Não disponível"} 
          href={person.linkedin || undefined} 
          disabled={!person.linkedin}
        />
        <ActionCard 
          icon={Mail} 
          title="Enviar e-mail corporativo" 
          description={person.email} 
          href={`mailto:${person.email}`} 
        />
        <ActionCard 
          icon={Phone} 
          title="Ligar agora" 
          description={person.phone || "Não disponível"} 
          href={person.phone ? `tel:${phoneDigits}` : undefined} 
          disabled={!person.phone}
        />
        <ActionCard 
          icon={MessageCircle} 
          title="Iniciar conversa" 
          description={person.whatsapp ? "WhatsApp" : "Não disponível"} 
          href={person.whatsapp ? `https://wa.me/${waDigits}` : undefined} 
          disabled={!person.whatsapp}
        />
        <ActionCard 
          icon={Globe} 
          title="Conheça a CBI" 
          description="cbisa.com.br" 
          href="https://cbisa.com.br" 
        />
      </div>

      {/* Footer */}
      <div className="mt-12 text-center pb-8">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
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

  // Accept hashes like #/felipe-reis or #/director/felipe-reis or #/pages/felipe-reis
  const slug = currentHash.replace(/^#\/?(director\/|pages\/)?/, "");
  
  const contact = directorsData.find((item) => item.slug === slug && item.active);

  return (
    <div className="min-h-screen selection:bg-[var(--cbi-green-light)] selection:text-white flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {slug === "" ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20">
            <Building2 className="h-12 w-12 mx-auto text-[var(--cbi-green)] mb-6" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">CBI Connect</h1>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Cartão Executivo Digital</p>
            <div className="mt-12 rounded-[24px] bg-white p-8 border border-[var(--border)] max-w-sm mx-auto shadow-sm">
              <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">
                Utilize o QR Code ou o link individual disponibilizado pelo executivo da CBI.
              </p>
            </div>
          </motion.div>
        ) : contact ? (
          <ExecutiveCard key={contact.slug} person={contact} />
        ) : (
          <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-6 py-20">
            <div className="rounded-[24px] bg-white p-8 border border-[var(--border)] max-w-sm mx-auto shadow-sm">
              <p className="text-[14px] font-medium text-[var(--text-secondary)] leading-relaxed">
                Cartão não localizado. Verifique o link ou QR Code fornecido.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
