import { driverCalloutValue, type Driver, type DriverCalloutDefinition } from "@/data/drivers";
import styles from "./Drivers.module.css";

export default function DriverCallout({ driver, definition }: { driver: Driver; definition: DriverCalloutDefinition }) {
  return <div className={`${styles.callout} ${styles[definition.key]}`} data-callout={definition.key}>
    <svg className={styles.leader} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={definition.path} pathLength="1" data-leader="" />
      <ellipse cx={definition.anchor[0]} cy={definition.anchor[1]} rx=".23" ry=".36" data-anchor="" />
    </svg>
    <div className={styles.calloutBox} data-callout-box="">
      <dl data-callout-text=""><dt>{definition.label}</dt><dd>{driverCalloutValue(driver, definition.key)}</dd></dl>
    </div>
  </div>;
}
