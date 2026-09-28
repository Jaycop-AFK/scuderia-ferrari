export type PortraitFrame = {
  width: number;
  height: number;
  contentTop: number;
  contentBottom: number;
  centerX: number;
};

export type Driver = {
  id: string;
  number: number;
  code: string;
  firstName: string;
  lastName: string;
  nationality: string;
  team: string;
  colorImage: string;
  shadowImage: string;
  colorFrame: PortraitFrame;
  shadowFrame: PortraitFrame;
};

// Editorial identity only: no live rankings, championship points or invented stats.
// Frame measurements align the supplied PNGs' transparent padding without editing assets.
export const drivers: readonly Driver[] = [
  {
    id: "hamilton", number: 44, code: "HAM", firstName: "LEWIS", lastName: "HAMILTON",
    nationality: "UNITED KINGDOM", team: "SCUDERIA FERRARI HP",
    colorImage: "/images/drivers/lewis-png.png",
    shadowImage: "/images/drivers/lewis-shadow-png.png",
    colorFrame: { width: 736, height: 907, contentTop: 68, contentBottom: 906, centerX: 397 },
    shadowFrame: { width: 1024, height: 1536, contentTop: 1, contentBottom: 1535, centerX: 552 },
  },
  {
    id: "leclerc", number: 16, code: "LEC", firstName: "CHARLES", lastName: "LECLERC",
    nationality: "MONACO", team: "SCUDERIA FERRARI HP",
    colorImage: "/images/drivers/charles-png.png",
    shadowImage: "/images/drivers/charles-shadow-png.png",
    colorFrame: { width: 853, height: 1280, contentTop: 78, contentBottom: 1279, centerX: 429 },
    shadowFrame: { width: 1024, height: 1536, contentTop: 26, contentBottom: 1535, centerX: 531 },
  },
];

export const DRIVER_CALLOUTS = [
  { key: "driver", label: "DRIVER", path: "M 61 25 L 57 15 L 52 15", anchor: [61, 25] },
  { key: "number", label: "NUMBER", path: "M 54 64 L 49 78 L 43 78", anchor: [54, 64] },
  { key: "team", label: "TEAM", path: "M 75 47 L 79 39 L 81 39", anchor: [75, 47] },
  { key: "code", label: "CODE", path: "M 75 72 L 78 79 L 81 79", anchor: [75, 72] },
] as const;

export type DriverCalloutDefinition = (typeof DRIVER_CALLOUTS)[number];
export function driverCalloutValue(driver: Driver, key: DriverCalloutDefinition["key"]): string {
  if (key === "driver") return `${driver.firstName} ${driver.lastName}`;
  if (key === "number") return String(driver.number).padStart(2, "0");
  return driver[key];
}
