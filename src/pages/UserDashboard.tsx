import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Upload, FileText, AlertCircle, TrendingUp, Users, Award, ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import IPCWarningModal from '@/components/IPCWarningModal';
import SentimentMonitor from '@/components/SentimentMonitor';

const UserDashboard = () => {
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [platform, setPlatform] = useState('');
  const [otherPlatform, setOtherPlatform] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [proofText, setProofText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // New states for IPC and sentiment monitoring
  const [showIPCWarning, setShowIPCWarning] = useState(false);
  const [sentimentMonitoring, setSentimentMonitoring] = useState(false);
  const [detectedViolations, setDetectedViolations] = useState([]);

  // Animated counters state
  const [counters, setCounters] = useState({
    resolved: 0,
    impacted: 0,
    trust: 0
  });

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Chandigarh, Punjab');
        },
        () => {
          setLocation('Location access denied');
        }
      );
    } else {
      setLocation('Location not supported');
    }
  }, []);

  // Animate counters on mount
  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const resolvedTarget = 12345;
      const impactedTarget = 56789;
      const trustTarget = 98.5;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          resolved: Math.floor(resolvedTarget * progress),
          impacted: Math.floor(impactedTarget * progress),
          trust: parseFloat((trustTarget * progress).toFixed(1))
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    };

    animateCounters();
  }, []);

  // Check for IPC violations when content changes
  useEffect(() => {
    if (content.trim()) {
      checkIPCViolations(content);
    }
  }, [content]);

  const checkIPCViolations = async (text) => {
    // TODO: Connect to Flask backend for IPC violation detection
    // const response = await fetch('/api/check-ipc-violations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: text })
    // });
    // const data = await response.json();

    // Simulated IPC violation detection
    const violations = [];
    const textLower = text.toLowerCase();
    
    if (textLower.includes('threat') || textLower.includes('kill') || textLower.includes('harm')) {
      violations.push('Section 506 - Criminal intimidation');
    }
    if (textLower.includes('defame') || textLower.includes('reputation')) {
      violations.push('Section 499 - Defamation');
    }
    if (textLower.includes('blackmail') || textLower.includes('extort')) {
      violations.push('Section 383 - Extortion');
    }
    if (textLower.includes('stalk') || textLower.includes('follow')) {
      violations.push('Section 354D - Stalking');
    }

    if (violations.length > 0) {
      setDetectedViolations(violations);
      setShowIPCWarning(true);
    }
  };

  const handleIPCContinue = () => {
    setShowIPCWarning(false);
    setSentimentMonitoring(true);
    console.log('User chose to continue despite IPC warnings - NLP monitoring activated');
  };

  const handleIPCCancel = () => {
    setShowIPCWarning(false);
    setContent(''); // Clear the violating content
    setSentimentMonitoring(false);
    console.log('User cancelled - content cleared automatically');
  };

  const handleAutoReport = async (analysis) => {
    // TODO: Auto-report to Flask backend police dashboard
    // const response = await fetch('/api/auto-report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     content,
    //     sender: senderName,
    //     platform: platform === 'Other' ? otherPlatform : platform,
    //     location,
    //     analysis,
    //     timestamp: new Date().toISOString(),
    //     autoReported: true
    //   })
    // });

    console.log('Auto-reported to police dashboard:', analysis);
    alert('Content automatically reported to authorities due to high toxicity levels.');
  };

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // TODO: Connect to Flask backend content analysis API
    setTimeout(() => {
      setAnalysisResults({
        bullying: Math.floor(Math.random() * 60) + 20,
        harassment: Math.floor(Math.random() * 50) + 10,
        abusive: Math.floor(Math.random() * 70) + 15,
        negative: Math.floor(Math.random() * 40) + 5
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const reportIncident = async () => {
    if (!analysisResults) return;

    // TODO: Connect to Flask backend incident reporting API
    alert('Incident reported successfully! You will be contacted by authorities if needed.');
  };

  const ProgressCircle = ({ percentage, label, color }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${percentage * 2.51} 251`}
            className={color}
            style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-background/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Portal</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Report & Analyze Content</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Analysis Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Content Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Content Analysis</h2>
              </div>
              
              <div className="space-y-6">
                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content to Analyze
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter text messages, social media posts, or any content you want to analyze for harassment, bullying, or other harmful content..."
                  />
                </div>

                {/* IPC Warning Modal */}
                <IPCWarningModal
                  isOpen={showIPCWarning}
                  onClose={() => setShowIPCWarning(false)}
                  onContinue={handleIPCContinue}
                  onCancel={handleIPCCancel}
                  detectedViolations={detectedViolations}
                />

                {/* Sentiment Monitor */}
                <SentimentMonitor
                  content={content}
                  isActive={sentimentMonitoring}
                  onAutoReport={handleAutoReport}
                />

                {/* Sender and Platform */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Who sent this message?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform/Application
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Platform</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Reddit">Reddit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Other Platform Input */}
                {platform === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specify Platform
                    </label>
                    <input
                      type="text"
                      value={otherPlatform}
                      onChange={(e) => setOtherPlatform(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter platform name"
                    />
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={analyzeContent}
                  disabled={!content.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResults && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analysis Results</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <ProgressCircle 
                    percentage={analysisResults.bullying} 
                    label="Bullying" 
                    color="text-red-500" 
                  />
                  <ProgressCircle 
                    percentage={analysisResults.harassment} 
                    label="Harassment" 
                    color="text-orange-500" 
                  />
                  <ProgressCircle 
                    percentage={analysisResults.abusive} 
                    label="Abusive" 
                    color="text-yellow-500" 
                  />
                  <ProgressCircle 
                    percentage={analysisResults.negative} 
                    label="Other Negative" 
                    color="text-purple-500" 
                  />
                </div>

                {/* Severity Alert */}
                {Math.max(analysisResults.bullying, analysisResults.harassment, analysisResults.abusive) > 60 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">High Risk Content Detected</h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          This content shows significant signs of harassment or bullying. We recommend reporting this incident.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reporting Section */}
            {analysisResults && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Report Incident</h3>
                
                <div className="space-y-6">
                  {/* Proof Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Provide Proof (Optional)
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Upload Screenshot
                        </label>
                      </div>
                      
                      <div className="space-y-2">
                        <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        <textarea
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Paste additional text proof..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Button */}
                  <button
                    onClick={reportIncident}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  >
                    Report Incident to Authorities
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Trust & Impact Stats */}
          <div className="space-y-6">
            
            {/* Trust Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Public Trust & Impact</h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">{counters.resolved.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Issues Resolved This Year</div>
                </div>
                
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">{counters.impacted.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Lives Impacted Positively</div>
                </div>
                
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">{counters.trust}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Community Trust Score</div>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                If you're in immediate danger, please contact emergency services.
              </p>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="font-semibold">Emergency</div>
                  <div className="text-lg">112</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="font-semibold">Cyber Crime Helpline</div>
                  <div className="text-lg">1930</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
