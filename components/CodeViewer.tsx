import React, { useState, useEffect } from "react";
import { Copy, Download, Check, Code2, AlertCircle } from "lucide-react";

interface CodeViewerProps {
  code: string | null;
  error: string | null;
  isGenerating: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  error,
  isGenerating,
}) => {
  const [copied, setCopied] = useState(false);

  // Strip markdown code blocks if present to just show raw code
  const cleanCode = code
    ? code.replace(/^```mql5|^```c|^```/gm, "").replace(/^```$/gm, "")
    : "";

  const handleCopy = () => {
    if (cleanCode) {
      navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (cleanCode) {
      const element = document.createElement("a");
      const file = new Blob([cleanCode], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "ExpertAdvisor.mq5";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (error) {
    return (
      <div className="h-full w-full bg-slate-800 rounded-xl border border-red-900/50 p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-400">Generation Failed</h3>
        <p className="text-slate-400 mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="h-full w-full bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center text-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-white mt-6">Writing Code...</h3>
        <p className="text-slate-400 mt-2 animate-pulse">
          Analyzing strategy logic and constructing MQL5 classes.
        </p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full w-full bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center text-center border-dashed">
        <Code2 className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-300">No Code Generated Yet</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          Fill out the strategy details on the left and click Generate to create your Expert Advisor.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-mono text-slate-400">ExpertAdvisor.mq5</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs uppercase font-bold tracking-wider"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs uppercase font-bold tracking-wider"
            title="Download .mq5"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-[#0d1117] p-4 relative group">
        <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(cleanCode) }}></code>
        </pre>
      </div>
    </div>
  );
};

// Simple syntax highlighter for MQL5 keywords
const syntaxHighlight = (code: string) => {
    // Escape HTML entities first
    let escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Keywords (simplified list)
    const keywords = /\b(void|int|double|bool|string|class|public|private|protected|virtual|override|return|if|else|for|while|do|break|continue|switch|case|default|struct|enum|input|sinput)\b/g;
    // MQL5 specific
    const mqlKeywords = /\b(OnInit|OnDeinit|OnTick|Print|Alert|OrderSend|SymbolInfoDouble|PositionSelect|PositionGetDouble|PositionGetInteger|CTrade|MqlTradeRequest|MqlTradeResult)\b/g;
    // Comments
    const comments = /(\/\/.*)/g;
    // Strings
    const strings = /("[^"]*")/g;

    return escaped
        .replace(strings, '<span class="text-green-400">$1</span>')
        .replace(comments, '<span class="text-slate-500 italic">$1</span>')
        .replace(keywords, '<span class="text-purple-400 font-bold">$1</span>')
        .replace(mqlKeywords, '<span class="text-blue-400">$1</span>');
}
