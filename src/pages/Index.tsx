import { useState } from "react";
import Icon from "@/components/ui/icon";
import Home from "./Home";
import Generator from "./Generator";
import History from "./History";
import Templates from "./Templates";

type Page = "home" | "generator" | "history" | "templates";

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "generator", label: "Генератор", icon: "FileSignature" },
  { id: "history", label: "История", icon: "ClipboardList" },
  { id: "templates", label: "Шаблоны", icon: "LayoutGrid" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: string) => {
    setPage(p as Page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Icon name="CreditCard" size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-primary text-sm tracking-tight">
              Удостоверение<span className="text-gold">ПРО</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`nav-link flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-colors ${
                  page === item.id
                    ? "text-primary active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("generator")}
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
            >
              <Icon name="Plus" size={14} />
              Создать
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded hover:bg-muted transition-colors"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium border-b border-border last:border-0 transition-colors ${
                  page === item.id
                    ? "bg-primary/5 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {page !== "home" && (
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-6 py-2 flex items-center gap-2 text-xs text-muted-foreground">
            <button onClick={() => navigate("home")} className="hover:text-foreground transition-colors">
              Главная
            </button>
            <Icon name="ChevronRight" size={12} />
            <span className="text-foreground font-medium">
              {NAV_ITEMS.find((n) => n.id === page)?.label}
            </span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {page === "home" && <Home onNavigate={navigate} />}
        {page === "generator" && <Generator />}
        {page === "history" && <History onNavigate={navigate} />}
        {page === "templates" && <Templates onNavigate={navigate} />}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Icon name="CreditCard" size={12} className="text-primary-foreground" />
            </div>
            <span className="text-xs font-bold text-primary">
              Удостоверение<span className="text-gold">ПРО</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Генератор водительских удостоверений · Только для образовательных целей
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors" onClick={() => navigate("generator")}>Генератор</button>
            <button className="hover:text-foreground transition-colors" onClick={() => navigate("templates")}>Шаблоны</button>
            <button className="hover:text-foreground transition-colors" onClick={() => navigate("history")}>История</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
