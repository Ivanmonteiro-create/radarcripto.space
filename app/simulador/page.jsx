"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ==== UI helpers ====
function Pill({ active, onClick, children, ariaLabel }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`px-3 py-1 rounded-full border transition
        ${active ? "bg-emerald-600/90 text-white border-emerald-500" : "bg-slate-800/60 text-slate-200 border-slate-600 hover:bg-slate-700/70"}`}
    >
      {children}
    </button>
  );
}

function Toast({ msg, type = "success", show }) {
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 top-4 z-50 px-4 py-2 rounded-xl shadow-lg text-sm
        transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
        ${type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}
    >
      {msg}
    </div>
  );
}

function StatRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-300">{label}</span>
      <span className={`font-semibold ${accent ?? "text-slate-100"}`}>{value}</span>
    </div>
  );
}

// ==== Tutorial modal (simples) ====
function TutorialModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-[min(680px,92vw)] bg-slate-900/95 border border-slate-700 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-slate-100">Como usar o simulador</h3>
        <ol className="list-decimal pl-5 mt-3 space-y-2 text-slate-200/90">
          <li>Escolha o ativo no seletor (ex: <b>Bitcoin</b>).</li>
          <li>Use os botões <b>RSI</b>, <b>MACD</b>, <b>EMA</b>, <b>BB</b> para ligar/desligar indicadores.</li>
          <li>Defina o <b>tamanho da ordem</b> e clique em <b>Comprar</b> ou <b>Vender</b>.</li>
          <li>Acompanhe o <b>P&amp;L</b> não realizado e seu <b>saldo</b> no painel à direita.</li>
          <li>Use <b>Resetar</b> para recomeçar e <b>Compartilhar resultado</b> para mostrar seu progresso.</li>
        </ol>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

// ==== Botão compartilhar ====
function SharePnLButton({ stats }) {
  const onShare = async () => {
    const text = `Meu desempenho no RadarCrypto.space:
• Operações: ${stats.trades}
• Lucro acumulado: ${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(2)}
• Taxa de acerto: ${stats.hitRate.toFixed(0)}%
Experimente você também: radarcrypto.space`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Resumo copiado! Cole onde quiser (WhatsApp, Telegram, etc.).");
    } catch {
      alert(text);
    }
  };
  return (
    <button
      onClick={onShare}
      className="w-full mt-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white py-2 font-medium"
    >
      Compartilhar resultado
    </button>
  );
}

// ==== Componente de gráfico (TradingView) ====
function TradingViewChart({ symbol = "BINANCE:BTCUSDT", interval = "5", fullscreen }) {
  const container = useRef(null);

  useEffect(() => {
    // evita duplicar script
    if (document.getElementById("tv-script")) return;

    const script = document.createElement("script");
    script.id = "tv-script";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.TradingView || !container.current) return;

    const widget = new window.TradingView.widget({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#0f172a",
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: container.current.id,
      studies: [], // indicadores serão ligados/desligados por “chips”
    });

    return () => {
      // o widget remove-se sozinho quando o container sai do DOM
      if (widget && widget.remove) widget.remove();
    };
  }, [symbol, interval, fullscreen]); // refaz quando entra/saí do modo fullscreen

  return (
    <div
      id="tv-container"
      ref={container}
      className={`w-full ${fullscreen ? "h-[78vh]" : "h-[46vh]"} rounded-xl overflow-hidden bg-slate-900/60 border border-slate-700`}
    />
  );
}

