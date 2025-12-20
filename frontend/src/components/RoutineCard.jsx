import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Flame, ListTodo } from 'lucide-react';
import { clsx } from 'clsx';

const RoutineCard = ({ routine, onToggle, onEdit, onToggleSubtask }) => {
    const isCompleted = routine.completedToday;
    const hasSubtasks = routine.subtasks && routine.subtasks.length > 0;

    // Calculate Subtask Percentage
    const subtaskProgress = hasSubtasks
        ? Math.round((routine.subtasks.filter(st => st.completed).length / routine.subtasks.length) * 100)
        : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer group overflow-hidden",
                isCompleted
                    ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-indigo-900/20"
            )}
            onClick={() => onToggle(routine.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div
                        className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm",
                            isCompleted ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300" : "bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white"
                        )}
                    >
                        {/* Placeholder icon logic - can be dynamic later */}
                        <span className="text-2xl">{routine.icon || '📝'}</span>
                    </div>

                    <div>
                        <h3 className={clsx(
                            "font-bold text-lg mb-2 transition-all duration-300",
                            isCompleted ? "text-indigo-900 dark:text-indigo-300 line-through opacity-70" : "text-gray-800 dark:text-gray-100"
                        )}>
                            {routine.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                            {/* Time */}
                            <span className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                <motion.div
                                    animate={{ rotate: [0, 15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                >
                                    <Clock size={12} className="mr-1.5" />
                                </motion.div>
                                {routine.time}
                            </span>

                            {/* Streak */}
                            <span className={clsx("flex items-center px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-900/10",
                                routine.streak > 0 ? "text-orange-600 dark:text-orange-400 font-medium" : "text-gray-400 dark:text-gray-500"
                            )}>
                                <motion.div
                                    animate={routine.streak > 0 ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Flame size={12} className="mr-1.5" />
                                </motion.div>
                                {routine.streak} streak
                            </span>

                            {/* Subtask Percent */}
                            {hasSubtasks && (
                                <span className={clsx("flex items-center font-medium px-2 py-1 rounded-md transition-colors",
                                    subtaskProgress === 100
                                        ? "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400"
                                        : "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400"
                                )}>
                                    <ListTodo size={12} className="mr-1.5" />
                                    {subtaskProgress}%
                                </span>
                            )}
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
                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="pl-2">
                        {/* Progress Bar for Subtasks */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subtaskProgress}%` }}
                                    className={clsx("h-full rounded-full transition-colors duration-300",
                                        subtaskProgress === 100 ? "bg-green-500" : "bg-indigo-500"
                                    )}
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 min-w-[3ch] text-right">{subtaskProgress}%</span>
                        </div>

                        <div className="space-y-1">
                            {routine.subtasks.map(subtask => (
                                <div
                                    key={subtask.id}
                                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group/subtask"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSubtask(routine.id, subtask.id);
                                    }}
                                >
                                    <div className={clsx(
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                                        subtask.completed
                                            ? "bg-indigo-500 border-indigo-500 scale-100"
                                            : "border-gray-300 dark:border-gray-600 group-hover/subtask:border-indigo-400 dark:group-hover/subtask:border-indigo-400 scale-90 group-hover/subtask:scale-100"
                                    )}>
                                        {subtask.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className={clsx(
                                        "text-sm transition-colors duration-200",
                                        subtask.completed ? "text-gray-400 dark:text-gray-500 line-through decoration-2 decoration-gray-200 dark:decoration-gray-700" : "text-gray-700 dark:text-gray-200 font-medium"
                                    )}>
                                        {subtask.title}
                                    </span>
                                </div>
                            ))}
                        </div>
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
