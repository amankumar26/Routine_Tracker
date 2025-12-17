import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Flame } from 'lucide-react';
import { clsx } from 'clsx';

const RoutineCard = ({ routine, onToggle, onEdit, onToggleSubtask }) => {
    const isCompleted = routine.completedToday;
    const hasSubtasks = routine.subtasks && routine.subtasks.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer group",
                isCompleted
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/50 shadow-sm"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg dark:hover:shadow-gray-900/50"
            )}
            onClick={() => onToggle(routine.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div
                        className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                            isCompleted ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                        )}
                    >
                        {/* Placeholder icon logic - can be dynamic later */}
                        <span className="text-2xl">{routine.icon || '📝'}</span>
                    </div>

                    <div>
                        <h3 className={clsx(
                            "font-bold text-lg transition-all duration-300",
                            isCompleted ? "text-indigo-900 dark:text-indigo-300 line-through opacity-70" : "text-gray-800 dark:text-gray-100"
                        )}>
                            {routine.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-3">
                            <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {routine.time}
                            </span>
                            <span className={clsx("flex items-center font-medium", routine.streak > 0 ? "text-orange-500" : "text-gray-400 dark:text-gray-600")}>
                                <Flame size={14} className="mr-1" />
                                {routine.streak} day streak
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <motion.div
                        className={clsx(
                            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                            isCompleted ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-400"
                        )}
                        whileTap={{ scale: 0.8 }}
                    >
                        {isCompleted && <Check size={16} className="text-white" />}
                    </motion.div>
                </div>
            </div>

            {hasSubtasks && (
                <div className="mt-4 pl-16">
                    <div className="space-y-2">
                        {routine.subtasks.map(subtask => (
                            <div
                                key={subtask.id}
                                className="flex items-center space-x-3 text-sm group/subtask"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSubtask(routine.id, subtask.id);
                                }}
                            >
                                <div className={clsx(
                                    "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                                    subtask.completed
                                        ? "bg-indigo-500 border-indigo-500"
                                        : "border-gray-300 dark:border-gray-600 group-hover/subtask:border-indigo-400 dark:group-hover/subtask:border-indigo-400"
                                )}>
                                    {subtask.completed && <Check size={12} className="text-white" />}
                                </div>
                                <span className={clsx(
                                    "transition-colors",
                                    subtask.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-600 dark:text-gray-300"
                                )}>
                                    {subtask.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(routine); }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 rounded-lg transition-colors"
                    title="Edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(routine, 'delete'); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
            </div>
        </motion.div>
    );
};

export default RoutineCard;
