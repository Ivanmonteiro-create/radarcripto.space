"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* ========= Utils ========= */
const fmtUSD = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);
const genId = () =>
  `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/* ========= UI helpers ========= */
function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border transition
      ${active ? "bg-emerald-600/90 text-white border-emerald-500" : "bg-slate-800/60 text-slate-200 border-slate-600 hover:bg-slate-700/70"}`}
    >
      {children}
    </button>
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

/* ========= TradingView Chart (com fallback) ========= */
function TradingViewChart({ symbol = "BINANCE:BTCUSDT", interval = "5", fullscreen }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  const [mode, setMode] = useState("loading"); // loading | tv | iframe | error
  const containerId = useMemo(() => `tv-container-${genId()}`, []);

  useEffect(() => {
    let timeoutId;

    function startWidget() {
      try {
        containerRef.current.style.minHeight = fullscreen ? "78vh" : "46vh";
        widgetRef.current = new window.TradingView.widget({
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
          container_id: containerId,
        });
        setMode("tv");
      } catch (e) {
        console.error("TradingView init error:", e);
        setMode("iframe");
      }
    }

    function ensureTv() {
      if (typeof window === "undefined") return;
      if (window.TradingView?.widget) {
        startWidget();
        return;
      }
      const existing = document.getElementById("tradingview-tvjs");
      if (!existing) {
        const s = document.createElement("script");
        s.id = "tradingview-tvjs";
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.onload = () => startWidget();
        s.onerror = () => setMode("iframe");
        document.body.appendChild(s);
      } else {
        // aguarda ficar disponível
        const check = setInterval(() => {
          if (window.TradingView?.widget) {
            clearInterval(check);
            startWidget();
          }
        }, 120);
        timeoutId = setTimeout(() => {
          clearInterval(check);
          setMode("iframe");
        }, 6000);
      }
    }

    setMode("loading");
    ensureTv();

    return () => {
      try {
        widgetRef.current?.remove?.();
      } catch {}
      widgetRef.current = null;
      clearTimeout(timeoutId);
    };
  }, [symbol, interval, fullscreen, containerId]);

  // iframe fallback
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams({
      symbol,
      interval,
      theme: "dark",
      style: "1",
      withdateranges: "1",
      hide_side_toolbar: "0",
      allow_symbol_change: "0",
      locale: "br",
    });
    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }, [symbol, interval]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={`w-full ${fullscreen ? "h-[78vh]" : "h-[46vh]"} rounded-xl overflow-hidden bg-slate-900/60 border border-slate-700`}
    >
      {mode === "loading" && (
        <div className="h-full grid place-items-center text-slate-300 text-sm">Carregando gráfico…</div>
      )}
      {mode === "iframe" && (
        <iframe
          title="TradingView Chart"
          src={iframeSrc}
          className="w-full h-full"
          frameBorder="0"
          allowTransparency
          loading="lazy"
        />
      )}
      {mode === "error" && (
        <div className="h-full grid place-items-center text-rose-300 text-sm">
          Não foi possível iniciar o gráfico.
        </div>
      )}
    </div>
  );
}

/* ========= Página ========= */
export default function SimuladorPage() {
  // Estado financeiro
  const [balance, setBalance] = useState(10000);
  const [qty, setQty] = useState(0);
  const [positionValue, setPositionValue] = useState(0);
  const [orderSize, setOrderSize] = useState(100);

  // UI / misc
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT");
  const [useRSI, setUseRSI] = useState(true);
  const [useMACD, setUseMACD] = useState(false);
  const [useEMA, setUseEMA] = useState(true);
  const [useBB, setUseBB] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const [history, setHistory] = useState([]);

  // preço simulado só para P&L (o gráfico mostra o real via TV)
  const [mockPrice, setMockPrice] = useState(112000.0);
  useEffect(() => {
    const id = setInterval(
      () => setMockPrice((p) => Math.max(10, p + (Math.random() - 0.5) * 60)),
      1500
    );
    return () => clearInterval(id);
  }, []);
  const unrealized = useMemo(() => mockPrice * qty - positionValue, [mockPrice, qty, positionValue]);

  // helpers
  const notify = (msg, type = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1600);
  };

  function placeOrder(side) {
    if (orderSize <= 0) return notify("Valor da ordem inválido.", "error");
    if (side === "buy" && orderSize > balance) return notify("Saldo insuficiente.", "error");

    const price = mockPrice;
    const q = orderSize / price;

    let newBal = balance;
    let newQty = qty;
    let newPV = positionValue;

    if (side === "buy") {
      newBal -= orderSize;
      newQty += q;
      newPV += orderSize;
      notify("Compra executada!");
    } else {
      const sellQty = Math.min(qty, q);
      const sellValue = sellQty * price;
      newBal += sellValue;
      newQty -= sellQty;

      const avg = positionValue / (qty || 1);
      const realized = sellQty * (price - avg);
      newPV -= avg * sellQty;

      notify(realized >= 0 ? `Venda realizada (+${fmtUSD(realized)})` : `Venda realizada (${fmtUSD(realized)})`);
    }

    setBalance(Number(newBal.toFixed(2)));
    setQty(Number(newQty.toFixed(8)));
    setPositionValue(Number(newPV.toFixed(2)));

    setHistory((h) => [
      {
        id: genId(),
        time: new Date().toLocaleTimeString(),
        side: side === "buy" ? "Compra" : "Venda",
        price,
        amount: orderSize,
      },
      ...h,
    ]);
  }

  function resetAll() {
    setBalance(10000);
    setQty(0);
    setPositionValue(0);
    setHistory([]);
    notify("Simulador resetado.");
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100">
      <Toast show={toast.show} msg={toast.msg} type={toast.type} />

      {/* Topo fixo sem faixa branca */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            Voltar ao Início
          </Link>

          <div className="ml-2 flex items-center gap-2">
            <span className="text-slate-300">Indicadores:</span>
            <Pill active={useRSI} onClick={() => setUseRSI((v) => !v)}>RSI</Pill>
            <Pill active={useMACD} onClick={() => setUseMACD((v) => !v)}>MACD</Pill>
            <Pill active={useEMA} onClick={() => setUseEMA((v) => !v)}>EMA</Pill>
            <Pill active={useBB} onClick={() => setUseBB((v) => !v)}>BB</Pill>
          </div>

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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Gráfico */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              Gráfico — {symbol.replace("BINANCE:", "")}
            </h2>
            <span className="px-3 py-1 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200">
              {fmtUSD(mockPrice)}
            </span>
          </div>

          <TradingViewChart symbol={symbol} interval="5" fullscreen={fullscreen} />

          {/* Painéis inferiores */}
          <div className="grid gap-4 md:grid-cols-2">
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
                      <span className={h.side === "Compra" ? "text-emerald-400" : "text-rose-400"}>
                        {h.side}
                      </span>
                      <span className="text-slate-300">{fmtUSD(h.price)}</span>
                      <span className="text-slate-400">{fmtUSD(h.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
            <h3 className="font-semibold text-slate-100 mb-2">Sua conta (demo)</h3>
            <StatRow label="Saldo" value={fmtUSD(balance)} />
            <StatRow label="Quantidade" value={qty.toFixed(8)} />
            <StatRow label="Valor da posição" value={fmtUSD(positionValue)} />
            <StatRow
              label="P&L (não realizado)"
              value={`${unrealized >= 0 ? "+" : ""}${fmtUSD(unrealized)}`}
              accent={unrealized >= 0 ? "text-emerald-400" : "text-rose-400"}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
