import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Upload, FileText, AlertCircle, TrendingUp, Users, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [platform, setPlatform] = useState('');
  const [otherPlatform, setOtherPlatform] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [proofText, setProofText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animated counters state
  const [counters, setCounters] = useState({
    resolved: 0,
    impacted: 0,
    trust: 0
  });

  // Get user location on component mount
  useEffect(() => {
    // TODO: Connect to backend geolocation API for enhanced location services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: Send coordinates to backend for reverse geocoding
          setLocation('Chandigarh, Punjab'); // Placeholder
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

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    
    // TODO: Connect to Flask backend content analysis API
    // const response = await fetch('/api/analyze-content', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     content: content,
    //     sender: senderName,
    //     platform: platform === 'Other' ? otherPlatform : platform,
    //     location: location
    //   })
    // });
    // const data = await response.json();

    // Simulated analysis results for demo
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
    // const formData = new FormData();
    // formData.append('content', content);
    // formData.append('sender', senderName);
    // formData.append('platform', platform === 'Other' ? otherPlatform : platform);
    // formData.append('location', location);
    // formData.append('analysisResults', JSON.stringify(analysisResults));
    // formData.append('proofText', proofText);
    // if (screenshot) formData.append('screenshot', screenshot);
    
    // const response = await fetch('/api/report-incident', {
    //   method: 'POST',
    //   body: formData
    // });

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
            className="text-gray-200"
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
          <span className="text-lg font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">User Portal</h1>
                  <p className="text-sm text-gray-600">Report & Analyze Content</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Analysis Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Content Input Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Analysis</h2>
              
              <div className="space-y-6">
                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content to Analyze
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Paste WhatsApp messages, Instagram captions, LinkedIn messages, or any content you want to analyze..."
                  />
                </div>

                {/* Sender and Platform */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Who sent this message?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform/Application
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Platform</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Other Platform Input */}
                {platform === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specify Platform
                    </label>
                    <input
                      type="text"
                      value={otherPlatform}
                      onChange={(e) => setOtherPlatform(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h3>
                
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
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-800">High Risk Content Detected</h4>
                        <p className="text-red-700 text-sm">
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
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Report Incident</h3>
                
                <div className="space-y-6">
                  {/* Proof Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Provide Proof (Optional)
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="screenshot-upload"
                          // TODO: Handle file upload to backend storage
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="cursor-pointer text-sm text-gray-600 hover:text-blue-600"
                        >
                          Upload Screenshot
                        </label>
                      </div>
                      
                      <div className="space-y-2">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <textarea
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Public Trust & Impact</h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">{counters.resolved.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Issues Resolved This Year</div>
                </div>
                
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">{counters.impacted.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Lives Impacted Positively</div>
                </div>
                
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">{counters.trust}%</div>
                  <div className="text-sm text-gray-600">Community Trust Score</div>
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
