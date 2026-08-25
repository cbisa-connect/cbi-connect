import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Download,
  Globe,
  Mail,
  MessageCircle,
  Phone
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import directorsData from "./data/directors.json";

const Linkedin = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PUBLIC_SITE_URL = "https://cbisa-connect.github.io/cbi-connect/";

function normalizePhone(phone) {
  return phone ? phone.replace(/\D/g, "") : "";
}

function downloadVCard(person) {
  const fileName = `${person.slug}.vcf`;

  const url = import.meta.env.PROD
    ? new URL(fileName, PUBLIC_SITE_URL).toString()
    : `${window.location.origin}${import.meta.env.BASE_URL}${fileName}`;

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  primary = false,
  external = false
}) {
  const className = cn(
    "group flex min-h-[76px] w-full items-center gap-4",
    "rounded-2xl border px-4 py-3.5",
    "transition-[background-color,border-color,transform] duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--focus-ring)]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--cbi-bg)]",
    primary
      ? [
          "border-[rgba(45,212,191,0.24)]",
          "bg-[var(--cbi-surface-active)]",
          "text-[var(--text-primary)]",
          "hover:border-[var(--border-hover)]",
          "hover:bg-[#1a5145]"
        ]
      : [
          "border-[var(--border)]",
          "bg-[var(--cbi-surface)]",
          "text-[var(--text-primary)]",
          "hover:border-[var(--border-hover)]",
          "hover:bg-[var(--cbi-surface-hover)]"
        ]
  );
  
  const content = (
    <>
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center",
          "rounded-xl border",
          primary
            ? [
                "border-[rgba(45,212,191,0.22)]",
                "bg-[var(--cbi-accent-soft)]",
                "text-[var(--cbi-accent-hover)]"
              ]
            : [
                "border-[var(--border)]",
                "bg-[var(--cbi-accent-soft)]",
                "text-[var(--cbi-accent)]"
              ]
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span
          className={cn(
            "block text-[15px] font-semibold leading-tight",
            primary && "uppercase tracking-[0.02em]"
          )}
        >
          {title}
        </span>
        {description && (
          <span className="mt-1 block truncate text-[13px] text-[var(--text-secondary)]">
            {description}
          </span>
        )}
      </span>
      <ChevronRight
        className={cn(
          "h-5 w-5 shrink-0",
          "text-[var(--text-muted)]",
          "transition-transform duration-200",
          "group-hover:translate-x-0.5"
        )}
        aria-hidden="true"
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
        whileTap={{ scale: 0.988 }}
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
      whileTap={{ scale: 0.988 }}
    >
      {content}
    </motion.button>
  );
}

function LinkPage({ person }) {
  const phoneDigits = normalizePhone(person.phone);
  const whatsappDigits = normalizePhone(person.whatsapp);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-[var(--cbi-bg)] text-[var(--text-primary)]"
    >
      <div className="mx-auto w-[calc(100%-40px)] max-w-[660px] pb-10 pt-8 sm:pt-12">
        <header className="mb-8 text-center">
          <img 
            src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} 
            alt="CBI Logo" 
            className="brand-logo mx-auto" 
          />
          <h1 className="mt-8 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[36px]">
            {person.name}
          </h1>
          <p className="mt-3 text-[16px] font-semibold text-[var(--cbi-accent)]">
            {person.position}
          </p>
          {person.department && (
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              {person.department}
            </p>
          )}
        </header>

        <section
          className="flex flex-col gap-3"
          aria-label={`Links de contato de ${person.name}`}
        >
          {person.linkedin && (
            <ActionCard
              icon={Linkedin}
              title="LinkedIn"
              description="Perfil profissional"
              href={person.linkedin}
              external
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

          {person.phone && (
            <ActionCard
              icon={Phone}
              title="Telefone"
              description={person.phone}
              href={`tel:+${phoneDigits}`}
            />
          )}

          {person.whatsapp && (
            <ActionCard
              icon={MessageCircle}
              title="WhatsApp"
              description="Iniciar conversa"
              href={`https://wa.me/${whatsappDigits}`}
              external
            />
          )}

          {person.website && (
            <ActionCard
              icon={Globe}
              title="Site institucional"
              description={person.website.replace(/^https?:\/\//, '')}
              href={person.website}
              external
            />
          )}

          <div className="pt-2">
            <ActionCard
              icon={Download}
              title="Salvar contato"
              description="Adicionar à agenda do celular"
              onClick={() => downloadVCard(person)}
              primary
            />
          </div>
        </section>

        <footer className="pt-8 text-center">
          <span className="text-[11px] text-[var(--text-muted)]">
            © CBI
          </span>
        </footer>
      </div>
    </motion.main>
  );
}

function EmptyState({ notFound = false }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid min-h-[100dvh] place-items-center px-6 py-16 bg-[var(--cbi-bg)] text-[var(--text-primary)]"
    >
      <div className="flex max-w-[340px] flex-col items-center text-center">
        <img 
          src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} 
          alt="CBI Logo" 
          className="brand-logo mb-6" 
        />

        <h1 className="mt-7 text-2xl font-bold text-[var(--text-primary)]">
          {notFound ? "Página não encontrada" : "CBI Connect"}
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {notFound
            ? "Verifique o link ou o QR Code utilizado."
            : "Acesse o cartão executivo pelo link individual disponibilizado pela CBI."}
        </p>
      </div>
    </motion.main>
  );
}

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    function handleHashChange() {
      setCurrentHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const slug = currentHash
    .replace(/^#\/?/, "")
    .replace(/^(director|pages)\//, "")
    .replace(/\/+$/, "");

  const contact = directorsData.find(
    (item) => item.slug === slug && item.active === true
  );

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--cbi-bg)]">
      <AnimatePresence mode="wait">
        {!slug ? (
          <EmptyState key="home" />
        ) : contact ? (
          <LinkPage key={contact.slug} person={contact} />
        ) : (
          <EmptyState key="not-found" notFound />
        )}
      </AnimatePresence>
    </div>
  );
}
