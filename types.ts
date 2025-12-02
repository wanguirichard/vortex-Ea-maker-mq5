export enum Timeframe {
  M1 = "PERIOD_M1",
  M5 = "PERIOD_M5",
  M15 = "PERIOD_M15",
  M30 = "PERIOD_M30",
  H1 = "PERIOD_H1",
  H4 = "PERIOD_H4",
  D1 = "PERIOD_D1",
}

export interface StrategyParams {
  strategyDescription: string;
  symbol: string;
  timeframe: Timeframe;
  lotSize: number;
  stopLossPoints: number;
  takeProfitPoints: number;
  useTrailingStop: boolean;
}

export interface GeneratedCode {
  code: string;
  explanation: string;
}
