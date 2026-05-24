import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  issueDate: string;
  expiryDate: string;
  birthPlace: string;
  residence: string;
  licenseNumber: string;
  categories: string[];
  issuedBy: string;
}

const CATEGORIES = ["A", "A1", "B", "B1", "C", "C1", "D", "D1", "BE", "CE", "DE", "M", "Tm", "Tb"];

const defaultForm: FormData = {
  lastName: "ИВАНОВ",
  firstName: "ИВАН",
  middleName: "ИВАНОВИЧ",
  birthDate: "01.01.1990",
  issueDate: "01.01.2020",
  expiryDate: "01.01.2030",
  birthPlace: "г. Москва",
  residence: "г. Москва",
  licenseNumber: "99 00 123456",
  categories: ["B"],
  issuedBy: "ГИБДД",
};

function LicensePreview({ form }: { form: FormData }) {
  return (
    <div
      id="license-preview"
      className="license-card rounded-lg text-white relative"
      style={{ width: "340px", height: "214px", padding: "18px 20px", flexShrink: 0 }}
    >
      {/* Front side */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <div className="text-[8px] font-mono tracking-widest text-white/50 uppercase">Российская Федерация</div>
          <div className="text-[11px] font-bold tracking-wide mt-0.5">ВОДИТЕЛЬСКОЕ</div>
          <div className="text-[11px] font-bold tracking-wide text-gold">УДОСТОВЕРЕНИЕ</div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="text-[8px] text-white/40 font-mono tracking-widest">RUS</div>
          <div className="w-7 h-7 rounded-full border-2 border-gold/50 flex items-center justify-center">
            <Icon name="Shield" size={12} className="text-gold/60" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 relative z-10">
        <div className="w-[56px] h-[70px] bg-white/10 border border-white/20 rounded flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={22} className="text-white/25" />
        </div>
        <div className="flex-1 space-y-[3px] text-[9px]">
          <div>
            <span className="text-white/40">1. </span>
            <span className="font-semibold tracking-wide">{form.lastName || "—"}</span>
          </div>
          <div>
            <span className="text-white/40">2. </span>
            <span className="font-semibold">{form.firstName} {form.middleName || ""}</span>
          </div>
          <div>
            <span className="text-white/40">3. </span>
            <span className="font-mono text-[8px]">{form.birthDate || "—"}</span>
            <span className="text-white/40 ml-2">4b. </span>
            <span className="font-mono text-[8px]">{form.issueDate || "—"}</span>
          </div>
          <div>
            <span className="text-white/40">4c. </span>
            <span className="font-mono text-[8px]">{form.expiryDate || "—"}</span>
          </div>
          <div>
            <span className="text-white/40">4d. </span>
            <span className="font-mono text-[8px]">{form.issuedBy || "—"}</span>
          </div>
          <div className="flex flex-wrap gap-[3px] pt-1">
            {form.categories.map((c) => (
              <span key={c} className="text-[8px] font-bold px-1.5 py-[1px] bg-gold/85 text-primary rounded font-mono">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between relative z-10">
        <div className="font-mono text-[7px] text-white/30 tracking-widest">{form.licenseNumber || "— —"}</div>
        <div className="font-mono text-[7px] text-white/30">до {form.expiryDate || "—"}</div>
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
    alert(`Скачивание в ${format.toUpperCase()} — функция будет настроена. Сейчас вы можете сохранить страницу браузером.`);
  };

  const fields: { label: string; key: keyof FormData; placeholder?: string }[] = [
    { label: "Фамилия", key: "lastName", placeholder: "ИВАНОВ" },
    { label: "Имя", key: "firstName", placeholder: "ИВАН" },
    { label: "Отчество", key: "middleName", placeholder: "ИВАНОВИЧ" },
    { label: "Дата рождения", key: "birthDate", placeholder: "01.01.1990" },
    { label: "Место рождения", key: "birthPlace", placeholder: "г. Москва" },
    { label: "Место проживания", key: "residence", placeholder: "г. Москва" },
    { label: "Дата выдачи", key: "issueDate", placeholder: "01.01.2020" },
    { label: "Действует до", key: "expiryDate", placeholder: "01.01.2030" },
    { label: "Кем выдан", key: "issuedBy", placeholder: "ГИБДД г. Москва" },
    { label: "Серия и номер", key: "licenseNumber", placeholder: "99 00 123456" },
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Персональные данные
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key}>
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

            <div className="mt-6">
              <label className="block text-xs font-medium text-foreground mb-2 uppercase tracking-widest">
                Категории
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors font-mono ${
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
              Предпросмотр
            </div>
            <LicensePreview form={form} />
          </div>

          <div className="flex flex-col gap-2">
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
                PDF
              </button>
              <button
                onClick={() => handleDownload("png")}
                className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-card hover:border-primary/40 text-sm font-medium transition-colors"
              >
                <Icon name="Image" size={16} className="text-primary" />
                PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
