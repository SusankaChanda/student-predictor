import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useData } from '../contexts/DataContext';
import { FileText, Upload, AlertCircle, Check, RefreshCw } from 'lucide-react';

const DataUploadPage: React.FC = () => {
  const { uploadData, isLoading, error, generateDemoData } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      await uploadData(file);
      setUploadSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleGenerateDemoData = () => {
    generateDemoData();
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Student Data</h1>
      <p className="text-gray-600 mb-8">
        Upload your CSV file with student data or generate demo data
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Upload CSV File">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : uploadSuccess 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              
              {uploadSuccess ? (
                <div className="text-center text-green-600 animate-fade-in">
                  <div className="bg-white p-3 rounded-full inline-block mb-3">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium">Upload Successful!</h3>
                  <p className="mt-2">Redirecting to dashboard...</p>
                </div>
              ) : file ? (
                <div>
                  <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">{file.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {(file.size / 1024).toFixed(2)} KB • CSV file
                  </p>
                  <Button 
                    onClick={handleUpload}
                    isLoading={isLoading}
                    disabled={isLoading}
                    icon={<Upload className="h-4 w-4" />}
                  >
                    {isLoading ? 'Uploading...' : 'Process File'}
                  </Button>
                  <button 
                    onClick={() => setFile(null)}
                    className="ml-3 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Drop your CSV file here</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    or <button className="text-blue-600 hover:text-blue-800 underline" onClick={openFileSelector}>browse</button> to select
                  </p>
                  <p className="text-xs text-gray-500 px-5">
                    File should contain columns: studyHours, previousScore, attendance, difficulty, internetAccess
                  </p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">CSV File Format</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">studyHours</th>
                      <th className="border px-2 py-1">previousScore</th>
                      <th className="border px-2 py-1">attendance</th>
                      <th className="border px-2 py-1">difficulty</th>
                      <th className="border px-2 py-1">internetAccess</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border px-2 py-1">5.5</td>
                      <td className="border px-2 py-1">78</td>
                      <td className="border px-2 py-1">92.5</td>
                      <td className="border px-2 py-1">3.5</td>
                      <td className="border px-2 py-1">true</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border px-2 py-1">2.0</td>
                      <td className="border px-2 py-1">45</td>
                      <td className="border px-2 py-1">60.0</td>
                      <td className="border px-2 py-1">4.2</td>
                      <td className="border px-2 py-1">false</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The header row is required. Data types should match the example above.
              </p>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card title="Demo Data" className="mb-6">
            <div className="text-center py-3">
              <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                <RefreshCw className="h-5 w-5 text-teal-500" />
              </div>
              <h3 className="text-md font-medium mb-2">Generate Demo Dataset</h3>
              <p className="text-sm text-gray-600 mb-4">
                Don't have a CSV file? Use our demo data to test the application.
              </p>
              <Button
                onClick={handleGenerateDemoData}
                variant="secondary"
                isLoading={isLoading}
                fullWidth
              >
                Generate Data
              </Button>
            </div>
          </Card>
          
          <Card title="Using Your Data">
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                The data you upload should include these factors for each student:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded text-blue-800 mr-2 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Study Hours</span> - Average daily study time (numeric)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded text-green-800 mr-2 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Previous Score</span> - Previous exam result (0-100)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded text-purple-800 mr-2 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Attendance</span> - Class attendance percentage (0-100)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 p-1 rounded text-red-800 mr-2 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 10l-4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Difficulty</span> - Course difficulty level (1-5)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-1 rounded text-amber-800 mr-2 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Internet Access</span> - Home internet availability (true/false)
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataUploadPage;