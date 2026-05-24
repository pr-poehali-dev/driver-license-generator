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

/* Карточка ID-1: 85.6×54мм → отображаем 660×416px */
const W = 660;
const H = 416;

function LicenseCard({ form }: { form: FormData }) {
  const cats = new Set(form.categories);

  return (
    <div
      id="license-preview"
      style={{
        width: W, height: H,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 16px 56px rgba(20,40,120,0.35), 0 2px 8px rgba(20,40,120,0.15)",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {/* ══════════════════════════════════════
          ФОН: градиент голубой-лиловый-розовый
          ══════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(120deg, #b8ccec 0%, #c8b8e8 25%, #d8b8d8 50%, #e8bcd4 75%, #ddc8e4 100%)",
      }} />

      {/* Зона слева — чуть голубее */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: "30%", height: "100%",
        background: "linear-gradient(180deg, #b0c8e8 0%, #b8c0e0 100%)",
        opacity: 0.7,
      }} />

      {/* ══ SVG: ромбовые узоры + цветочные водяные знаки ══ */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Ромбы (голубые) — левая зона */}
          <pattern id="dia" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect x="7" y="7" width="14" height="14" rx="1.5"
              stroke="#3355bb" strokeWidth="0.9" fill="none"
              transform="rotate(45 14 14)" />
          </pattern>
          {/* Цветочный/звёздный водяной знак — центр-право */}
          <pattern id="flower" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
            <g opacity="0.22" stroke="#b07828" strokeWidth="0.7" fill="none">
              <circle cx="22" cy="22" r="9" />
              <circle cx="22" cy="22" r="15" />
              <line x1="22" y1="7" x2="22" y2="37" />
              <line x1="7" y1="22" x2="37" y2="22" />
              <line x1="11" y1="11" x2="33" y2="33" />
              <line x1="33" y1="11" x2="11" y2="33" />
              <line x1="13" y1="7" x2="31" y2="37" />
              <line x1="31" y1="7" x2="13" y2="37" />
            </g>
          </pattern>
        </defs>

        {/* Ромбы по всей карте */}
        <rect x="0" y="0" width={W * 0.42} height={H} fill="url(#dia)" opacity="0.55" />
        <rect x={W * 0.42} y="0" width={W * 0.58} height={H} fill="url(#dia)" opacity="0.18" />

        {/* Золотой цветочный узор — центрально-правая зона */}
        <rect x={W * 0.28} y="0" width={W * 0.65} height={H} fill="url(#flower)" />

        {/* Вертикальная водяная надпись справа */}
        <text
          x={W - 12} y={H * 0.5}
          fontSize="6" fontWeight="600" fill="#3355bb" opacity="0.3"
          textAnchor="middle"
          transform={`rotate(-90, ${W - 12}, ${H * 0.5})`}
          letterSpacing="2"
          style={{ fontFamily: "sans-serif" }}
        >
          PERMIS DE CONDUCERE · REPUBLICA MOLDOVA · CONDUCERE ·
        </text>

        {/* Разделительная линия шапки */}
        <line x1="0" y1="60" x2={W - 20} y2="60" stroke="#3355bb" strokeWidth="0.8" opacity="0.3" />

        {/* Разделитель нижней полоски */}
        <line x1="0" y1={H - 58} x2={W - 20} y2={H - 58} stroke="#3355bb" strokeWidth="0.8" opacity="0.3" />

        {/* Ещё одна линия MRZ-зоны */}
        <line x1="0" y1={H - 40} x2={W - 20} y2={H - 40} stroke="#3355bb" strokeWidth="0.4" opacity="0.2" />
      </svg>

      {/* ══ ВЕРТИКАЛЬНАЯ ПОЛОСКА СПРАВА ══ */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 20,
        background: "rgba(180,160,220,0.25)",
        borderLeft: "1px solid rgba(80,100,200,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        writingMode: "vertical-rl",
        fontSize: 5.5, color: "#3355bb", opacity: 0.6,
        letterSpacing: 1.5, fontWeight: 600,
        fontFamily: "sans-serif",
      }}>
        CONDUCERE · MOLDOVA · PERMIS ·
      </div>

      {/* ══════════════════════
          ШАПКА
          ══════════════════════ */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 20, height: 60,
        display: "flex", alignItems: "center",
        padding: "0 14px", gap: 12,
      }}>
        {/* MD badge */}
        <div style={{
          width: 46, height: 34, flexShrink: 0,
          border: "2.5px solid #1a44cc",
          borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.75)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#1a44cc", fontFamily: "sans-serif" }}>MD</span>
        </div>

        {/* Заголовок */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 13, fontWeight: 900, color: "#1a44cc",
            letterSpacing: 2.5, fontFamily: "sans-serif",
          }}>
            PERMIS DE CONDUCERE
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
            <div style={{ width: 1, height: 14, background: "#1a44cc", opacity: 0.5 }} />
            <span style={{
              fontSize: 11, fontWeight: 800, color: "#1a44cc",
              letterSpacing: 2, fontFamily: "sans-serif",
            }}>
              REPUBLICA MOLDOVA
            </span>
          </div>
        </div>

        {/* Герб */}
        <div style={{
          width: 44, height: 50, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox="0 0 44 52" width="44" height="52">
            {/* Щит */}
            <path d="M22 2 L42 12 L42 30 Q42 46 22 52 Q2 46 2 30 L2 12 Z"
              fill="none" stroke="#1a44cc" strokeWidth="1.5" opacity="0.7" />
            {/* Орёл */}
            <text x="22" y="35" textAnchor="middle" fontSize="22" opacity="0.65">🦅</text>
            {/* Звезда вверху */}
            <polygon points="22,4 23.5,8.5 28,8.5 24.5,11 25.8,15.5 22,12.5 18.2,15.5 19.5,11 16,8.5 20.5,8.5"
              fill="#1a44cc" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════
          ОСНОВНАЯ ОБЛАСТЬ
          ══════════════════════ */}

      {/* Большое фото — левая колонка */}
      <div style={{
        position: "absolute",
        left: 14, top: 62,
        width: 140, height: 240,
        border: "1.5px solid rgba(40,70,180,0.25)",
        borderRadius: 3,
        background: "rgba(170,185,215,0.3)",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {form.photoUrl ? (
          <img src={form.photoUrl} alt="фото"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.08) brightness(0.97)",
            }} />
        ) : (
          <div style={{ textAlign: "center", opacity: 0.35 }}>
            <div style={{ fontSize: 40 }}>👤</div>
            <div style={{ fontSize: 7, color: "#2244aa", marginTop: 4, letterSpacing: 1.5, fontFamily: "sans-serif" }}>PHOTO</div>
          </div>
        )}
      </div>

      {/* Маленькое фото — правее внизу */}
      <div style={{
        position: "absolute",
        right: 34, top: 220,
        width: 66, height: 82,
        border: "1px solid rgba(40,70,180,0.2)",
        borderRadius: 2,
        background: "rgba(170,185,215,0.18)",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {form.photoUrl ? (
          <img src={form.photoUrl} alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              filter: "grayscale(100%) contrast(1.0) opacity(0.6)",
            }} />
        ) : null}
      </div>

      {/* ══ ТЕКСТОВЫЕ ПОЛЯ ══ */}
      {/* Нумерация — синяя, данные — чёрные жирные */}

      {/* 1. Фамилия */}
      <Row num="1." data={form.lastName} top={72} left={174} dataSize={17} />

      {/* 2. Имя */}
      <Row num="2." data={form.firstName} top={108} left={174} dataSize={17} />

      {/* 3. Дата + место */}
      <Row num="3." data={`${form.birthDate}  ${form.birthPlace}`} top={144} left={174} dataSize={14} />

      {/* 4a + 4b */}
      <div style={{ position: "absolute", top: 179, left: 174, display: "flex", alignItems: "baseline", gap: 28 }}>
        <span style={{ fontSize: 9, color: "#1a44cc", fontWeight: 800, fontFamily: "sans-serif" }}>4a.</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginLeft: 4, letterSpacing: 0.3 }}>{form.issueDate}</span>
        <span style={{ fontSize: 9, color: "#1a44cc", fontWeight: 800, fontFamily: "sans-serif", marginLeft: 8 }}>4b.</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginLeft: 4, letterSpacing: 0.3 }}>{form.expiryDate}</span>
      </div>

      {/* 4c */}
      <Row num="4c." data={form.issuedBy} top={213} left={174} dataSize={14} />

      {/* 4d */}
      <Row num="4d." data={form.idNumber} top={247} left={174} dataSize={14} />

      {/* 5 */}
      <Row num="5." data={form.licenseNumber} top={282} left={174} dataSize={14} />

      {/* 7. Подпись */}
      <div style={{ position: "absolute", top: 312, left: 174, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 9, color: "#1a44cc", fontWeight: 800, fontFamily: "sans-serif" }}>7.</span>
        <svg width="220" height="44" viewBox="0 0 220 44" style={{ display: "block" }}>
          <path
            d="M4 36 C16 34 18 14 32 22 C46 30 50 12 66 20 C82 28 88 10 106 18 C124 26 130 12 150 20 C164 26 174 18 190 22 C200 24 210 20 218 22"
            stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M4 40 C24 40 40 40 60 40" stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.35" />
        </svg>
      </div>

      {/* ══ MRZ строка ══ */}
      <div style={{
        position: "absolute", bottom: 40, left: 0, right: 20,
        fontSize: 5.5, color: "#3355bb", opacity: 0.4,
        letterSpacing: 1.2, fontFamily: "sans-serif",
        padding: "0 12px", whiteSpace: "nowrap", overflow: "hidden",
        lineHeight: "14px",
      }}>
        ТЕЛСТВО ЗА УПРАВЛЕНИЕ НА МПС · PERMISO DE · PRUKAZ · KØRERT · LICENZJATAS-SEWQAN · RIJBEWIJS · PRAWO JAZDY · VOZNISKO · VAIRUOTOJO
      </div>

      {/* ══════════════════════
          НИЖНЯЯ ПОЛОСКА КАТЕГОРИЙ
          ══════════════════════ */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 20, height: 40,
        background: "rgba(240,242,252,0.55)",
        display: "flex", alignItems: "center",
        padding: "0 10px", gap: 3,
      }}>
        <span style={{ fontSize: 8, color: "#1a44cc", fontWeight: 900, marginRight: 4, fontFamily: "sans-serif", flexShrink: 0 }}>9.</span>
        {CATEGORIES.map((cat) => {
          const active = cats.has(cat);
          const isItalic = cat === "F" || cat === "H" || cat === "I";
          const long = cat.length >= 3;
          return (
            <div key={cat} style={{
              flex: long ? 1.5 : 1,
              height: 30,
              border: "1.8px solid #1a44cc",
              borderRadius: 3,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: active ? "#1a44cc" : "rgba(255,255,255,0.6)",
              minWidth: 0,
            }}>
              <span style={{
                fontSize: long ? 7 : 10,
                fontWeight: 900,
                color: active ? "#fff" : "#1a44cc",
                fontFamily: "'IBM Plex Mono', monospace",
                fontStyle: isItalic ? "italic" : "normal",
                letterSpacing: -0.4,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}>{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Строка с номером поля и данными */
function Row({ num, data, top, left, dataSize }: {
  num: string; data: string; top: number; left: number; dataSize: number;
}) {
  return (
    <div style={{
      position: "absolute", top, left,
      display: "flex", alignItems: "baseline", gap: 6,
    }}>
      <span style={{ fontSize: 9, color: "#1a44cc", fontWeight: 800, fontFamily: "sans-serif", minWidth: 20 }}>{num}</span>
      <span style={{
        fontSize: dataSize,
        fontWeight: 800,
        color: "#1a1a1a",
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: 0.3,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}>{data || "—"}</span>
    </div>
  );
}

/* ════════════════════════════════════════════ */

export default function Generator({
  onSave,
}: {
  onSave?: (entry: { id: string; data: FormData; date: string }) => void;
}) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (f: keyof FormData, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    setSaved(false);
  };

  const toggleCat = (cat: string) => {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
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
        scale: 3, useCORS: true, backgroundColor: null, logging: false,
      });
      if (format === "png") {
        const a = document.createElement("a");
        a.download = `ву_${form.lastName}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      } else {
        const img = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [85.6, 53.98] });
        pdf.addImage(img, "JPEG", 0, 0, 85.6, 53.98);
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
        <p className="text-sm text-muted-foreground">Предпросмотр обновляется в реальном времени</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">

        {/* Форма */}
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
                  {form.photoUrl
                    ? <img src={form.photoUrl} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%)" }} />
                    : <Icon name="Camera" size={20} className="text-muted-foreground" />}
                </div>
                <div>
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-xs font-medium hover:border-primary/40 transition-colors">
                    <Icon name="Upload" size={13} />Загрузить фото
                  </button>
                  <p className="text-[11px] text-muted-foreground mt-1">На карточке — чёрно-белое</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>
            </div>

            {/* Данные */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Персональные данные</h2>
              <div className="grid grid-cols-2 gap-3">
                {fields.map((f) => (
                  <div key={f.key} className={f.span ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium text-foreground mb-1">{f.label}</label>
                    <input type="text" value={form[f.key] as string} placeholder={f.placeholder}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
                  </div>
                ))}
              </div>
            </div>

            {/* Категории */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Категории (9)</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => toggleCat(cat)}
                    className={`px-2.5 py-1.5 text-xs font-bold rounded border transition-colors font-mono ${
                      form.categories.includes(cat)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Предпросмотр */}
        <div className="flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Предпросмотр · Лицевая сторона
          </div>
          <div style={{ overflowX: "auto" }}>
            <LicenseCard form={form} />
          </div>

          <div className="flex flex-col gap-2" style={{ width: W, maxWidth: "100%" }}>
            <button onClick={handleSave}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded border font-medium text-sm transition-colors ${
                saved ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              }`}>
              <Icon name={saved ? "CheckCircle" : "Save"} size={16} />
              {saved ? "Сохранено в историю" : "Сохранить в историю"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleDownload("pdf")} disabled={downloading}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors disabled:opacity-50">
                <Icon name={downloading ? "Loader" : "FileDown"} size={16} className={downloading ? "animate-spin" : "text-crimson"} />
                Скачать PDF
              </button>
              <button onClick={() => handleDownload("png")} disabled={downloading}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors disabled:opacity-50">
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
