import Icon from "@/components/ui/icon";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: "FileText",
      title: "Точное соответствие",
      desc: "Макеты соответствуют актуальным образцам водительских удостоверений РФ",
    },
    {
      icon: "Download",
      title: "Экспорт PDF и PNG",
      desc: "Скачивайте готовые удостоверения в высоком разрешении в два клика",
    },
    {
      icon: "LayoutGrid",
      title: "Несколько шаблонов",
      desc: "Выбирайте из готовых шаблонов под разные задачи и форматы",
    },
    {
      icon: "Clock",
      title: "История генераций",
      desc: "Все созданные удостоверения сохраняются и доступны в любое время",
    },
  ];

  const steps = [
    { num: "01", title: "Выберите шаблон", desc: "Выберите подходящий шаблон из библиотеки" },
    { num: "02", title: "Заполните данные", desc: "Введите имя, дату рождения и категории" },
    { num: "03", title: "Скачайте документ", desc: "Экспортируйте в PDF или PNG одним нажатием" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="pattern-bg border-b border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-primary/20 rounded text-xs font-medium text-primary uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"></span>
              Официальные документы
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Генератор<br />
              <span className="font-display text-gold">водительских</span><br />
              удостоверений
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Профессиональный инструмент для создания макетов водительских
              удостоверений. Точные шаблоны, быстрый экспорт, история генераций.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("generator")}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors doc-shadow"
              >
                <Icon name="Zap" size={18} />
                Начать генерацию
              </button>
              <button
                onClick={() => onNavigate("templates")}
                className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded hover:bg-primary/5 transition-colors"
              >
                <Icon name="LayoutGrid" size={18} />
                Смотреть шаблоны
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview card */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* License preview */}
          <div className="flex-1">
            <div className="license-card rounded-lg p-6 doc-shadow max-w-sm text-white" style={{aspectRatio: '1.585 / 1'}}>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <div className="text-[10px] font-mono-custom tracking-widest text-white/50 uppercase mb-0.5">Российская Федерация</div>
                  <div className="text-sm font-bold tracking-wide">ВОДИТЕЛЬСКОЕ</div>
                  <div className="text-sm font-bold tracking-wide text-gold">УДОСТОВЕРЕНИЕ</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/40 font-mono-custom">RUS</div>
                  <div className="w-8 h-8 mt-1 rounded-full border-2 border-gold/50 flex items-center justify-center">
                    <Icon name="Shield" size={14} className="text-gold/70" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 relative z-10 mt-6">
                <div className="w-16 h-20 bg-white/10 rounded border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={24} className="text-white/30" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-white/20 rounded w-32"></div>
                  <div className="h-2 bg-white/12 rounded w-24"></div>
                  <div className="h-2 bg-white/12 rounded w-28"></div>
                  <div className="flex gap-1 mt-2">
                    {["A", "B", "C"].map((cat) => (
                      <span key={cat} className="text-xs font-bold px-1.5 py-0.5 bg-gold/80 text-primary rounded font-mono-custom">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between relative z-10">
                <div className="font-mono-custom text-[9px] text-white/30 tracking-widest">99 00 000000</div>
                <div className="font-mono-custom text-[9px] text-white/30">до 01.01.2030</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-4 bg-card border border-border rounded hover:border-primary/30 transition-colors group">
                <div className="w-9 h-9 rounded bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <Icon name={f.icon} size={18} className="text-primary" />
                </div>
                <div className="font-semibold text-foreground text-sm mb-1">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-primary/4 border-y border-border">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-primary mb-10">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border z-0 -translate-x-4"></div>
                )}
                <div className="font-display text-5xl font-bold text-primary/10 leading-none mb-2">{s.num}</div>
                <div className="font-semibold text-foreground mb-1">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary mb-3">Готовы создать удостоверение?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">Займёт не более двух минут. Никакой регистрации.</p>
        <button
          onClick={() => onNavigate("generator")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors doc-shadow"
        >
          <Icon name="FileSignature" size={18} />
          Перейти к генератору
        </button>
      </section>
    </div>
  );
}
