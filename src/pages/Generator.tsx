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

/* Оригинальное изображение карточки как фон */
const BG_URL = "https://cdn.poehali.dev/projects/fe1303d3-5ad6-4bf7-b4cd-e9591822900e/bucket/3001ecbe-095c-4350-adb7-bd94eaae9378.jpg";

/* Размеры карточки в пикселях (соотношение оригинала ~1270:960) */
const W = 570;
const H = 360;

/*
  Координаты полей вычислены из оригинала 1270×960px → масштаб до 570×360
  scaleX = 570/1270 = 0.449  scaleY = 360/960 = 0.375
*/

function LicensePreview({ form }: { form: FormData }) {
  /* категории — какие активны */
  const activeCats = new Set(form.categories);

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
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* ── Фоновое изображение оригинала ── */}
      <img
        src={BG_URL}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        crossOrigin="anonymous"
      />

      {/* ── Фото владельца (большое, слева) ──
          На оригинале фото занимает примерно x:30-290, y:110-680 из 1270×960
          → x: 13-130, y: 41-255 из 570×360  */}
      <div style={{
        position: "absolute",
        left: 14,
        top: 42,
        width: 116,
        height: 196,
        overflow: "hidden",
        borderRadius: 2,
      }}>
        {form.photoUrl ? (
          <img
            src={form.photoUrl}
            alt="фото"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.08)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "rgba(180,190,210,0.0)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }} />
        )}
      </div>

      {/* ── Маленькое фото (правее, внизу) ──
          На оригинале ~x:1000-1150, y:490-700 → x:449-516, y:184-263 */}
      <div style={{
        position: "absolute",
        left: 449,
        top: 184,
        width: 55,
        height: 72,
        overflow: "hidden",
        borderRadius: 2,
        opacity: 0.55,
      }}>
        {form.photoUrl && (
          <img
            src={form.photoUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.05)",
            }}
          />
        )}
      </div>

      {/* ══ ТЕКСТОВЫЕ ПОЛЯ ══
          Шрифт на оригинале — жирный моноширинный, тёмно-серый/чёрный.
          Координаты подобраны по оригиналу.
      */}

      {/* 1. Фамилия — y≈155/960*360=58, x≈390/1270*570=175 */}
      <TextField x={155} y={96} value={form.lastName} size={18} />

      {/* 2. Имя — y≈240 */}
      <TextField x={155} y={128} value={form.firstName} size={18} />

      {/* 3. Дата рождения + место — y≈330 */}
      <TextField x={155} y={160} value={`${form.birthDate}  ${form.birthPlace}`} size={14.5} />

      {/* 4a. Дата выдачи — y≈415 */}
      <TextField x={155} y={190} value={form.issueDate} size={14.5} />

      {/* 4b. Действует до — x≈700/1270*570=314 */}
      <TextField x={320} y={190} value={form.expiryDate} size={14.5} prefix="4b." prefixX={295} prefixY={190} />

      {/* 4c. Кем выдан — y≈500 */}
      <TextField x={155} y={219} value={form.issuedBy} size={14.5} />

      {/* 4d. Идентификатор — y≈580 */}
      <TextField x={155} y={247} value={form.idNumber} size={14} />

      {/* 5. Номер — y≈660 */}
      <TextField x={155} y={275} value={form.licenseNumber} size={14} />

      {/* 7. Подпись — рукописный стиль */}
      <div style={{
        position: "absolute",
        left: 155,
        top: 296,
        lineHeight: 1,
      }}>
        <svg width="180" height="32" viewBox="0 0 180 32">
          <path
            d="M4 24 C14 24 16 8 26 14 C36 20 40 6 52 12 C64 18 68 6 80 12 C92 18 98 8 112 14 C122 18 128 12 140 16 C148 18 156 14 168 16"
            stroke="#222" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M4 26 C18 26 28 26 40 26" stroke="#222" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.35" />
        </svg>
      </div>

      {/* ══ КАТЕГОРИИ — нижняя полоска ══
          На оригинале блок начинается ~y:790/960*360=296 и идёт до низа.
          Ячейки начинаются ~x:58/1270*570=26 и заканчиваются ~x:1210/1270*570=543
          Ширина блока ≈517px на 570 итого — 17 категорий
      */}
      <div style={{
        position: "absolute",
        bottom: 6,
        left: 26,
        right: 36,
        height: 38,
        display: "flex",
        alignItems: "center",
        gap: 2.5,
      }}>
        {CATEGORIES.map((cat) => {
          const active = activeCats.has(cat);
          const isItalic = cat === "F" || cat === "H" || cat === "I";
          const isLong = cat.length >= 3;
          return (
            <div
              key={cat}
              style={{
                flex: isLong ? 1.3 : 1,
                height: 30,
                border: "1.8px solid #1a3aaa",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "#1a3aaa" : "rgba(255,255,255,0.15)",
                minWidth: 0,
              }}
            >
              <span style={{
                fontSize: isLong ? 7 : 9.5,
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

/* Текстовое поле поверх фона */
function TextField({
  x, y, value, size,
  prefix, prefixX, prefixY,
}: {
  x: number; y: number; value: string; size: number;
  prefix?: string; prefixX?: number; prefixY?: number;
}) {
  return (
    <>
      {prefix && (
        <span style={{
          position: "absolute",
          left: prefixX,
          top: prefixY,
          fontSize: 8,
          fontWeight: 700,
          color: "#1a3aaa",
          lineHeight: 1,
        }}>
          {prefix}
        </span>
      )}
      <span style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        fontWeight: 700,
        color: "#1a1a1a",
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: 0.3,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textShadow: "0 0 3px rgba(255,255,255,0.5)",
      }}>
        {value || ""}
      </span>
    </>
  );
}

/* ═══════════════════════════════════════════════════════ */

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
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
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

        {/* ── Форма ── */}
        <div className="flex-1 max-w-xl">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">

            {/* Фото */}
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

            {/* Поля данных */}
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

            {/* Категории */}
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

        {/* ── Предпросмотр и кнопки ── */}
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
