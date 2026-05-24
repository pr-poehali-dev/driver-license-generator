import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
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
  lastName: "ИВАНОВ",
  firstName: "ИВАН",
  middleName: "ИВАНОВИЧ",
  birthDate: "01.01.1990",
  birthPlace: "RUS МОСКВА",
  issueDate: "01.01.2020",
  expiryDate: "01.01.2030",
  issuedBy: "ГИБДД МОСКВА",
  idNumber: "0000000000000",
  licenseNumber: "9900123456",
  categories: ["B"],
  photoUrl: "",
};

const SIGNATURE_SVG = `<svg width="120" height="36" viewBox="0 0 120 36" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 28 Q20 8 32 20 Q44 32 56 14 Q68 2 80 18 Q92 30 104 22 Q112 16 116 20" stroke="#1a1a2e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;

function LicensePreview({ form }: { form: FormData }) {
  return (
    <div
      id="license-preview"
      style={{
        width: "440px",
        height: "277px",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        fontFamily: "'IBM Plex Sans', sans-serif",
        boxShadow: "0 8px 40px rgba(10,20,80,0.22), 0 2px 8px rgba(10,20,80,0.12)",
        background: "linear-gradient(135deg, #dde8f8 0%, #ecd8e8 40%, #f0e8f8 70%, #d8e8f0 100%)",
      }}
    >
      {/* Geometric pattern background */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
        viewBox="0 0 440 277"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[...Array(8)].map((_, row) =>
          [...Array(12)].map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 38 - 4}
              y={row * 36 - 4}
              width="22"
              height="22"
              rx="3"
              stroke="#4466bb"
              strokeWidth="0.8"
              fill="none"
              transform={`rotate(15, ${col * 38 + 7}, ${row * 36 + 7})`}
            />
          ))
        )}
      </svg>

      {/* Watermark text vertical right */}
      <div style={{
        position: "absolute", right: "-8px", top: 0, bottom: 0, width: "28px",
        display: "flex", alignItems: "center", justifyContent: "center",
        writingMode: "vertical-rl", fontSize: "5.5px", letterSpacing: "2px",
        color: "#4466bb", opacity: 0.25, fontWeight: 600, textTransform: "uppercase",
        userSelect: "none",
      }}>
        ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ · РОССИЙСКАЯ ФЕДЕРАЦИЯ ·
      </div>

      {/* Top header bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40px",
        background: "rgba(255,255,255,0.55)",
        borderBottom: "1px solid rgba(68,102,187,0.2)",
        display: "flex", alignItems: "center", padding: "0 14px", gap: "10px",
      }}>
        {/* RUS badge */}
        <div style={{
          width: "34px", height: "26px", border: "2px solid #2244aa",
          borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.8)",
        }}>
          <span style={{ fontSize: "8px", fontWeight: 800, color: "#2244aa", letterSpacing: "0.5px" }}>RUS</span>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "10px", fontWeight: 800, color: "#1a3388", letterSpacing: "2.5px" }}>
            ВОДИТЕЛЬСКОЕ УДОСТОВЕРЕНИЕ
          </div>
          <div style={{ fontSize: "7px", color: "#2244aa", letterSpacing: "1.5px", opacity: 0.7 }}>
            РОССИЙСКАЯ ФЕДЕРАЦИЯ
          </div>
        </div>
        {/* Coat of arms placeholder */}
        <div style={{
          width: "28px", height: "28px", border: "1.5px solid #2244aa",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.7)", opacity: 0.6,
        }}>
          <span style={{ fontSize: "14px" }}>🦅</span>
        </div>
      </div>

      {/* Main content area */}
      <div style={{
        position: "absolute", top: "40px", left: 0, right: "28px", bottom: "42px",
        display: "flex", gap: "10px", padding: "8px 12px 4px 12px",
      }}>
        {/* Photo zone */}
        <div style={{
          width: "80px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "6px",
        }}>
          <div style={{
            width: "80px", height: "100px",
            border: "1.5px solid rgba(34,68,170,0.3)",
            borderRadius: "4px",
            background: form.photoUrl ? "transparent" : "rgba(200,210,230,0.4)",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="фото" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
            ) : (
              <div style={{ textAlign: "center", opacity: 0.4 }}>
                <div style={{ fontSize: "20px" }}>👤</div>
                <div style={{ fontSize: "6px", color: "#2244aa", marginTop: "2px" }}>ФОТО</div>
              </div>
            )}
          </div>
          {/* Small second photo */}
          <div style={{
            width: "40px", height: "50px", alignSelf: "flex-end",
            border: "1px solid rgba(34,68,170,0.2)",
            borderRadius: "3px",
            background: form.photoUrl ? "transparent" : "rgba(200,210,230,0.25)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
            ) : (
              <div style={{ fontSize: "10px", opacity: 0.25 }}>👤</div>
            )}
          </div>
        </div>

        {/* Data fields */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
          {/* Field 1 - Last name */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>1.</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", letterSpacing: "0.5px" }}>
              {form.lastName || "—"}
            </span>
          </div>
          {/* Field 2 - First + Middle */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>2.</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", letterSpacing: "0.5px" }}>
              {form.firstName}{form.middleName ? " " + form.middleName : ""}
            </span>
          </div>
          {/* Field 3 - Birth date + Place */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>3.</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace" }}>
              {form.birthDate || "—"} {form.birthPlace || ""}
            </span>
          </div>
          {/* Fields 4a 4b */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600 }}>4a.</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace" }}>
                {form.issueDate || "—"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600 }}>4b.</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace" }}>
                {form.expiryDate || "—"}
              </span>
            </div>
          </div>
          {/* Field 4c - Issued by */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>4c.</span>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px" }}>
              {form.issuedBy || "—"}
            </span>
          </div>
          {/* Field 4d - ID */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>4d.</span>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px" }}>
              {form.idNumber || "—"}
            </span>
          </div>
          {/* Field 5 - License number */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>5.</span>
            <span style={{ fontSize: "9px", fontWeight: 600, color: "#1a1a2e", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px" }}>
              {form.licenseNumber || "—"}
            </span>
          </div>
          {/* Field 7 - Signature */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 600, minWidth: "14px" }}>7.</span>
            <div dangerouslySetInnerHTML={{ __html: SIGNATURE_SVG }} style={{ opacity: 0.7 }} />
          </div>
        </div>
      </div>

      {/* Categories bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: "28px", height: "42px",
        background: "rgba(255,255,255,0.6)",
        borderTop: "1px solid rgba(68,102,187,0.25)",
        display: "flex", alignItems: "center", padding: "0 8px",
        gap: "3px", overflowX: "hidden",
      }}>
        <span style={{ fontSize: "7px", color: "#2244aa", fontWeight: 700, marginRight: "3px" }}>9.</span>
        {CATEGORIES.map((cat) => {
          const active = form.categories.includes(cat);
          return (
            <div
              key={cat}
              style={{
                minWidth: "22px", height: "26px",
                border: "1.5px solid #2244aa",
                borderRadius: "3px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: active ? "#2244aa" : "rgba(255,255,255,0.7)",
                padding: "0 3px",
              }}
            >
              <span style={{
                fontSize: cat.length > 2 ? "5.5px" : "7px",
                fontWeight: 800,
                color: active ? "#ffffff" : "#2244aa",
                fontFamily: "'IBM Plex Mono', monospace",
                fontStyle: cat === "I" || cat === "H" ? "italic" : "normal",
                letterSpacing: "-0.3px",
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

export default function Generator({
  onSave,
}: {
  onSave?: (entry: { id: string; data: FormData; date: string }) => void;
}) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saved, setSaved] = useState(false);
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
    const entry = {
      id: Date.now().toString(),
      data: form,
      date: new Date().toLocaleString("ru-RU"),
    };
    const existing = JSON.parse(localStorage.getItem("license_history") || "[]");
    localStorage.setItem("license_history", JSON.stringify([entry, ...existing]));
    onSave?.(entry);
    setSaved(true);
  };

  const handleDownload = (format: "pdf" | "png") => {
    alert(`Скачивание в ${format.toUpperCase()} будет доступно после подключения экспорта. Напишите "подключи скачивание" и я настрою!`);
  };

  const fields: { label: string; key: keyof FormData; placeholder?: string; span?: boolean }[] = [
    { label: "Фамилия", key: "lastName", placeholder: "ИВАНОВ" },
    { label: "Имя", key: "firstName", placeholder: "ИВАН" },
    { label: "Отчество", key: "middleName", placeholder: "ИВАНОВИЧ", span: true },
    { label: "Дата рождения", key: "birthDate", placeholder: "01.01.1990" },
    { label: "Место рождения (поле 3)", key: "birthPlace", placeholder: "RUS МОСКВА" },
    { label: "Дата выдачи (4a)", key: "issueDate", placeholder: "01.01.2020" },
    { label: "Действует до (4b)", key: "expiryDate", placeholder: "01.01.2030" },
    { label: "Кем выдан (4c)", key: "issuedBy", placeholder: "ГИБДД г. Москва", span: true },
    { label: "Идентификатор (4d)", key: "idNumber", placeholder: "0000000000000" },
    { label: "Номер удостоверения (5)", key: "licenseNumber", placeholder: "9900123456" },
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
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Фотография
              </h2>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-20 border-2 border-dashed border-border rounded cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
                >
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="" className="w-full h-full object-cover" />
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
                  <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG · На карточке отображается чёрно-белым</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>
            </div>

            {/* Text fields */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Персональные данные
              </h2>
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
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Категории (поле 9)
              </h2>
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

          <div className="flex flex-col gap-2" style={{ width: "440px", maxWidth: "100%" }}>
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
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors"
              >
                <Icon name="FileDown" size={16} className="text-crimson" />
                Скачать PDF
              </button>
              <button
                onClick={() => handleDownload("png")}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors"
              >
                <Icon name="Image" size={16} className="text-primary" />
                Скачать PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
