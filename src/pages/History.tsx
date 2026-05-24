import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface HistoryEntry {
  id: string;
  date: string;
  data: {
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string;
    issueDate: string;
    expiryDate: string;
    licenseNumber: string;
    categories: string[];
    issuedBy: string;
    birthPlace: string;
    residence: string;
  };
}

interface HistoryProps {
  onNavigate: (page: string) => void;
}

export default function History({ onNavigate }: HistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("license_history") || "[]");
    setEntries(stored);
  }, []);

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("license_history", JSON.stringify(updated));
  };

  const clearAll = () => {
    if (window.confirm("Очистить всю историю генераций?")) {
      setEntries([]);
      localStorage.removeItem("license_history");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">История генераций</h1>
          <p className="text-sm text-muted-foreground">
            {entries.length > 0
              ? `${entries.length} ${entries.length === 1 ? "запись" : entries.length < 5 ? "записи" : "записей"}`
              : "Нет сохранённых удостоверений"}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-destructive/30 text-destructive rounded hover:bg-destructive/5 transition-colors"
          >
            <Icon name="Trash2" size={15} />
            Очистить всё
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon name="ClipboardList" size={28} className="text-muted-foreground" />
          </div>
          <div className="font-semibold text-foreground mb-2">История пуста</div>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Создайте первое удостоверение и нажмите «Сохранить в историю» — оно появится здесь
          </p>
          <button
            onClick={() => onNavigate("generator")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="Plus" size={16} />
            Создать удостоверение
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="license-card rounded p-3 w-full relative" style={{ height: "88px" }}>
                  <div className="text-[7px] font-mono tracking-widest text-white/40 uppercase mb-0.5">РФ · Водительское удостоверение</div>
                  <div className="text-[11px] font-bold text-white">
                    {entry.data.lastName} {entry.data.firstName[0]}.{entry.data.middleName ? entry.data.middleName[0] + "." : ""}
                  </div>
                  <div className="text-[8px] text-white/60 mt-0.5 font-mono">{entry.data.licenseNumber}</div>
                  <div className="flex gap-1 mt-2">
                    {entry.data.categories.slice(0, 5).map((c) => (
                      <span key={c} className="text-[7px] font-bold px-1 py-[1px] bg-gold/80 text-primary rounded font-mono">{c}</span>
                    ))}
                    {entry.data.categories.length > 5 && (
                      <span className="text-[7px] text-white/40">+{entry.data.categories.length - 5}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Выдан</span>
                  <span className="font-medium font-mono">{entry.data.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Действует до</span>
                  <span className="font-medium font-mono">{entry.data.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сохранено</span>
                  <span className="text-muted-foreground font-mono">{entry.date}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-border rounded hover:border-primary/40 transition-colors">
                  <Icon name="FileDown" size={13} className="text-crimson" />
                  PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-border rounded hover:border-primary/40 transition-colors">
                  <Icon name="Image" size={13} className="text-primary" />
                  PNG
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="py-1.5 px-2 text-xs border border-border rounded hover:border-destructive/40 hover:text-destructive transition-colors"
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
