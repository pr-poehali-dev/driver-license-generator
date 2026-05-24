import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface FormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  idNumber: string;
  licenseNumber: string;
  categories: string[];
  photoUrl: string;
}

const CATEGORIES = ["A1", "A2", "A", "B1", "B", "C1", "C", "D1", "D", "BE", "C1E", "CE", "D1E", "DE", "F", "H", "I"];

const defaultForm: FormData = {
  lastName: "MORARUȘ",
  firstName: "TATIANA",
  birthDate: "15.04.1982",
  birthPlace: "MDA CHIȘINĂU",
  issueDate: "06.08.2015",
  expiryDate: "06.08.2025",
  issuedBy: "OFICIUL 00",
  idNumber: "0000000000000",
  licenseNumber: "000000000",
  categories: ["B"],
  photoUrl: "",
};

/* ─── Card dimensions (ID-1 standard) ─── */
const W = 500;
const H = 315;

function LicensePreview({ form }: { form: FormData }) {
  return (
    <div
      id="license-preview"
      style={{
        width: W, height: H,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        fontFamily: "'IBM Plex Sans', sans-serif",
        boxShadow: "0 12px 48px rgba(20,40,120,0.28), 0 2px 8px rgba(20,40,120,0.14)",
        userSelect: "none",
      }}
    >
      {/* ── Background: left blue-purple, right pink-violet ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(105deg, #c8d8f0 0%, #d0c8e8 38%, #e8c8dc 62%, #e0c8e8 100%)",
      }} />

      {/* ── Diamond grid pattern (left half, blue) ── */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <pattern id="diamonds" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect x="8" y="8" width="16" height="16" rx="2"
              stroke="#4466cc" strokeWidth="0.9" fill="none"
              transform="rotate(45 16 16)" />
          </pattern>
          {/* pink/golden flower watermark center-right */}
          <pattern id="flowers" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="8" stroke="#c8a060" strokeWidth="0.6" fill="none" opacity="0.35" />
            <circle cx="24" cy="24" r="14" stroke="#c8a060" strokeWidth="0.4" fill="none" opacity="0.2" />
            <line x1="24" y1="10" x2="24" y2="38" stroke="#c8a060" strokeWidth="0.4" opacity="0.25" />
            <line x1="10" y1="24" x2="38" y2="24" stroke="#c8a060" strokeWidth="0.4" opacity="0.25" />
            <line x1="14" y1="14" x2="34" y2="34" stroke="#c8a060" strokeWidth="0.3" opacity="0.2" />
            <line x1="34" y1="14" x2="14" y2="34" stroke="#c8a060" strokeWidth="0.3" opacity="0.2" />
          </pattern>
        </defs>
        {/* blue diamonds — covers full card, more visible on left */}
        <rect x="0" y="0" width={W * 0.55} height={H} fill="url(#diamonds)" opacity="0.55" />
        <rect x={W * 0.55} y="0" width={W * 0.45} height={H} fill="url(#diamonds)" opacity="0.18" />
        {/* golden flower pattern — center-right area */}
        <rect x={W * 0.32} y="0" width={W * 0.6} height={H} fill="url(#flowers)" opacity="0.7" />
      </svg>

      {/* ── Vertical right strip text watermark ── */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 46, width: 22,
        background: "rgba(60,80,160,0.08)",
        borderLeft: "1px solid rgba(60,80,160,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        writingMode: "vertical-rl",
        fontSize: 5.5, letterSpacing: 1.8, color: "#3355aa",
        opacity: 0.55, fontWeight: 600, textTransform: "uppercase",
        overflow: "hidden",
      }}>
        PERMIS DE CONDUCERE · REPUBLICA · CONDUCERE ·
      </div>

      {/* ── TOP HEADER ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 22, height: 48,
        background: "rgba(255,255,255,0.42)",
        borderBottom: "1.5px solid rgba(60,100,200,0.18)",
        display: "flex", alignItems: "center",
        padding: "0 14px", gap: 12,
      }}>
        {/* MD badge */}
        <div style={{
          width: 42, height: 30, border: "2.5px solid #1a44bb",
          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.85)", flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: "#1a44bb", letterSpacing: 0.5 }}>MD</span>
        </div>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11.5, fontWeight: 800, color: "#1a44bb",
            letterSpacing: 2.5, lineHeight: 1.2,
          }}>
            PERMIS DE CONDUCERE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 1 }}>
            <div style={{ width: 1, height: 12, background: "#1a44bb", opacity: 0.4 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1a44bb", letterSpacing: 2 }}>REPUBLICA MOLDOVA</span>
          </div>
        </div>

        {/* Coat of arms — right */}
        <div style={{
          width: 38, height: 42, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          {/* Shield shape */}
          <svg width="38" height="42" viewBox="0 0 38 42">
            <path d="M19 2 L36 10 L36 26 Q36 38 19 42 Q2 38 2 26 L2 10 Z"
              fill="none" stroke="#1a44bb" strokeWidth="1.2" opacity="0.6" />
            <text x="19" y="26" textAnchor="middle" fontSize="16" fill="#1a44bb" opacity="0.7">🦅</text>
          </svg>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{
        position: "absolute", top: 48, left: 0, right: 22, bottom: 46,
        display: "flex", padding: "10px 14px 6px 12px", gap: 14,
      }}>

        {/* Photo column */}
        <div style={{ width: 96, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Main photo */}
          <div style={{
            width: 96, height: 118,
            border: "1.5px solid rgba(40,70,180,0.25)",
            borderRadius: 4,
            background: "rgba(190,205,230,0.35)",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="фото"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(100%) contrast(1.05)" }} />
            ) : (
              <div style={{ textAlign: "center", opacity: 0.35 }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>👤</div>
                <div style={{ fontSize: 6, color: "#2244aa", marginTop: 3, letterSpacing: 1 }}>PHOTO</div>
              </div>
            )}
          </div>

          {/* Small duplicate photo — bottom right of column */}
          <div style={{
            width: 48, height: 58, alignSelf: "flex-end",
            border: "1px solid rgba(40,70,180,0.2)",
            borderRadius: 3,
            background: "rgba(190,205,230,0.2)",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {form.photoUrl ? (
              <img src={form.photoUrl} alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(100%) contrast(1.05) opacity(0.6)" }} />
            ) : (
              <div style={{ fontSize: 14, opacity: 0.2 }}>👤</div>
            )}
          </div>
        </div>

        {/* Data fields */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4.5 }}>

          {/* 1. Last name */}
          <Row num="1." value={form.lastName} size={14} bold />

          {/* 2. First name */}
          <Row num="2." value={form.firstName} size={14} bold />

          {/* 3. Birth date + place */}
          <Row num="3." value={`${form.birthDate}  ${form.birthPlace}`} size={12} mono />

          {/* 4a 4b */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <Row num="4a." value={form.issueDate} size={12} mono />
            <Row num="4b." value={form.expiryDate} size={12} mono />
          </div>

          {/* 4c */}
          <Row num="4c." value={form.issuedBy} size={12} mono />

          {/* 4d */}
          <Row num="4d." value={form.idNumber} size={12} mono />

          {/* 5. License number */}
          <Row num="5." value={form.licenseNumber} size={12} mono />

          {/* 7. Signature */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 8, color: "#1a44bb", fontWeight: 700, minWidth: 18 }}>7.</span>
            <svg width="130" height="34" viewBox="0 0 130 34">
              <path
                d="M4 26 C10 26 12 10 20 16 C28 22 30 8 40 14 C50 20 52 6 62 12 C72 18 76 8 88 14 C96 18 100 10 110 16 C116 20 120 16 126 18"
                stroke="#222" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
              <path d="M4 28 C12 28 18 28 26 28" stroke="#222" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES BOTTOM BAR ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 22, height: 46,
        background: "rgba(248,248,252,0.75)",
        borderTop: "1.5px solid rgba(60,80,180,0.2)",
        display: "flex", alignItems: "center",
        padding: "0 10px", gap: 0,
        overflow: "hidden",
      }}>
        <span style={{ fontSize: 7.5, color: "#1a44bb", fontWeight: 800, marginRight: 5 }}>9.</span>

        {/* Scrolling label strip above */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 2, flex: 1 }}>
          {CATEGORIES.map((cat) => {
            const active = form.categories.includes(cat);
            const isItalic = cat === "F" || cat === "H" || cat === "I";
            return (
              <div key={cat} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
              }}>
                <div style={{
                  minWidth: cat.length >= 3 ? 22 : 18,
                  height: 30,
                  border: "1.5px solid #1a44bb",
                  borderRadius: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? "#1a44bb" : "rgba(255,255,255,0.8)",
                  padding: "0 2px",
                }}>
                  <span style={{
                    fontSize: cat.length >= 3 ? 6 : 8,
                    fontWeight: 800,
                    color: active ? "#fff" : "#1a44bb",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontStyle: isItalic ? "italic" : "normal",
                    letterSpacing: -0.3,
                    lineHeight: 1,
                  }}>
                    {cat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MRZ / lower text strip ── */}
      <div style={{
        position: "absolute", bottom: 46, left: 0, right: 22, height: 12,
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 5, color: "#3355aa", opacity: 0.35,
          letterSpacing: 1.5, fontFamily: "'IBM Plex Mono', monospace",
          padding: "0 10px", whiteSpace: "nowrap", lineHeight: "12px",
        }}>
          ТЕЛСТВО ЗА УПРАВЛЕНИЕ НА МПС · PERMISO DE · PRUKAZ · KØRERT · LICENCJA TAS-SEWQAN · RIJBEWIJS · PRAWO JAZDY · CARTA DE CONDUCERE · VODIČ · VOZNIŠKA · VAIRUOTOJO PAŽYMĖJIMAS
        </div>
      </div>
    </div>
  );
}

/* Helper row component */
function Row({ num, value, size, bold, mono }: {
  num: string; value: string; size: number; bold?: boolean; mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{ fontSize: 7.5, color: "#1a44bb", fontWeight: 700, minWidth: 20, flexShrink: 0 }}>{num}</span>
      <span style={{
        fontSize: size,
        fontWeight: bold ? 800 : 600,
        color: "#1a1a2e",
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif",
        letterSpacing: bold ? 0.4 : 0.2,
        lineHeight: 1.2,
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */

export default function Generator({
  onSave,
}: {
  onSave?: (entry: { id: string; data: FormData; date: string }) => void;
}) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
    setSaved(false);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update("photoUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const entry = { id: Date.now().toString(), data: form, date: new Date().toLocaleString("ru-RU") };
    const existing = JSON.parse(localStorage.getItem("license_history") || "[]");
    localStorage.setItem("license_history", JSON.stringify([entry, ...existing]));
    onSave?.(entry);
    setSaved(true);
  };

  const handleDownload = async (format: "pdf" | "png") => {
    const el = document.getElementById("license-preview");
    if (!el) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `ву_${form.lastName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [85.6, 53.98] });
        pdf.addImage(imgData, "JPEG", 0, 0, 85.6, 53.98);
        pdf.save(`ву_${form.lastName}.pdf`);
      }
    } finally {
      setDownloading(false);
    }
  };

  const fields: { label: string; key: keyof FormData; placeholder?: string; span?: boolean }[] = [
    { label: "Фамилия (1)", key: "lastName", placeholder: "MORARUȘ" },
    { label: "Имя (2)", key: "firstName", placeholder: "TATIANA" },
    { label: "Дата рождения (3)", key: "birthDate", placeholder: "15.04.1982" },
    { label: "Место рождения (3)", key: "birthPlace", placeholder: "MDA CHIȘINĂU" },
    { label: "Дата выдачи (4a)", key: "issueDate", placeholder: "06.08.2015" },
    { label: "Действует до (4b)", key: "expiryDate", placeholder: "06.08.2025" },
    { label: "Кем выдан (4c)", key: "issuedBy", placeholder: "OFICIUL 00", span: true },
    { label: "Идентификатор (4d)", key: "idNumber", placeholder: "0000000000000", span: true },
    { label: "Номер удостоверения (5)", key: "licenseNumber", placeholder: "000000000", span: true },
  ];

  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Генератор удостоверения</h1>
        <p className="text-sm text-muted-foreground">Заполните данные — предпросмотр обновляется в реальном времени</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Form */}
        <div className="flex-1 max-w-xl">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">

            {/* Photo upload */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Фотография</h2>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-20 border-2 border-dashed border-border rounded cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
                >
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%)" }} />
                  ) : (
                    <Icon name="Camera" size={20} className="text-muted-foreground" />
                  )}
                </div>
                <div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-xs font-medium hover:border-primary/40 transition-colors"
                  >
                    <Icon name="Upload" size={13} />
                    Загрузить фото
                  </button>
                  <p className="text-[11px] text-muted-foreground mt-1">На карточке — чёрно-белое</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>
            </div>

            {/* Text fields */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Персональные данные</h2>
              <div className="grid grid-cols-2 gap-3">
                {fields.map((f) => (
                  <div key={f.key} className={f.span ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium text-foreground mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={form[f.key] as string}
                      placeholder={f.placeholder}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Категории (9)</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded border transition-colors font-mono ${
                      form.categories.includes(cat)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Предпросмотр · Лицевая сторона
            </div>
            <div style={{ overflowX: "auto" }}>
              <LicensePreview form={form} />
            </div>
          </div>

          <div className="flex flex-col gap-2" style={{ width: W, maxWidth: "100%" }}>
            <button
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded border font-medium text-sm transition-colors ${
                saved
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              }`}
            >
              <Icon name={saved ? "CheckCircle" : "Save"} size={16} />
              {saved ? "Сохранено в историю" : "Сохранить в историю"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownload("pdf")}
                disabled={downloading}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Icon name={downloading ? "Loader" : "FileDown"} size={16} className={downloading ? "animate-spin" : "text-crimson"} />
                Скачать PDF
              </button>
              <button
                onClick={() => handleDownload("png")}
                disabled={downloading}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Icon name={downloading ? "Loader" : "Image"} size={16} className={downloading ? "animate-spin" : "text-primary"} />
                Скачать PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
