# NIVO-CHART-IMP

## Purpose
This document defines the implementation and styling standards for Nivo charts
in the Admin Insights page. It is a reference for building the next chart with
consistent markup, sizing, legend behavior, and theme settings.

Scope:
- Submission status (Nivo Pie)
- Token usage (Nivo RadialBar)
- Shared layout/markup patterns
- Sizing rules and legend consistency

Non-goals:
- Changing API responses
- Adding new analytics endpoints
- Redesigning the overall page layout

## File Locations

Primary files:
- src/pages/admin/insights/Insights.jsx
- src/pages/admin/insights/insightsSelectors.js
- src/pages/admin/insights/Insights.css

Shared components used:
- src/components/Fieldset/Fieldset.jsx
- src/components/Card/Card.jsx
- src/components/Pill/Pill.jsx

## Layout Standard (Markup Consistency)

Charts must use the same HTML structure to keep spacing and alignment
consistent across charts.

Required structure:

1) Fieldset + Card wrapper
2) `.status-summary` container
3) `.status-chart` container
4) `.analytics-chart` container with size class
5) `.analytics-chart__inner` (used for measurement)
6) Center label overlay `.status-chart__center`
7) Metrics/pills block using `.status-metrics`

Example pattern (keep this structure):

```
<Card className="detail-card">
  <div className="status-summary">
    <div className="status-chart">
      <div className="analytics-chart analytics-chart--{chart-type}" aria-hidden="true">
        <div className="analytics-chart__inner" ref={chartRef}>
          {chart}
        </div>
      </div>
      <div className="status-chart__center">...</div>
    </div>
  </div>
  <div className="status-metrics status-metrics--{variant}">
    {pills}
  </div>
</Card>
```

Notes:
- Use `.status-summary` for both charts (Submission status and Token usage).
- Do not add custom wrappers like `.token-usage` unless required for a new layout.
- Charts must render legends inside the SVG using Nivo `legends` config (no
  separate HTML legend elements).

## Chart Sizing Rules

All charts must be the same size for visual consistency:

- Fixed container size: 220 x 220
- Class: `.analytics-chart--totals` and `.analytics-chart--token-radial`

CSS (current):
```
.analytics-chart--totals,
.analytics-chart--token-radial {
  width: 220px;
  height: 220px;
  min-width: 220px;
  max-width: 220px;
  margin: 0 auto;
}

.analytics-chart__inner {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 160px;
  min-width: 160px;
}
```

Sizing logic:
- Charts use `useChartSize` to measure `.analytics-chart__inner`.
- Pie/Radial charts render only when `width > 0` and `height > 0`.
- IMPORTANT: Line chart uses a 220x220 fallback size if measurement is not ready
  to prevent a permanent loading state.

Standard pattern (pie/radial):
```
const [chartRef, chartSize] = useChartSize()
const chartWidth = chartSize.width
const chartHeight = chartSize.height || chartSize.width
const hasSize = chartWidth > 0 && chartHeight > 0
```

Line chart fallback pattern:
```
const chartWidth = chartSize.width || 220
const chartHeight = chartSize.height || 220
```

## Shared Theme Standard

Theme must match for both Pie and RadialBar:
- fontFamily: `var(--font-sans)`
- textColor: `var(--color-text-secondary)`
- legend font weight: 600
- tooltip: same background, border, and text color

Theme config:
```
theme={{
  fontFamily: 'var(--font-sans)',
  textColor: 'var(--color-text-secondary)',
  legends: {
    text: {
      fontWeight: 600,
    },
  },
  tooltip: {
    container: {
      background: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
      borderRadius: 0,
      boxShadow: 'var(--shadow-sm)',
      fontSize: '0.85rem',
    },
  },
}}
```

## Legend Standard (Inside SVG)

Legends must be in-chart using the Nivo `legends` config.
Use the same legend config for all charts:

```
legends={[
  {
    anchor: 'bottom',
    direction: 'row',
    translateY: 28,
    itemWidth: 80,
    itemHeight: 18,
    itemsSpacing: 8,
    itemTextColor: 'var(--color-text-primary)',
    symbolSize: 10,
    symbolShape: 'circle',
  },
]}
```

Legend text must be uppercase. For RadialBar, this is done by uppercasing
category labels in the data (see `insightsSelectors.js`).

## Submission Status (Pie) Spec

Component: `<Pie />` from `@nivo/pie`

Data:
- Derived in `buildTotalsChartData()` in `insightsSelectors.js`
- Labels uppercased before passing to the chart
- Colors sourced from CSS variables:
  - Complete: `var(--color-success)`
  - Pending: `var(--color-warning)`
  - Failed: `var(--color-error)`
  - Fallback total: `var(--color-action-primary)`

Chart props:
```
innerRadius: 0.74
padAngle: 0.05
cornerRadius: 4
enableArcLabels: false
enableArcLinkLabels: false
sortByValue: false
margin: { top: 8, right: 8, bottom: 36, left: 8 }
```

Center label:
- Count uses `renderCompactCount`
- Label text: "Total"

## Token Usage (RadialBar) Spec

Component: `<RadialBar />` from `@nivo/radial-bar`

Data construction:
`buildTokenUsageRadialData()` in `insightsSelectors.js`

Series structure:
- Two series: `Avg` and `Total`
- Categories: `PROMPT`, `COMPLETION`
- Only include series when totals > 0

