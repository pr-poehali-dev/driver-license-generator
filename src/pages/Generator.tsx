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

const CATEGORIES = ["A1","A2","A","B1","B","C1","C","D1","D","BE","C1E","CE","D1E","DE","F","H","I"];

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

const BG_URL = "https://cdn.poehali.dev/projects/fe1303d3-5ad6-4bf7-b4cd-e9591822900e/bucket/3001ecbe-095c-4350-adb7-bd94eaae9378.jpg";

/*
  Оригинал: 1270 × 955 px → отображаем 635 × 477 (scale 0.5)

  Замеренные координаты LEFT/TOP в нашем масштабе (÷2 от оригинала):

  Фото большое:  left=15,  top=58,  w=120, h=278
  Фото маленькое: left=498, top=245, w=62,  h=90

  Текст полей (left = после цифры-индекса, выровнен по оригинальным данным):
  1. Фамилия:       left=198, top=80
  2. Имя:           left=198, top=116
  3. Дата+место:    left=198, top=153
  4a. Выдан:        left=198, top=190
  4b. До:           left=360, top=190
  4c. Орган:        left=198, top=227
  4d. Идент.:       left=198, top=264
  5.  Номер:        left=198, top=301
  7.  Подпись:      left=198, top=335

  Категории: top=405, left=30, right=38, height=44
*/

const W = 635;
const H = 477;

const txtStyle = (l: number, t: number, sz = 15): React.CSSProperties => ({
  position: "absolute",
  left: l,
  top: t,
  fontSize: sz,
  fontWeight: 800,
  color: "#1a1a1a",
  fontFamily: "'IBM Plex Mono', monospace",
  letterSpacing: 0.3,
  lineHeight: 1,
  whiteSpace: "nowrap",
  pointerEvents: "none",
});

function LicensePreview({ form }: { form: FormData }) {
  return (
    <div
      id="license-preview"
      style={{
        width: W,
        height: H,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        boxShadow: "0 12px 48px rgba(20,40,120,0.30), 0 2px 8px rgba(20,40,120,0.15)",
      }}
    >
      {/* Фон — оригинальная картинка через CSS (обходит CORS для отображения) */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          pointerEvents: "none",
        }}
      />

      {/* Большое фото (левая колонка) */}
      <div style={{
        position: "absolute", left: 15, top: 58, width: 120, height: 278,
        overflow: "hidden",
      }}>
        {form.photoUrl ? (
          <img
            src={form.photoUrl} alt="фото" crossOrigin="anonymous"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.1) brightness(0.95)",
            }}
          />
        ) : null}
      </div>

      {/* Маленькое фото (правый блок) */}
      <div style={{
        position: "absolute", left: 498, top: 245, width: 62, height: 90,
        overflow: "hidden",
      }}>
        {form.photoUrl ? (
          <img
            src={form.photoUrl} alt="" crossOrigin="anonymous"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.05) opacity(0.65)",
            }}
          />
        ) : null}
      </div>

      {/* 1. Фамилия */}
      <span style={txtStyle(198, 80, 17)}>{form.lastName}</span>

      {/* 2. Имя */}
      <span style={txtStyle(198, 116, 17)}>{form.firstName}</span>

      {/* 3. Дата рождения + место */}
      <span style={txtStyle(198, 153, 15)}>
        {form.birthDate}&nbsp;&nbsp;{form.birthPlace}
      </span>

      {/* 4a. Дата выдачи */}
      <span style={txtStyle(198, 190, 15)}>{form.issueDate}</span>

      {/* 4b. Дата окончания */}
      <span style={txtStyle(360, 190, 15)}>{form.expiryDate}</span>

      {/* 4c. Кем выдан */}
      <span style={txtStyle(198, 227, 15)}>{form.issuedBy}</span>

      {/* 4d. Идентификатор */}
      <span style={txtStyle(198, 264, 15)}>{form.idNumber}</span>

      {/* 5. Номер удостоверения */}
      <span style={txtStyle(198, 301, 15)}>{form.licenseNumber}</span>

      {/* 7. Подпись (SVG) */}
      <div style={{ position: "absolute", left: 198, top: 333, pointerEvents: "none" }}>
        <svg width="210" height="44" viewBox="0 0 210 44">
          <path
            d="M4 34 C16 34 18 12 30 20 C42 28 46 10 60 18 C74 26 80 8 96 16 C112 24 118 10 136 18 C150 24 158 14 172 20 C182 24 192 18 204 20"
            stroke="#111" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M4 38 C22 38 36 38 54 38" stroke="#111" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.35" />
        </svg>
      </div>

      {/* ══ Категории — поверх нижней полоски ══ */}
      <div style={{
        position: "absolute",
        top: 405,
        left: 30,
        right: 38,
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 3,
        pointerEvents: "none",
      }}>
        {CATEGORIES.map((cat) => {
          const active = form.categories.includes(cat);
          const isItalic = cat === "F" || cat === "H" || cat === "I";
          const long = cat.length >= 3;
          return (
            <div
              key={cat}
              style={{
                flex: long ? 1.5 : 1,
                height: 36,
                border: "2px solid #1a3aaa",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "#1a3aaa" : "rgba(255,255,255,0.06)",
                minWidth: 0,
              }}
            >
              <span style={{
                fontSize: long ? 7.5 : 11,
                fontWeight: 900,
                color: active ? "#fff" : "#1a3aaa",
                fontFamily: "'IBM Plex Mono', monospace",
                fontStyle: isItalic ? "italic" : "normal",
                letterSpacing: -0.5,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}>
                {cat}
              </span>
            </div>
          );
        })}
      </div>
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
      const canvas = await html2canvas(el, {
        scale: 3, useCORS: true, allowTaint: true, backgroundColor: null, logging: false,
      });
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

        {/* Форма */}
        <div className="flex-1 max-w-xl">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
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

        {/* Предпросмотр */}
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