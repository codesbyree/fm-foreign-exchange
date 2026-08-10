import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConversionLogType } from "../types/conversion.types";
import moment from "moment";

interface ConversionLogState {
  logs: ConversionLogType[];
  saveToLog: (val: Omit<ConversionLogType, "id" | "time">) => void;
  removeFromLog: (id: string) => void;
  clearLog: () => void;
}

export const useConversionLogStore = create<ConversionLogState>()(
  persist(
    (set) => ({
      logs: [],
      saveToLog: (val) => set((state) => ({ logs: [{ ...val, id: uuidv4(), time: moment().toISOString() }, ...state.logs] })),
      removeFromLog: (id) => set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
      clearLog: () => set(() => ({ logs: [] })),
    }),
    { name: "log-conversions", partialize: (state) => ({ logs: state.logs }) },
  ),
);
