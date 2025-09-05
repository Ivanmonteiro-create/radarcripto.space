// pages/simulador.js
import Link from "next/link";
import { useState } from "react";

function Panel({ children, style }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Simulador() {
  // estado mínimo (placeholder)
  const [saldo, setSaldo] = useState(10000);

  return (
    <section>
      {/* Topo da página: apenas voltar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Link href="/" legacyBehavior>
          <a
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              fontWeight: 600,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Voltar ao início
          </a>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1.2fr 1fr",
        }}
      >
        {/* Painel do saldo e “gráfico” ilustrativo */}
        <Panel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: 0 }}>Simulador</h2>
            <span style={{ opacity: .7, fontSize: 12 }}>BTC/USDT</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0 8px" }}>
            ${Number(60232.69).toLocaleString("en-US")}
          </div>

          <div style={{ height: 120, borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", marginBottom: 12 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            <Panel style={{ background: "rgba(0,0,0,.18)" }}>
              <div style={{ opacity: .7, fontSize: 12 }}>Saldo (USD)</div>
              <div style={{ fontWeight: 700 }}>${saldo.toLocaleString("en-US")}</div>
            </Panel>
            <Panel style={{ background: "rgba(0,0,0,.18)" }}>
              <div style={{ opacity: .7, fontSize: 12 }}>Risco por trade</div>
              <div style={{ fontWeight: 700 }}>1% × ${Math.round(saldo * 0.01).toLocaleString("en-US")}</div>
            </Panel>
            <Panel style={{ background: "rgba(0,0,0,.18)" }}>
              <div style={{ opacity: .7, fontSize: 12 }}>P/L da posição</div>
              <div style={{ fontWeight: 700 }}>+$0</div>
            </Panel>
          </div>

          <Panel style={{ marginTop: 12, background: "rgba(0,0,0,.18)" }}>
            <div style={{ opacity: .7, fontSize: 12, marginBottom: 6 }}>Histórico</div>
            <div style={{ opacity: .6 }}>Sem operações ainda.</div>
          </Panel>
        </Panel>

        {/* Parâmetros e botões */}
        <Panel>
          <h3 style={{ marginTop: 0 }}>Parâmetros</h3>

          <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            <span style={{ opacity: .75 }}>Saldo (USD)</span>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value || 0))}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#fff",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            <span style={{ opacity: .75 }}>Par</span>
            <select
              defaultValue="BTCUSDT"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#fff",
              }}
            >
              <option>BTCUSDT</option>
              <option>ETHUSDT</option>
              <option>BNBUSDT</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6, marginBottom: 16 }}>
            <span style={{ opacity: .75 }}>Risco por trade (%)</span>
            <input
              type="number"
              defaultValue={1}
              min={0}
              max={100}
              step={0.5}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.12)",
                color: "#fff",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                background: "linear-gradient(180deg,#16a34a,#15803d)",
                border: "1px solid rgba(0,0,0,.25)",
              }}
            >
              Comprar
            </button>
            <button
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                background: "linear-gradient(180deg,#dc2626,#b91c1c)",
                border: "1px solid rgba(0,0,0,.25)",
              }}
            >
              Vender
            </button>
            <button
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              Fechar
            </button>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              Resetar simulação
            </button>
          </div>

          <p style={{ opacity: .6, fontSize: 12, marginTop: 12 }}>
            *simulação didática com preço gerado localmente (sem corretores, sem dados reais).
            Próximos passos: conectar dados de mercado, ordens, métricas e relatórios.
          </p>
        </Panel>
      </div>
    </section>
  );
}
