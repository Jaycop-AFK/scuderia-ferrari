import type { CSSProperties } from "react";

type SplitHeadingProps = {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  split?: "lines" | "words" | "characters";
  stagger?: number;
  className?: string;
  id?: string;
};

export default function SplitHeading({
  lines, as: Heading = "h2", split = "lines", stagger = 0.035, className = "", id,
}: SplitHeadingProps) {
  return (
    <Heading id={id} tabIndex={-1} aria-label={lines.join(" ")}
      className={`display-heading ${className}`} data-split={split} data-stagger={stagger}>
      {lines.map((line, lineIndex) => {
        const units = split === "characters"
          ? Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(line), ({ segment }) => segment)
          : split === "words" ? line.split(" ") : [line];
        return (
          <span className="split-line" aria-hidden="true" key={lineIndex}>
            {units.map((unit, index) => (
              <span className="split-unit" data-unit="" key={index}
                style={{ "--unit-index": index } as CSSProperties}>
                {unit === " " ? "\u00a0" : unit}{split === "words" && index < units.length - 1 ? "\u00a0" : ""}
              </span>
            ))}
          </span>
        );
      })}
    </Heading>
  );
}
