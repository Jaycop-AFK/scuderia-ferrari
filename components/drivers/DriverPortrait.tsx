import Image from "next/image";
import type { CSSProperties } from "react";
import type { Driver, PortraitFrame } from "@/data/drivers";
import styles from "./Drivers.module.css";

function framing(frame: PortraitFrame): CSSProperties {
  const contentHeight = frame.contentBottom - frame.contentTop + 1;
  return {
    height: `${frame.height / contentHeight * 100}%`,
    bottom: `${-(frame.height - 1 - frame.contentBottom) / contentHeight * 100}%`,
    transform: `translateX(-${frame.centerX / frame.width * 100}%)`,
  };
}

export default function DriverPortrait({ driver, warm }: { driver: Driver; warm: boolean }) {
  return <span className={styles.portraitArt} data-portrait-art="" aria-hidden="true">
    <span className={styles.shadowLayer} data-driver-shadow="">
      <Image src={driver.shadowImage} width={driver.shadowFrame.width} height={driver.shadowFrame.height}
        style={framing(driver.shadowFrame)} sizes="(max-width: 700px) 85vw, 45vw"
        loading={warm ? "eager" : "lazy"} alt="" draggable={false} className={styles.portraitImage} />
    </span>
    <span className={styles.colorLayer} data-driver-color="">
      <Image src={driver.colorImage} width={driver.colorFrame.width} height={driver.colorFrame.height}
        style={framing(driver.colorFrame)} sizes="(max-width: 700px) 85vw, 45vw"
        loading={warm ? "eager" : "lazy"} alt="" draggable={false} className={styles.portraitImage} />
    </span>
  </span>;
}
