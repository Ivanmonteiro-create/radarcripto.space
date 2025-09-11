"use client";

import { useEffect, useState } from "react";

type Props = {
  hidden?: boolean;
};

export default function TradePanel({ hidden = false }: Props) {
  // … o resto do seu estado/código atual …

  if (hidden) {
    // Não renderiza nada em tela cheia
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      {/* CONTROLES – manter seu conteúdo atual */}
      {/* Par, Quantidade, Saldo, Comprar/Vender, Resetar... */}
    </div>
  );
}
