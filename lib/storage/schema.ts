// lib/storage/schema.ts
import { z } from "zod";

export const TradeSchema = z.object({
  id: z.string(),
  pair: z.string(),
  type: z.enum(["buy", "sell"]),
  amount: z.number(),
  price: z.number(),
  timestamp: z.number(),
});

export const SettingsSchema = z.object({
  balance: z.number(),
  risk: z.number(),
});

export type Trade = z.infer<typeof TradeSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
