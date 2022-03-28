export interface FormValues {
  enabled: boolean,
  description: string,
  annual: boolean,
  date: string,
  timeRange: {
    from: string,
    to: string,
  },
  symbols: string[],
}
