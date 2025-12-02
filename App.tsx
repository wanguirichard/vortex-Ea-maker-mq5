import React, { useState } from "react";
import { StrategyForm } from "./components/StrategyForm";
import { CodeViewer } from "./components/CodeViewer";
import { StrategyParams } from "./types";
import { generateExpertAdvisor } from "./services/geminiService";
import { Terminal } from "lucide-react";

const App: React.FC = () => {
  const [code, setCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStrategySubmit = async (params: StrategyParams) => {
    setIsGenerating(true);
    setError(null);
    setCode(null);

    try {
      const generatedCode = await generateExpertAdvisor(params);
      setCode(generatedCode);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex-none h-16 bg-slate-950 border-b border-slate-800 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            MQL5 Wizard <span className="text-blue-500">AI</span>
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-mono hidden md:block">
          Powered by Gemini 2.5/3.0
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Input */}
          <div className="h-full overflow-hidden">
            <StrategyForm
              onSubmit={handleStrategySubmit}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Panel: Output */}
          <div className="h-full overflow-hidden">
            <CodeViewer
              code={code}
              error={error}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
      
      {/* Disclaimer Footer */}
      <footer className="flex-none py-2 px-6 text-center text-[10px] text-slate-600 border-t border-slate-800 bg-slate-950">
        DISCLAIMER: This tool uses AI to generate code. Always backtest and verify strategies on a demo account before using real money. Trading involves significant risk.
      </footer>
    </div>
  );
};

export default App;
