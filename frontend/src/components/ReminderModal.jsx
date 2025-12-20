import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ReminderModal = ({ isOpen, onClose, selectedDate, reminders, onAdd, onDelete }) => {
    const [newReminder, setNewReminder] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newReminder.trim()) return;
        onAdd(newReminder);
        setNewReminder('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        Reminders
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">
                                        Date
                                    </p>
                                    <div className="flex items-center gap-2 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                        <span>📅</span>
                                        {selectedDate && format(selectedDate, 'MMMM do, yyyy')}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                                    {reminders.length > 0 ? (
                                        reminders.map((reminder) => (
                                            <motion.div
                                                key={reminder.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl group"
                                            >
                                                <span className="text-gray-700 dark:text-gray-200">
                                                    {reminder.text}
                                                </span>
                                                <button
                                                    onClick={() => onDelete(reminder.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:hover:text-red-300 p-1 transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 dark:text-gray-500 italic">
                                            No reminders set for this day.
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newReminder}
                                        onChange={(e) => setNewReminder(e.target.value)}
                                        placeholder="Add a new reminder..."
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!newReminder.trim()}
                                    >
                                        Add
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReminderModal;