// ==== Simulador (estado simples em memória) ====
export default function SimuladorPage() {
  // estado de conta/ordens
  const [balance, setBalance] = useState(10000);
  const [qty, setQty] = useState(0);
  const [positionValue, setPositionValue] = useState(0);
  const [orderSize, setOrderSize] = useState(100);
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");

  // histórico local
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  // UI/indicadores
  const [useRSI, setUseRSI] = useState(true);
  const [useMACD, setUseMACD] = useState(false);
  const [useEMA, setUseEMA] = useState(true);
  const [useBB, setUseBB] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // preço “atual” (apenas visual nesta versão; você já está puxando do TradingView)
  const [mockPrice, setMockPrice] = useState(112000.0);

  useEffect(() => {
    const id = setInterval(() => {
      // pequena variação para exemplo
      setMockPrice((p) => {
        const delta = (Math.random() - 0.5) * 60;
        return Math.max(10, p + delta);
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // P&L não realizado
  const unrealized = useMemo(() => {
    // aqui, tratamos qty como quantidade do ativo (ex.: BTC)
    return (mockPrice * qty) - positionValue;
  }, [mockPrice, qty, positionValue]);

  // estatísticas para “Resumo”
  const stats = useMemo(() => {
    const trades = history.length;
    const totalPnl = history.reduce((acc, h) => acc + h.pnl, 0);
    const wins = history.filter((h) => h.pnl > 0).length;
    const hitRate = trades ? (wins / trades) * 100 : 0;
    return { trades, totalPnl, hitRate };
  }, [history]);

  // helpers
  const formatUSD = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

  const notify = (msg, type = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
  };

  const placeOrder = (side) => {
    if (orderSize <= 0) return notify("Valor da ordem inválido.", "error");
    if (side === "buy" && orderSize > balance) return notify("Saldo insuficiente.", "error");

    const price = mockPrice;
    const qtyDelta = orderSize / price;

    let newBalance = balance;
    let newQty = qty;
    let newPositionValue = positionValue;

    if (side === "buy") {
      newBalance -= orderSize;
      newQty += qtyDelta;
      newPositionValue += orderSize;
      notify("Compra executada!");
    } else {
      // venda até o limite da posição
      const sellQty = Math.min(qty, qtyDelta);
      const sellValue = sellQty * price;
      newBalance += sellValue;
      newQty -= sellQty;
      // reconhece PnL proporcional na posição
      const avgPrice = positionValue / (qty || 1);
      const realized = sellQty * (price - avgPrice);
      newPositionValue -= avgPrice * sellQty;

      notify(realized >= 0 ? `Venda realizada (+${formatUSD(realized)})` : `Venda realizada (${formatUSD(realized)})`);
    }

    setBalance(Number(newBalance.toFixed(2)));
    setQty(Number(newQty.toFixed(8)));
    setPositionValue(Number(newPositionValue.toFixed(2)));

    setHistory((h) => [
      {
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        side: side === "buy" ? "Compra" : "Venda",
        price,
        amount: orderSize,
        pnl: 0, // não realizado é mostrado em tempo real
      },
      ...h,
    ]);
  };

  const resetAll = () => {
    setBalance(10000);
    setQty(0);
    setPositionValue(0);
    setHistory([]);
    notify("Simulador resetado.");
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100">
      {/* Toast */}
      <Toast show={toast.show} msg={toast.msg} type={toast.type} />

      {/* Header compacto (colado no topo) */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            Voltar ao Início
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              title="Ativo"
            >
              <option value="BINANCE:BTCUSDT">Bitcoin (BTC)</option>
              <option value="BINANCE:ETHUSDT">Ethereum (ETH)</option>
              <option value="BINANCE:SOLUSDT">Solana (SOL)</option>
              <option value="BINANCE:XRPUSDT">XRP (XRP)</option>
              <option value="BINANCE:ADAUSDT">Cardano (ADA)</option>
              <option value="BINANCE:BNBUSDT">BNB (BNB)</option>
              <option value="BINANCE:DOGEUSDT">Dogecoin (DOGE)</option>
              <option value="BINANCE:LINKUSDT">Chainlink (LINK)</option>
            </select>

            <button
              onClick={() => setFullscreen((f) => !f)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100"
            >
              {fullscreen ? "Sair da tela cheia" : "Expandir gráfico"}
            </button>

            <button
              onClick={() => setShowTutorial(true)}
              className="px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 border border-sky-600 text-white"
            >
              Tutorial
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-7xl px-4 py-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Coluna esquerda: gráfico + indicadores + preço atual */}
        <section className="space-y-3">
          {/* barra de indicadores */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-slate-300">Indicadores:</span>
            <Pill active={useRSI} onClick={() => setUseRSI((v) => !v)} ariaLabel="RSI on/off">RSI</Pill>
            <Pill active={useMACD} onClick={() => setUseMACD((v) => !v)} ariaLabel="MACD on/off">MACD</Pill>
            <Pill active={useEMA} onClick={() => setUseEMA((v) => !v)} ariaLabel="EMA on/off">EMA</Pill>
            <Pill active={useBB} onClick={() => setUseBB((v) => !v)} ariaLabel="BB on/off">BB</Pill>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200">
                {formatUSD(mockPrice)}
              </span>
            </div>
          </div>

          {/* gráfico */}
          <TradingViewChart symbol={symbol} interval="5" fullscreen={fullscreen} />

          {/* ações + histórico (desktop: abaixo do gráfico) */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* bloco de ações */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
              <h3 className="font-semibold text-slate-100 mb-2">Ações</h3>
              <label className="block text-sm text-slate-300 mb-1">Tamanho da ordem (USDT)</label>
              <input
                type="number"
                min={10}
                step={10}
                value={orderSize}
                onChange={(e) => setOrderSize(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => placeOrder("buy")}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 font-semibold"
                >
                  Comprar
                </button>
                <button
                  onClick={() => placeOrder("sell")}
                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white py-2 font-semibold"
                >
                  Vender
                </button>
              </div>
              <button
                onClick={resetAll}
                className="w-full mt-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 py-2"
              >
                Resetar
              </button>
            </div>

            {/* histórico */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-100">Histórico de operações</h3>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs px-2 py-1 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700"
                  >
                    Limpar histórico
                  </button>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-2">
                Educação, não recomendação de investimento.
              </p>
              <div className="max-h-[200px] overflow-auto pr-1 space-y-2">
                {history.length === 0 ? (
                  <div className="text-slate-400 text-sm">Sem operações por enquanto.</div>
                ) : (
                  history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between text-sm border-b border-slate-800 pb-1"
                    >
                      <span className="text-slate-300">{h.time}</span>
                      <span className={`${h.side === "Compra" ? "text-emerald-400" : "text-rose-400"}`}>
                        {h.side}
                      </span>
                      <span className="text-slate-300">{formatUSD(h.price)}</span>
                      <span className="text-slate-400">{formatUSD(h.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Coluna direita: conta + resumo + compartilhar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Sua conta (demo)</h3>
            <StatRow label="Saldo" value={formatUSD(balance)} />
            <StatRow label="Quantidade" value={qty.toFixed(8)} />
            <StatRow label="Valor da posição" value={formatUSD(positionValue)} />
            <StatRow
              label="P&L (não realizado)"
              value={`${unrealized >= 0 ? "+" : ""}${formatUSD(unrealized)}`}
              accent={unrealized >= 0 ? "text-emerald-400" : "text-rose-400"}
            />
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Resumo</h3>
            <StatRow label="Operações" value={stats.trades} />
            <StatRow
              label="Lucro acumulado"
              value={`${stats.totalPnl >= 0 ? "+" : ""}${formatUSD(stats.totalPnl)}`}
              accent={stats.totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}
            />
            <StatRow label="Taxa de acerto" value={`${stats.hitRate.toFixed(0)}%`} />
            <SharePnLButton stats={stats} />
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 py-2"
            >
              Ver tutorial novamente
            </button>
          </div>
        </aside>
      </main>

      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
