import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 text-white ${toast.type === 'success' ? 'bg-slate-800' : 'bg-red-500'}`}
                        >
                            {toast.type === 'success' ? <CheckCircle className="text-lg" /> : <WarningCircle className="text-lg" />}
                            <span>{toast.message}</span>
                            <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
                                <X />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
