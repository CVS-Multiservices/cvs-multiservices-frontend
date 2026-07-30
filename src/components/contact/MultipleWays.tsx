import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import dataService from "../../services/dataService";

interface ContactInfoItem {
  icon?: string;
  title?: string;
  lines?: string[];
  actionLabel?: string;
  actionUrl?: string;
  _id?: any;
}

interface Branch {
  id?: string;
  label?: string;
  city?: string;
  mapUrl?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const parsePhone = (line: string) => {
  const match = line.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/);
  return {
    number: match?.[1].trim() || line,
    label: match?.[2]?.trim() || "",
  };
};

const parseEmail = (line: string) => {
  const match = line.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/);
  return {
    email: match?.[1].trim() || line,
    label: match?.[2]?.trim() || "",
  };
};

const tel = (num: string) => `tel:${num.replace(/\s+/g, "")}`;
const mail = (email: string) => `mailto:${email}`;

export default function MultipleWays() {
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [hqMapUrl, setHqMapUrl] = useState<string>(""); // ✅ HQ map url
  const [loading, setLoading] = useState(true);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [contactRes, linksRes] = await Promise.all([
          dataService.getContact(),
          dataService.getLinks(),
        ]);

        if (contactRes.success && contactRes.data.length) {
          const entry = contactRes.data[0];
          setContactInfo(entry.contactInfo ?? []);

          // ✅ Extract HQ mapUrl from branches
          const branches: Branch[] = entry.branches ?? [];
          const hq = branches.find((b) => b.id === "hq") ?? branches[0];
          if (hq?.mapUrl) setHqMapUrl(hq.mapUrl);
        }

        if (linksRes.success && linksRes.data.length) {
          const phone = linksRes.data[0].whatsappChat
            ?.replace(/\+/g, "")
            .replace(/\s/g, "");

          if (phone) {
            setWhatsappUrl(
              `https://wa.me/${phone}?text=${encodeURIComponent(
                "Hello CVS Multi Services!"
              )}`
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const cards = useMemo(() => {
    return contactInfo.filter((item) => {
      const t = item.title?.toLowerCase() ?? "";
      return (
        t === "our address" ||
        t === "phone numbers" ||
        t === "email addresses" ||
        t === "working hours"
      );
    });
  }, [contactInfo]);

  if (loading || !cards.length) return null;

  /* ─── PHONE CARD ──────────────────────────────────────────── */
  function PhoneCard({ lines = [] }: { lines?: string[] }) {
    return (
      <div className="space-y-2.5">
        {lines.map((line, index) => {
          const { number, label } = parsePhone(line);
          return (
            <a
              key={index}
              href={tel(number)}
              className="group/item flex items-center gap-3 p-3 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-x-1"
              style={{
                background: "rgba(5,13,26,0.4)",
                border: "1px solid rgba(212,160,23,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,160,23,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(5,13,26,0.4)";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.1)";
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212,160,23,0.15)" }}
                >
                  <Icons.Phone
                    className="w-4 h-4"
                    style={{ color: "#d4a017" }}
                  />
                </div>
                <div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#25d366" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-0.5 truncate"
                  style={{ color: "#d4a017" }}
                >
                  {label || "General Enquiry"}
                </div>
                <div className="text-sm font-semibold text-white truncate transition-colors group-hover/item:text-yellow-200">
                  {number}
                </div>
              </div>

              <Icons.PhoneCall
                className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                style={{ color: "#d4a017" }}
              />
            </a>
          );
        })}
      </div>
    );
  }

  /* ─── EMAIL CARD ──────────────────────────────────────────── */
  function EmailCard({ lines = [] }: { lines?: string[] }) {
    return (
      <div className="space-y-2.5">
        {lines.map((line, index) => {
          const { email, label } = parseEmail(line);
          return (
            <a
              key={index}
              href={mail(email)}
              className="group/item flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:translate-x-1"
              style={{
                background: "rgba(5,13,26,0.4)",
                border: "1px solid rgba(212,160,23,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,160,23,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(5,13,26,0.4)";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.1)";
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,160,23,0.15)" }}
              >
                <Icons.Mail className="w-4 h-4" style={{ color: "#d4a017" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-0.5 truncate"
                  style={{ color: "#d4a017" }}
                >
                  {label || "Primary Email"}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white truncate transition-colors group-hover/item:text-yellow-200">
                  {email}
                </div>
              </div>

              <Icons.Send
                className="w-4 h-4 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                style={{ color: "#d4a017" }}
              />
            </a>
          );
        })}
      </div>
    );
  }

  /* ─── ADDRESS CARD (with Get Directions button) ──────────── */
  function AddressCard({
    lines = [],
    mapUrl,
  }: {
    lines?: string[];
    mapUrl?: string;
  }) {
    return (
      <div className="flex flex-col gap-3 h-full">
        {/* Address block */}
        <div
          className="p-4 rounded-xl relative overflow-hidden flex-1"
          style={{
            background: "rgba(5,13,26,0.4)",
            border: "1px solid rgba(212,160,23,0.1)",
          }}
        >
          {/* Corner accent */}
          <div
            className="absolute top-0 left-0 w-8 h-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.3), transparent)",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          />

          <div className="flex items-start gap-2 mb-3">
            <Icons.Building2
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: "#d4a017" }}
            />
            <div
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#d4a017" }}
            >
              Head Office
            </div>
          </div>

          <div className="space-y-1">
            {lines.map((line, index) => (
              <p
                key={index}
                className="text-xs sm:text-sm leading-relaxed"
                style={{
                  color:
                    index === lines.length - 1
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.65)",
                  fontWeight: index === lines.length - 1 ? 600 : 400,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ✅ Get Directions button (only if mapUrl exists) */}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden"
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "#d4a017",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#d4a017";
              e.currentTarget.style.color = "#050d1a";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(212,160,23,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(212,160,23,0.1)";
              e.currentTarget.style.color = "#d4a017";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Icons.Navigation className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-12" />
            Get Directions
            <Icons.ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>
        )}
      </div>
    );
  }

  /* ─── HOURS CARD ──────────────────────────────────────────── */
  function HoursCard({ lines = [] }: { lines?: string[] }) {
    return (
      <div
        className="p-4 rounded-xl relative overflow-hidden h-full"
        style={{
          background: "rgba(5,13,26,0.4)",
          border: "1px solid rgba(212,160,23,0.1)",
        }}
      >
        <div className="space-y-2.5">
          {lines.map((line, index) => {
            const closed = /closed|sunday/i.test(line);
            const days =
              /monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(
                line
              ) && !/\d/.test(line);
            const time = /\d.*[apAP][mM]|\d:\d/.test(line);

            return (
              <div
                key={index}
                className="flex items-center gap-2 text-xs sm:text-sm"
                style={{
                  color: closed
                    ? "rgba(255,100,100,0.85)"
                    : days
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.65)",
                }}
              >
                {days && !closed && (
                  <Icons.Calendar
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "#d4a017" }}
                  />
                )}
                {time && (
                  <Icons.Clock
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "#d4a017" }}
                  />
                )}
                {closed && (
                  <Icons.XCircle
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "rgba(255,100,100,0.85)" }}
                  />
                )}
                <span className={days && !closed ? "font-semibold" : ""}>
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── CONTACT CARD WRAPPER ────────────────────────────────── */
  function ContactCard({
    item,
    index,
  }: {
    item: ContactInfoItem;
    index: number;
  }) {
    const title = item.title?.toLowerCase() ?? "";
    const Icon = (Icons as any)[item.icon || "Settings"] || Icons.Settings;

    return (
      <AnimatedSection delay={index * 0.08}>
        <motion.div
          whileHover={{ y: -8 }}
          className="group h-full rounded-3xl relative overflow-hidden flex flex-col transition-all duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,36,71,0.6) 0%, rgba(10,36,71,0.3) 100%)",
            border: "1px solid rgba(212,160,23,0.15)",
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(212,160,23,0.4)";
            el.style.boxShadow =
              "0 25px 70px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.1)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(212,160,23,0.15)";
            el.style.boxShadow = "none";
          }}
        >
          {/* Top gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, #d4a017, transparent)",
            }}
          />

          {/* Floating decorative circle */}
          <div
            className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle, #d4a017, transparent)",
            }}
          />

          {/* Header */}
          <div className="p-6 pb-4 relative">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))",
                  border: "1px solid rgba(212,160,23,0.3)",
                  boxShadow: "0 8px 20px rgba(212,160,23,0.1)",
                }}
              >
                <Icon className="w-6 h-6" style={{ color: "#d4a017" }} />
              </div>

              <div className="flex-1 pt-1">
                <h3 className="font-bold text-white text-base xl:text-lg leading-tight">
                  {item.title}
                </h3>
                <div
                  className="mt-1.5 h-0.5 w-8 transition-all duration-500 group-hover:w-16"
                  style={{ background: "#d4a017" }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 flex-1 flex flex-col">
            {title === "phone numbers" && <PhoneCard lines={item.lines} />}
            {title === "email addresses" && <EmailCard lines={item.lines} />}
            {title === "our address" && (
              <AddressCard lines={item.lines} mapUrl={hqMapUrl} />
            )}
            {title === "working hours" && <HoursCard lines={item.lines} />}
          </div>

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
            style={{
              background: "linear-gradient(90deg, #d4a017, transparent)",
            }}
          />
        </motion.div>
      </AnimatedSection>
    );
  }

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ background: "#080f1e" }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(212,160,23,1) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12 lg:mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(212,160,23,0.1)",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <Icons.Sparkles
                className="w-3.5 h-3.5"
                style={{ color: "#d4a017" }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#d4a017" }}
              >
                Get in Touch
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl xl:text-5xl font-bold text-white mb-4">
              Multiple Ways to{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #d4a017 0%, #f5c93d 50%, #d4a017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Reach Us
              </span>
            </h2>

            <div
              className="w-20 h-0.5 mx-auto mb-4"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #d4a017, transparent)",
              }}
            />

            <p
              className="text-sm sm:text-base max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Choose the most convenient way to connect with our team. We're
              here to help.
            </p>
          </div>
        </AnimatedSection>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
          {cards.map((item, index) => (
            <ContactCard
              key={item._id?.$oid || item.title}
              item={item}
              index={index}
            />
          ))}
        </div>

        {/* WhatsApp CTA */}
        <AnimatedSection>
          <div className="mt-10 lg:mt-14 flex flex-col items-center gap-4">
            <div
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              — Or Reach Out Instantly —
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #25d366, #128c7e)",
                  boxShadow: "0 15px 40px rgba(37,211,102,0.4)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shine 1.5s infinite",
                  }}
                />

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">Chat on WhatsApp</div>
                </div>
                <Icons.ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}