import Icon from "@/components/ui/icon";

interface TemplatesProps {
  onNavigate: (page: string) => void;
}

const templates = [
  {
    id: "standard",
    name: "Стандартный",
    description: "Классический макет водительского удостоверения РФ образца 2014 года",
    categories: ["B"],
    color: "from-[#0d2147] to-[#1a3a78]",
    badge: "Популярный",
    badgeColor: "bg-gold text-primary",
  },
  {
    id: "pro",
    name: "Профессиональный",
    description: "Все категории транспортных средств, расширенные поля данных",
    categories: ["A", "B", "C", "D", "E"],
    color: "from-[#1a2e1a] to-[#2d4a2d]",
    badge: "Полный",
    badgeColor: "bg-emerald-600 text-white",
  },
  {
    id: "minimal",
    name: "Упрощённый",
    description: "Только основные поля: ФИО, дата, номер и категории",
    categories: ["B", "C"],
    color: "from-[#2a1a1a] to-[#4a2a2a]",
    badge: "Компактный",
    badgeColor: "bg-crimson text-white",
  },
  {
    id: "international",
    name: "Международный",
    description: "Международное водительское удостоверение (МВУ) с латинской транслитерацией",
    categories: ["B"],
    color: "from-[#1a1a2a] to-[#2a2a4a]",
    badge: "МВУ",
    badgeColor: "bg-indigo-600 text-white",
  },
];

function TemplateMiniPreview({ tpl }: { tpl: typeof templates[number] }) {
  return (
    <div
      className={`rounded bg-gradient-to-br ${tpl.color} text-white p-3 relative overflow-hidden`}
      style={{ height: "96px" }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/3 -translate-y-4 translate-x-4"></div>
      <div className="text-[7px] font-mono tracking-widest text-white/40 uppercase mb-0.5">
        Российская Федерация
      </div>
      <div className="text-[9px] font-bold">ВОДИТЕЛЬСКОЕ</div>
      <div className="text-[9px] font-bold text-gold">УДОСТОВЕРЕНИЕ</div>
      <div className="flex gap-0.5 mt-2">
        {tpl.categories.map((c) => (
          <span
            key={c}
            className="text-[7px] font-bold px-1 py-[1px] bg-gold/80 text-primary rounded font-mono"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="font-mono text-[6px] text-white/25 mt-1 tracking-widest">99 00 000000</div>
    </div>
  );
}

export default function Templates({ onNavigate }: TemplatesProps) {
  return (
    <div className="container mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Шаблоны удостоверений</h1>
        <p className="text-sm text-muted-foreground">
          Выберите подходящий шаблон и перейдите к заполнению данных
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all hover:doc-shadow group"
          >
            <div className="p-4 border-b border-border">
              <TemplateMiniPreview tpl={tpl} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-foreground text-sm">{tpl.name}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tpl.badgeColor}`}>
                  {tpl.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{tpl.description}</p>
              <button
                onClick={() => onNavigate("generator")}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Icon name="Pencil" size={13} />
                Использовать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info block */}
      <div className="bg-primary/4 border border-primary/15 rounded-lg p-6 flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="Info" size={20} className="text-primary" />
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm mb-1">О шаблонах</div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Все шаблоны созданы на основе официальных образцов документов. Вы можете
            свободно настраивать любые поля в разделе «Генератор». После заполнения
            данных документ можно скачать в форматах PDF или PNG.
          </p>
        </div>
      </div>
    </div>
  );
}
