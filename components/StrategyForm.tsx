import React, { useState } from "react";
import { StrategyParams, Timeframe } from "../types";
import { Loader2, Zap, BookOpen } from "lucide-react";

interface StrategyFormProps {
  onSubmit: (params: StrategyParams) => void;
  isGenerating: boolean;
}

const TEMPLATES = [
  {
    label: "Custom Strategy",
    value: "custom",
    content: "",
  },
  {
    label: "CRT / TJR Liquidity Model",
    value: "crt",
    content: "Implement a Candle Range Theory (CRT) strategy inspired by TJR principles.\n\n1. Time Window: Define a Reference Range (e.g., 02:00 - 05:00 Server Time).\n2. Range Identification: Mark the High and Low of this time window.\n3. Liquidity Sweep: Wait for price to sweep (break and close back inside) either the Range High or Low.\n4. Market Structure Shift (MSS): After a sweep, look for a displacement candle creating a Fair Value Gap (FVG) in the opposite direction.\n5. Entry: Place a Limit Order at the FVG or enter on Market if the FVG is retested.\n6. Stop Loss: Just beyond the swing point that swept the liquidity.\n7. Take Profit: The opposing side of the Reference Range (e.g., if Shorting from High sweep, target Range Low)."
  },
  {
    label: "RSI Reversal",
    value: "rsi",
    content: "Buy when RSI(14) crosses above 30 (Oversold exit).\nSell when RSI(14) crosses below 70 (Overbought exit).\nClose existing positions on opposite signal."
  },
  {
    label: "MA Crossover Trend",
    value: "ma",
    content: "Fast MA (Period 10) crosses above Slow MA (Period 20) -> Buy.\nFast MA crosses below Slow MA -> Sell.\nOnly take trades during London and NY sessions (08:00 - 17:00)."
  },
];

export const StrategyForm: React.FC<StrategyFormProps> = ({
  onSubmit,
  isGenerating,
}) => {
  const [params, setParams] = useState<StrategyParams>({
    strategyDescription: "",
    symbol: "EURUSD",
    timeframe: Timeframe.H1,
    lotSize: 0.1,
    stopLossPoints: 100,
    takeProfitPoints: 200,
    useTrailingStop: false,
  });

  const [selectedTemplate, setSelectedTemplate] = useState("custom");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setParams((prev) => ({ ...prev, [name]: checked }));
    } else {
        setParams((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
        }));
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    
    const template = TEMPLATES.find(t => t.value === value);
    if (template && template.content) {
        setParams(prev => ({
            ...prev,
            strategyDescription: template.content
        }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 overflow-y-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-yellow-400" />
          Strategy Builder
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Describe your trading logic and parameters.
        </p>
      </div>

      <div className="space-y-4 flex-grow">
        
        {/* Template Selector */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Quick Templates
            </label>
            <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                {TEMPLATES.map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.label}
                    </option>
                ))}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Strategy Logic
          </label>
          <textarea
            name="strategyDescription"
            required
            value={params.strategyDescription}
            onChange={(e) => {
                handleChange(e);
                if (selectedTemplate !== "custom") setSelectedTemplate("custom");
            }}
            placeholder="E.g., Buy when RSI(14) crosses above 30. Sell when RSI(14) crosses below 70. Close buy positions on Sell signal..."
            className="w-full h-40 bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-slate-600 text-sm font-mono leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Symbol
            </label>
            <input
              type="text"
              name="symbol"
              value={params.symbol}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Timeframe
            </label>
            <select
              name="timeframe"
              value={params.timeframe}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Object.entries(Timeframe).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Lot Size
            </label>
            <input
              type="number"
              step="0.01"
              name="lotSize"
              value={params.lotSize}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Stop Loss (pts)
            </label>
            <input
              type="number"
              name="stopLossPoints"
              value={params.stopLossPoints}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Take Profit (pts)
            </label>
            <input
              type="number"
              name="takeProfitPoints"
              value={params.takeProfitPoints}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
            <input 
                type="checkbox" 
                name="useTrailingStop"
                id="useTrailingStop"
                checked={params.useTrailingStop}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
             <label htmlFor="useTrailingStop" className="text-sm font-medium text-slate-300">
              Enable Trailing Stop
            </label>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isGenerating || !params.strategyDescription}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
            isGenerating
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/20"
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" /> Generating Code...
            </>
          ) : (
            "Generate Expert Advisor"
          )}
        </button>
      </div>
    </form>
  );
};