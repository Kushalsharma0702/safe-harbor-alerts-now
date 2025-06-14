
import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface SentimentMonitorProps {
  content: string;
  isActive: boolean;
  onAutoReport: (analysis: any) => void;
}

const SentimentMonitor: React.FC<SentimentMonitorProps> = ({
  content,
  isActive,
  onAutoReport
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentData, setSentimentData] = useState(null);

  useEffect(() => {
    if (isActive && content.trim()) {
      analyzeSentiment();
    }
  }, [content, isActive]);

  const analyzeSentiment = async () => {
    setIsAnalyzing(true);
    
    // TODO: Connect to Flask NLP backend for real-time sentiment analysis
    // const response = await fetch('/api/nlp/analyze-sentiment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content })
    // });
    // const data = await response.json();

    // Simulated NLP analysis
    setTimeout(() => {
      const analysis = {
        sentiment: Math.random() > 0.3 ? 'negative' : 'positive',
        confidence: Math.random() * 0.4 + 0.6, // 60-100%
        toxicity: {
          cyberbullying: Math.floor(Math.random() * 100),
          racism: Math.floor(Math.random() * 100),
          genderBias: Math.floor(Math.random() * 100),
          harassment: Math.floor(Math.random() * 100),
          blackmail: Math.floor(Math.random() * 100)
        },
        severity: Math.random() > 0.5 ? 'high' : 'medium'
      };

      setSentimentData(analysis);
      setIsAnalyzing(false);

      // Auto-report if sentiment is negative and severity is high
      if (analysis.sentiment === 'negative' && analysis.severity === 'high') {
        onAutoReport(analysis);
      }
    }, 2000);
  };

  if (!isActive) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h4 className="font-semibold text-blue-800 dark:text-blue-200">
          NLP Sentiment Analysis Active
        </h4>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Analyzing sentiment...</span>
        </div>
      ) : sentimentData ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {sentimentData.sentiment === 'positive' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              sentimentData.sentiment === 'positive' 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              Sentiment: {sentimentData.sentiment} 
              ({Math.round(sentimentData.confidence * 100)}% confidence)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-blue-700 dark:text-blue-300">
              Cyberbullying: {sentimentData.toxicity.cyberbullying}%
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              Racism: {sentimentData.toxicity.racism}%
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              Gender Bias: {sentimentData.toxicity.genderBias}%
            </div>
            <div className="text-blue-700 dark:text-blue-300">
              Harassment: {sentimentData.toxicity.harassment}%
            </div>
          </div>

          {sentimentData.sentiment === 'negative' && sentimentData.severity === 'high' && (
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-2 rounded">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Auto-reported to police dashboard</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SentimentMonitor;
