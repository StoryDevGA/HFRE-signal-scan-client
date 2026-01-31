export const totalsChartProps = {
  margin: { top: 8, right: 8, bottom: 36, left: 8 },
  innerRadius: 0.74,
  padAngle: 0.05,
  cornerRadius: 4,
  colors: { datum: 'data.color' },
  enableArcLabels: false,
  enableArcLinkLabels: false,
  sortByValue: false,
  legends: [
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
  ],
  theme: {
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
  },
}