Example:
```
[
  {
    id: 'Avg',
    data: [
      { x: 'PROMPT', y: averagePromptTokens },
      { x: 'COMPLETION', y: averageCompletionTokens },
    ],
  },
  {
    id: 'Total',
    data: [
      { x: 'PROMPT', y: promptTokens },
      { x: 'COMPLETION', y: completionTokens },
    ],
  },
]
```

Chart props:
```
innerRadius: 0.52
padding: 0.36
padAngle: 0.02
cornerRadius: 4
startAngle: -90
endAngle: 270
enableTracks: true
tracksColor: color-mix(in srgb, var(--color-border) 70%, transparent)
enableRadialGrid: false
enableCircularGrid: false
enableLabels: false
margin: { top: 8, right: 8, bottom: 36, left: 8 }
```

Color mapping:
- PROMPT: `var(--color-info)`
- COMPLETION: `var(--color-warning)`
- Avg ring uses a lighter tint via `color-mix`.

```
colors: (bar) => {
  const baseColor =
    bar.category === 'PROMPT' ? 'var(--color-info)' : 'var(--color-warning)'
  if (bar.groupId === 'Avg') {
    return `color-mix(in srgb, ${baseColor} 45%, var(--color-surface))`
  }
  return baseColor
}
```

Center label:
- If total series exists: label "Total"
- Otherwise: label "Avg total"
- Value uses `renderCompactCount`

## Time to Complete (Line) Spec

Component: `<Line />` from `@nivo/line`

Data construction:
`buildLatencyLineData()` in `insightsSelectors.js`

Series structure:
- Two series: `P50`, `P90`
- Dates use the API `latencyByDay.date` (YYYY-MM-DD)

Example:
```
[
  { id: 'P50', data: [{ x: '2026-01-01', y: 1200 }, ...] },
  { id: 'P90', data: [{ x: '2026-01-01', y: 2400 }, ...] },
]
```

Chart props:
```
margin: { top: 8, right: 8, bottom: 36, left: 8 }
xScale: { type: 'point' }
yScale: { type: 'linear', min: 'auto', max: 'auto', stacked: false }
curve: 'monotoneX'
lineWidth: 2
colors: ['var(--color-info)', 'var(--color-warning)']
enablePoints: false
enableGridX: false
  enableGridY: false
  axisTop: null
  axisRight: null
  axisBottom: null
  axisLeft: null
  enableSlices: 'x'
  enableCrosshair: true
  crosshairType: 'x'
  useMesh: false
  yFormat: (value) => formatDurationMs(value)
  layers: ['areas', LatencyBandLayer, 'lines', 'slices', 'crosshair', 'legends']
  ```

Loading state:
- IMPORTANT: Use `loading` state for the spinner instead of size checks.
- IMPORTANT: Show spinner when `loading && !hasLatencyLineChart`.

Tooltip + band:
- Slice tooltip shows all series at a given date.
- Crosshair uses `crosshairType: 'x'`.
- Latency band is a custom layer between P50 and P90.

Center label:
- Uses `latency.p50` with suffix `ms`
- Label text: "P50"

Pills:
- P50 (info), P90 (warning)

## Pills Standard

Use shared pill layout to match spacing:
```
<div className="status-metrics status-metrics--tokens">
  <div className="status-metric">
    <Pill variant="primary" size="sm">
      <span className="status-pill__label">Submissions with usage</span>
      <span className="status-pill__value">{value}</span>
    </Pill>
  </div>
</div>
```

Pill layout is controlled by `.status-metrics` and `.status-pill__*` styles in
`Insights.css`. Use those classes for consistent spacing.

## Data Formatting

Use shared formatters:
- `formatCompactNumber` for chart values and center counts
- `formatPercent` for rates
- `formatDurationMs` for latency

Avoid direct `.toLocaleString()` for chart totals (use shared helper).

## Accessibility

- Charts are wrapped in `aria-hidden="true"` containers since center labels
  and pills expose key info textually.
- Keep center labels and pills readable for screen readers.
- If a new chart introduces unique data, add a textual summary near it.

## Error & Empty States

Empty state rules:
- If data is missing or totals are 0, show `analytics-chart__empty` message.
- If size is not available (0 width/height), show "Loading chart..."

## Consistency Checklist (Before Shipping)

1) Markup matches `status-summary > status-chart > analytics-chart`.
2) Chart size is 220x220.
3) Legend is inside the SVG using Nivo `legends`.
4) Legend text is uppercase.
5) Theme matches (fontFamily, textColor, legend weight, tooltip).
6) Center label aligns and uses `status-chart__center`.
7) Pills use `.status-metrics` and `.status-pill__*` classes.
8) Data uses shared formatters and safe defaults.

## Troubleshooting Guide

Issue: Chart blank, no console errors
- Confirm container has a size (width/height > 0).
- Ensure `ref` is on `.analytics-chart__inner`.
- Ensure `chartWidth` and `chartHeight` are passed to Nivo.

Issue: Legend spacing inconsistent
- Confirm legend config matches the standard.
- Remove external legend markup (should be inside SVG).

Issue: Legend case/weight mismatch
- Uppercase category labels at the data layer.
- Set `theme.legends.text.fontWeight = 600`.

Issue: Colors too light
- Check `color-mix` usage only for Avg series.
- Totals should use base colors.

## Implementation Template (New Chart)

1) Add data shaping in `insightsSelectors.js`.
2) Add chart props + theme in `Insights.jsx`.
3) Use shared layout wrapper in JSX.
4) Add CSS only if necessary, prefer existing classes.
5) Validate size and legend consistency with existing charts.
