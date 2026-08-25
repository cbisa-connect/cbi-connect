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

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
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
    "group flex min-h-[68px] w-full items-center gap-4 rounded-2xl border px-4 py-3.5",
    "transition-[transform,background-color,border-color,box-shadow] duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--cbi-primary)] focus-visible:ring-offset-2",
    primary
      ? [
          "border-[var(--cbi-primary)]",
          "bg-[var(--cbi-primary)]",
          "text-white",
          "shadow-[0_12px_28px_rgba(15,74,59,0.18)]",
          "hover:bg-[var(--cbi-primary-strong)]"
        ]
      : [
          "border-[var(--border)]",
          "bg-white",
          "text-[var(--text-primary)]",
          "hover:border-[rgba(15,74,59,0.28)]",
          "hover:bg-[var(--surface-secondary)]"
        ]
  );

  const content = (
    <>
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          primary
            ? "bg-white/10 text-white"
            : "bg-[var(--cbi-primary-soft)] text-[var(--cbi-primary)]"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-semibold leading-tight">
          {title}
        </span>

        {description && (
          <span
            className={cn(
              "mt-1 block truncate text-[13px]",
              primary ? "text-white/75" : "text-[var(--text-secondary)]"
            )}
          >
            {description}
          </span>
        )}
      </span>

      <ChevronRight
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200",
          "group-hover:translate-x-0.5",
          primary ? "text-white/60" : "text-[var(--text-secondary)]"
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

function QuickAction({ href, label, external = false, children }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "grid h-12 w-12 place-items-center rounded-xl",
        "bg-[var(--surface-secondary)] text-[var(--cbi-primary)]",
        "transition-colors duration-200",
        "hover:bg-[var(--cbi-primary-soft)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--cbi-primary)] focus-visible:ring-offset-2"
      )}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.a>
  );
}

function ExecutivePage({ person }) {
  const phoneDigits = normalizePhone(person.phone);
  const whatsappDigits = normalizePhone(person.whatsapp);
  const initials = person.initials || getInitials(person.name);

  const photoUrl = person.photo
    ? `${import.meta.env.BASE_URL}${person.photo.replace(/^\/+/, "")}`
    : "";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100dvh] w-full flex-col pb-10"
    >
      <header
        className={cn(
          "relative overflow-hidden bg-[var(--cbi-primary)]",
          "px-6 pb-[76px] pt-10 text-center"
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 82% 10%, rgba(255,255,255,.36), transparent 35%)"
          }}
        />

        <img 
          src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} 
          alt="CBI Logo" 
          className="brand-logo mx-auto relative z-10" 
        />

        <span
          className={cn(
            "relative z-10 mt-4 inline-flex rounded-full",
            "border border-white/20 bg-white/10 px-3 py-1",
            "text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
          )}
        >
          Cartão executivo digital
        </span>
      </header>

      <section className="relative z-20 -mt-10 px-4">
        <div
          className={cn(
            "mx-auto w-full max-w-[460px] rounded-[28px]",
            "border border-[var(--border)] bg-white px-6 pb-6 pt-5",
            "text-center shadow-[var(--shadow)]"
          )}
        >
          <div
            className={cn(
              "mx-auto -mt-[70px] mb-4 grid h-[104px] w-[104px]",
              "place-items-center overflow-hidden rounded-full",
              "bg-[var(--cbi-primary-soft)]",
              "text-3xl font-bold text-[var(--cbi-primary)]",
              "ring-4 ring-white"
            )}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={person.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span aria-label={`Iniciais de ${person.name}`}>{initials}</span>
            )}
          </div>

          <h1 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--text-primary)]">
            {person.name}
          </h1>

          <p className="mt-2 text-[15px] font-semibold leading-snug text-[var(--cbi-primary)]">
            {person.position}
          </p>

          {person.department && (
            <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
              {person.department}
            </p>
          )}

          {person.description && (
            <p className="mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)]">
              {person.description}
            </p>
          )}

          <div className="mt-6 flex justify-center gap-3">
            {person.email && (
              <QuickAction href={`mailto:${person.email}`} label="E-mail">
                <Mail className="h-5 w-5" strokeWidth={1.8} />
              </QuickAction>
            )}

            {person.phone && (
              <QuickAction href={`tel:+${phoneDigits}`} label="Ligar">
                <Phone className="h-5 w-5" strokeWidth={1.8} />
              </QuickAction>
            )}

            {person.whatsapp && (
              <QuickAction href={`https://wa.me/${whatsappDigits}`} label="WhatsApp" external>
                <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              </QuickAction>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-[460px] flex-col gap-3.5 px-4 pb-10 pt-7">
        {person.linkedin && (
          <ActionCard icon={Linkedin} title="LinkedIn" description="Perfil profissional" href={person.linkedin} external />
        )}

        {person.email && (
          <ActionCard icon={Mail} title="E-mail corporativo" description={person.email} href={`mailto:${person.email}`} />
        )}

        {person.phone && (
          <ActionCard icon={Phone} title="Telefone" description={person.phone} href={`tel:+${phoneDigits}`} />
        )}

        {person.whatsapp && (
          <ActionCard icon={MessageCircle} title="WhatsApp" description="Iniciar conversa" href={`https://wa.me/${whatsappDigits}`} external />
        )}

        <ActionCard
          icon={Globe}
          title="Site institucional"
          description="Companhia Brasileira de Infraestrutura"
          href="https://cbisa.com.br"
          external
        />

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

      <footer className="mt-auto px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Companhia Brasileira de Infraestrutura
        </p>
      </footer>
    </motion.main>
  );
}

function EmptyState({ notFound = false }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid min-h-[100dvh] place-items-center px-6 py-16"
    >
      <div className="flex max-w-[340px] flex-col items-center text-center">
        <div className="rounded-2xl bg-[var(--cbi-primary)] p-5 shadow-[var(--shadow)]">
          <img src={`${import.meta.env.BASE_URL}logo-cbi-bco.png`} alt="CBI Logo" className="brand-logo" />
        </div>

        <h1 className="mt-7 text-2xl font-bold text-[var(--text-primary)]">
          {notFound ? "Página não encontrada" : "CBI Connect"}
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {notFound
            ? "Verifique o link ou o QR Code utilizado."
            : "Acesse o cartão executivo pelo link ou QR Code individual disponibilizado pela CBI."}
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
    <div className="min-h-[100dvh] w-full bg-[var(--background)]">
      <AnimatePresence mode="wait">
        {!slug ? (
          <EmptyState key="home" />
        ) : contact ? (
          <ExecutivePage key={contact.slug} person={contact} />
        ) : (
          <EmptyState key="not-found" notFound />
        )}
      </AnimatePresence>
    </div>
  );
}
