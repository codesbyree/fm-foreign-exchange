import { useConversionLogStore } from "../../../stores/use-conversion-log.store";
import { TabMenuNotification } from "../tab-menu";

export default function LoggedRatesChip() {
  const conversionLogs = useConversionLogStore((s) => s.logs);
  if (conversionLogs.length === 0) return null;
  return <TabMenuNotification>{conversionLogs.length}</TabMenuNotification>;
}
