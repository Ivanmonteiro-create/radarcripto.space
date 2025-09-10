// components/Toast.tsx
"use client";

import { useState } from "react";

export default function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
      onClick={() => setVisible(false)}
    >
      {message}
    </div>
  );
}
