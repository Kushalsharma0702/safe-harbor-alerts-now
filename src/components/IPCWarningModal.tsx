
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IPCWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onCancel: () => void;
  detectedViolations: string[];
}

const IPCWarningModal: React.FC<IPCWarningModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  onCancel,
  detectedViolations
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              IPC Violation Detected
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your content may violate Indian Penal Code sections
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Potential Violations:
          </h4>
          <ul className="space-y-2">
            {detectedViolations.map((violation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {violation}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Warning:</strong> Proceeding with this content may have legal consequences. 
            We will monitor the sentiment and report automatically if harmful content is detected.
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-gray-600"
          >
            Cancel & Delete
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            I Want to Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IPCWarningModal;
