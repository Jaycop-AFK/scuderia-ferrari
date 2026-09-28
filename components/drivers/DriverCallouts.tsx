import { DRIVER_CALLOUTS, type Driver } from "@/data/drivers";
import DriverCallout from "./DriverCallout";
import styles from "./Drivers.module.css";

export default function DriverCallouts({ driver }: { driver: Driver }) {
  return <>
    {/* Full identity is always available in the visible summary; annotations are decorative duplicates. */}
    <div id={`driver-${driver.id}-callouts`} className={styles.callouts} aria-hidden="true">
      {DRIVER_CALLOUTS.map((definition) => <DriverCallout key={definition.key} driver={driver} definition={definition} />)}
    </div>
    <dl className={styles.mobileFacts}>
      <div><dt>TEAM</dt><dd>{driver.team}</dd></div>
      <div><dt>NATIONALITY</dt><dd>{driver.nationality}</dd></div>
      <div><dt>DRIVER CODE</dt><dd>{driver.code} / {driver.number}</dd></div>
    </dl>
  </>;
}
