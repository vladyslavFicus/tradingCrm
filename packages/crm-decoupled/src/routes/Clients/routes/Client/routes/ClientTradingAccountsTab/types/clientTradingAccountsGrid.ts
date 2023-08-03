export type Statistic = {
  login: number,
  balance: number,
  margin: number,
  freeMargin: number,
  marginLevel: number,
  equity: number,
  openPnL: number,
  closedPnL: number,
};

export type StreamData = {
  data: Statistic,
};
