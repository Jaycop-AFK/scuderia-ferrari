type MetricProps = { value: string; unit: string; label: string; primary?: boolean };

export default function Metric({ value, unit, label, primary = false }: MetricProps) {
  return (
    <div className={primary ? "metric metric-primary" : "metric"} data-reveal="">
      <dt className="tech-label metric-label">{label}</dt>
      <dd className="metric-value">{value}<span className="metric-unit">{unit}</span></dd>
    </div>
  );
}
