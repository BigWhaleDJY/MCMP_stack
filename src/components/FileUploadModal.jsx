import React, { useState } from 'react';
import Modal from './Modal';
import { CloudArrowUp, X } from '@phosphor-icons/react';

const FileUploadModal = ({ isOpen, onClose, onSubmit, moduleTitle }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) {
            onSubmit({
                file: selectedFile,
                notes: notes
            });
            // Reset form
            setSelectedFile(null);
            setNotes('');
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setNotes('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Upload File - ${moduleTitle}`}
            headerColor="bg-teal-600"
        >
            <form onSubmit={handleSubmit}>
                {/* File Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all mb-6 ${isDragging
                            ? 'border-teal-500 bg-teal-50'
                            : selectedFile
                                ? 'border-green-500 bg-green-50'
                                : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {selectedFile ? (
                        <div className="flex flex-col items-center">
                            <CloudArrowUp className="text-5xl text-green-600 mb-3" />
                            <p className="font-bold text-slate-800 mb-1">{selectedFile.name}</p>
                            <p className="text-sm text-slate-500 mb-3">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                            >
                                <X /> Remove File
                            </button>
                        </div>
                    ) : (
                        <>
                            <CloudArrowUp className="text-5xl text-slate-400 mb-3 mx-auto" />
                            <p className="font-medium text-slate-700 mb-1">
                                Drag & drop your file here
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                Supported: PDF, JPG, PNG, DOCX (Max 10MB)
                            </p>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                                    onChange={handleFileSelect}
                                />
                                <span className="inline-block px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition">
                                    Browse Files
                                </span>
                            </label>
                        </>
                    )}
                </div>

                {/* Upload Notes */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Upload Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                        placeholder="Add any relevant notes or comments about this upload..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedFile}
                        className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition ${selectedFile
                                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Upload Document <CloudArrowUp />
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FileUploadModal;
