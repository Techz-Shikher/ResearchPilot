import React, { useState, useEffect } from 'react';
import { Upload, FileUp, AlertCircle, Trash2, FileText, HardDrive, Calendar, Download, Search, Filter, BarChart3, Filter as FilterIcon, X } from 'lucide-react';
import { uploadPDF, listUploads, deleteUpload } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loading';
import { useNavigate } from 'react-router-dom';

export const UploadPDFPage = () => {
  const [file, setFile] = useState(null);
  const [isDragover, setIsDragover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterBySize, setFilterBySize] = useState('all');
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load uploaded files on mount
  useEffect(() => {
    loadUploadedFiles();
  }, []);

  // Reload file list after successful upload
  useEffect(() => {
    if (uploadedData) {
      setTimeout(() => {
        loadUploadedFiles();
        setUploadedData(null);
      }, 1500);
    }
  }, [uploadedData]);

  const loadUploadedFiles = async () => {
    try {
      setLoadingFiles(true);
      const response = await listUploads();
      setUploadedFiles(response.data.files || []);
      setTotalSize(response.data.total_size_mb || 0);
    } catch (error) {
      console.error('Error loading files:', error);
      // Don't show error for initial load - uploads folder might not exist yet
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragover(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      showToast('Please drop a PDF file', 'error');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      showToast('Please select a PDF file', 'error');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadPDF(file);
      setUploadedData(response.data);
      showToast('PDF uploaded successfully!', 'success');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Delete "${filename}"?`)) return;

    try {
      setDeleting(filename);
      await deleteUpload(filename);
      showToast('File deleted successfully', 'success');
      await loadUploadedFiles();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete file', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleAnalyzeFile = (filename) => {
    // Navigate to paper details with the uploaded file
    const fileTitle = filename.replace('.pdf', '');
    navigate('/paper-details', {
      state: {
        paper: {
          id: filename,
          title: fileTitle,
          abstract: 'Uploaded PDF - ready for analysis',
          uploadedFile: filename
        },
        tab: 'summary'
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  // Filter and sort files
  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesSize = true;
    
    if (filterBySize === 'small') matchesSize = file.size < 5 * 1024 * 1024;
    else if (filterBySize === 'medium') matchesSize = file.size >= 5 * 1024 * 1024 && file.size < 20 * 1024 * 1024;
    else if (filterBySize === 'large') matchesSize = file.size >= 20 * 1024 * 1024;
    
    return matchesSearch && matchesSize;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.modified) - new Date(a.modified);
      case 'oldest':
        return new Date(a.modified) - new Date(b.modified);
      case 'largest':
        return b.size - a.size;
      case 'smallest':
        return a.size - b.size;
      case 'name':
        return a.filename.localeCompare(b.filename);
      default:
        return 0;
    }
  });

  const toggleFileSelection = (filename) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedFiles(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.filename)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) {
      showToast('Please select files to delete', 'warning');
      return;
    }
    if (!confirm(`Delete ${selectedFiles.size} file(s)?`)) return;

    let deleted = 0;
    for (const filename of selectedFiles) {
      try {
        await deleteUpload(filename);
        deleted++;
      } catch (error) {
        console.error(`Error deleting ${filename}:`, error);
      }
    }
    
    if (deleted === selectedFiles.size) {
      showToast(`${deleted} file(s) deleted successfully`, 'success');
    } else {
      showToast(`Deleted ${deleted}/${selectedFiles.size} file(s)`, 'warning');
    }
    setSelectedFiles(new Set());
    await loadUploadedFiles();
  };

  const getStorageStats = () => {
    const stats = {
      total: uploadedFiles.length,
      size: totalSize,
      avg: uploadedFiles.length > 0 ? totalSize / uploadedFiles.length : 0,
      largest: uploadedFiles.length > 0 ? Math.max(...uploadedFiles.map(f => f.size)) : 0,
      smallest: uploadedFiles.length > 0 ? Math.min(...uploadedFiles.map(f => f.size)) : 0,
    };
    return stats;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">PDF Workspace</h1>
        <p className="text-gray-600 text-lg">Upload and manage your research papers in one place</p>
        {uploadedFiles.length > 0 && (
          <div className="flex justify-center gap-6 pt-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{uploadedFiles.length}</div>
              <div className="text-gray-600">Files Stored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{totalSize} MB</div>
              <div className="text-gray-600">Total Size</div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border-2 border-dashed border-primary-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="text-primary-600" />
          Upload New PDF
        </h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragover(true);
          }}
          onDragLeave={() => setIsDragover(false)}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragover
              ? 'border-primary-500 bg-primary-100 scale-[1.02]'
              : 'border-primary-300 hover:border-primary-500'
          }`}
        >
          <FileUp className="mx-auto w-16 h-16 text-primary-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Drag and drop your PDF</h3>
          <p className="text-gray-600 mb-6">or click to browse</p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium cursor-pointer transition-colors"
          >
            Select File
          </label>

          {file && (
            <p className="mt-4 text-sm text-gray-700 bg-white rounded px-3 py-2 inline-block">
              📄 Selected: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Supported Format</h4>
            <p className="text-blue-800 text-sm">PDF files up to 50MB. The system extracts text and prepares for AI analysis.</p>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-6 bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload PDF
            </>
          )}
        </button>

        {/* Success Message */}
        {uploadedData && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-slideUp">
            <h4 className="font-semibold text-green-900 mb-2">✅ Upload Complete!</h4>
            <p className="text-green-800 text-sm mb-1">
              File: <span className="font-mono">{uploadedData.filename}</span>
            </p>
            <p className="text-green-700 text-sm">Loading into workspace...</p>
          </div>
        )}
      </div>

      {/* Workspace Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HardDrive className="text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Your PDF Workspace</h2>
            {!loadingFiles && uploadedFiles.length > 0 && (
              <span className="ml-auto text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Stats Dashboard */}
        {!loadingFiles && uploadedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium mb-1">Total Files</div>
              <div className="text-3xl font-bold text-blue-900">{getStorageStats().total}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600 font-medium mb-1">Total Size</div>
              <div className="text-3xl font-bold text-green-900">{formatFileSize(getStorageStats().size)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium mb-1">Avg Size</div>
              <div className="text-3xl font-bold text-purple-900">{formatFileSize(getStorageStats().avg)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-sm text-orange-600 font-medium mb-1">Largest</div>
              <div className="text-3xl font-bold text-orange-900">{formatFileSize(getStorageStats().largest)}</div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        {!loadingFiles && uploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="largest">Sort: Largest First</option>
                    <option value="smallest">Sort: Smallest First</option>
                    <option value="name">Sort: Name (A-Z)</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>

                {selectedFiles.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedFiles.size})
                  </button>
                )}
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-20">File Size:</span>
                    <select
                      value={filterBySize}
                      onChange={(e) => setFilterBySize(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Sizes</option>
                      <option value="small">Small (&lt; 5MB)</option>
                      <option value="medium">Medium (5-20MB)</option>
                      <option value="large">Large (&gt; 20MB)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Selection Controls */}
              {filteredFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                  <span>
                    {selectedFiles.size > 0 ? `${selectedFiles.size} selected` : 'Select all'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files Display */}
        {loadingFiles ? (
          <div className="text-center py-12">
            <Spinner size="md" />
            <p className="text-gray-600 mt-4">Loading workspace...</p>
          </div>
        ) : uploadedFiles.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <FileText className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No PDFs yet</h3>
            <p className="text-gray-600">Upload your first research paper to get started</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <Search className="mx-auto w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No files match your search</h3>
            <p className="text-gray-600">Try different search terms or filters</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredFiles.map((file) => (
              <div
                key={file.filename}
                className={`bg-white rounded-xl border transition-all p-5 group ${
                  selectedFiles.has(file.filename)
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
                }`}
              >
                {/* Checkbox */}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.filename)}
                    onChange={() => toggleFileSelection(file.filename)}
                    className="rounded w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* File Icon and Name */}
                <div className="flex items-start gap-3 mb-3 pt-2">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors flex-shrink-0">
                    <FileText className="text-red-600 w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm" title={file.filename}>
                      {file.filename}
                    </h3>
                  </div>
                </div>

                {/* File Details */}
                <div className="space-y-2 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(file.modified)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleAnalyzeFile(file.filename)}
                    className="flex-1 px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg transition-colors text-xs"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    disabled={deleting === file.filename}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors disabled:opacity-50 text-xs"
                  >
                    {deleting === file.filename ? (
                      <Spinner size="xs" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDFPage;
