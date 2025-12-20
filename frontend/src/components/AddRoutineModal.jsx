import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { format, parse } from 'date-fns';

const AddRoutineModal = ({ isOpen, onClose, onAdd, onEdit, onAddReminder, routineToEdit }) => {
    const [mode, setMode] = useState('routine'); // 'routine' | 'schedule'
    const [title, setTitle] = useState('');
    const [scheduleDate, setScheduleDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [hour, setHour] = useState(7);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState('AM');
    const [icon, setIcon] = useState('✨');
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState('');

    // Update state when routineToEdit changes or modal opens
    React.useEffect(() => {
        if (routineToEdit) {
            setMode('routine');
            setTitle(routineToEdit.title);
            try {
                // Parse "hh:mm a" format
                const parsedTime = parse(routineToEdit.time, 'hh:mm a', new Date());
                setHour(parseInt(format(parsedTime, 'h')));
                setMinute(parseInt(format(parsedTime, 'm')));
                setPeriod(format(parsedTime, 'a'));
            } catch (e) {
                // Default if parsing fails
                setHour(7);
                setMinute(0);
                setPeriod('AM');
            }
            setIcon(routineToEdit.icon);
            setSubtasks(routineToEdit.subtasks || []);
        } else {
            setTitle('');
            setHour(7);
            setMinute(0);
            setPeriod('AM');
            setIcon('✨');
            setSubtasks([]);
            // Don't reset mode here to allow persistence, or reset on open?
            // setMode('routine'); 
        }
    }, [routineToEdit, isOpen]);

    const handleAddSubtask = () => {
        if (!newSubtask.trim()) return;
        setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, completed: false }]);
        setNewSubtask('');
    };

    const removeSubtask = (id) => {
        setSubtasks(subtasks.filter(t => t.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;

        if (mode === 'schedule') {
            if (onAddReminder) {
                onAddReminder({
                    text: title,
                    date: scheduleDate
                });
            }
        } else {
            // Format time string "hh:mm a"
            const formattedTime = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;

            if (routineToEdit) {
                onEdit({ ...routineToEdit, title, time: formattedTime, icon, subtasks });
            } else {
                onAdd({ title, time: formattedTime, icon, subtasks });
            }
        }

        onClose();
    };

    const icons = ['✨', '🏃', '📖', '💧', '💻', '🧘', '🍳', '💤', '💊', '🧹'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-y-auto py-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-6 pointer-events-auto mx-4 my-auto transition-colors duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{routineToEdit ? 'Edit Routine' : 'Add New'}</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                                    <X size={24} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {!routineToEdit && (
                                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setMode('routine')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'routine'
                                                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            Routine
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('schedule')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'schedule'
                                                    ? 'bg-white dark:bg-gray-600 text-orange-500 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            Schedule
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {mode === 'routine' ? 'What do you want to do?' : 'Reminder Text'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Morning Meditation"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        autoFocus
                                    />
                                </div>


                                {mode === 'schedule' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                )}

                                {mode === 'routine' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Set Time</label>

                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6">
                                                <div className="text-center mb-6">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                                        {hour}:{minute.toString().padStart(2, '0')}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPeriod(p => p === 'AM' ? 'PM' : 'AM')}
                                                        className="ml-2 text-xl font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                                    >
                                                        {period}
                                                    </button>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                            <span>Hour</span>
                                                            <span>{hour}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="12"
                                                            value={hour}
                                                            onChange={(e) => setHour(parseInt(e.target.value))}
                                                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                            <span>Minute</span>
                                                            <span>{minute}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="59"
                                                            value={minute}
                                                            onChange={(e) => setMinute(parseInt(e.target.value))}
                                                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtasks (Optional)</label>
                                            <div className="flex space-x-2 mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Add a subtask..."
                                                    value={newSubtask}
                                                    onChange={(e) => setNewSubtask(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                                    className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddSubtask}
                                                    className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {subtasks.map(task => (
                                                    <div key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl">
                                                        <span className="text-gray-700 dark:text-gray-300">{task.title}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSubtask(task.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose an Icon</label>
                                            <div className="flex flex-wrap gap-2">
                                                {icons.map((i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setIcon(i)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${icon === i ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500 scale-110' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        {i}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className={`w-full py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center
                                        ${mode === 'routine'
                                            ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                                            : 'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                >
                                    <Plus size={20} className="mr-2" />
                                    {routineToEdit ? 'Save Changes' : (mode === 'routine' ? 'Add Routine' : 'Add Schedule')}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence >
    );
};

export default AddRoutineModal;
