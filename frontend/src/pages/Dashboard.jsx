import React from 'react';
import { useRoutine } from '../context/RoutineContext';
import RoutineCard from '../components/RoutineCard';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfWeek, subWeeks, eachDayOfInterval, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay } from 'date-fns';

import AddRoutineModal from '../components/AddRoutineModal';

const Dashboard = () => {
    // Dashboard component
    const { routines, toggleRoutine, deleteRoutine, user, editRoutine, addRoutine, toggleSubtask, globalStats, dailyQuote } = useRoutine();
    const today = format(new Date(), 'EEEE, MMMM do');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [routineToEdit, setRoutineToEdit] = React.useState(null);

    // Filter out deleted routines and sort: Incomplete first, then Completed
    const activeRoutines = routines
        .filter(r => !r.deleted)
        .sort((a, b) => Number(a.completedToday) - Number(b.completedToday));

    const completedCount = activeRoutines.filter(r => r.completedToday).length;
    const totalCount = activeRoutines.length;
    const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    const handleAddRoutine = (newRoutine) => {
        addRoutine(newRoutine);
        setIsModalOpen(false);
    };

    const handleEditRoutine = (updatedRoutine) => {
        editRoutine(updatedRoutine);
        setIsModalOpen(false);
        setRoutineToEdit(null);
    };

    const openAddModal = () => {
        setRoutineToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (routine) => {
        setRoutineToEdit(routine);
        setIsModalOpen(true);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const greeting = getGreeting();

    return (
        <div>
            <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{user.name}</span>!
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >
                        ☀️
                    </motion.span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{today}</p>
            </header>

            {/* Streak & Motivation Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                {/* Motivation & Badges - FIRST on Mobile via Order if needed, or by standard flow because Calendar is hidden */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <motion.span
                                animate={{
                                    rotate: [0, 15, -15, 15, -15, 0],
                                    filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
                                }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                                className="text-xl inline-block origin-top"
                            >
                                💡
                            </motion.span>
                            <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider">Daily Motivation</h3>
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-gray-800 dark:text-gray-100 italic leading-relaxed">"{dailyQuote}"</p>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Your Badges</h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 noscrollbar">
                            {globalStats?.badges && globalStats.badges.length > 0 ? (
                                globalStats.badges.map((badge, idx) => (
                                    <div key={idx} className="flex flex-col items-center min-w-[70px] animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="text-4xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800/50 rounded-2xl p-2 mb-2 shadow-sm drop-shadow-sm transform hover:scale-110 transition-transform cursor-pointer">
                                            {badge.icon}
                                        </div>
                                        <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold text-center leading-tight w-full truncate">{badge.title}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl w-full">
                                    <motion.span
                                        animate={{ y: [-2, 2, -2] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-2xl grayscale opacity-50 inline-block"
                                    >
                                        🏆
                                    </motion.span>
                                    <span className="text-sm italic">Complete your routines 3 days in a row to unlock your first badge!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Calendar Style Streak (Current Month) - HIDDEN on Mobile */}
                <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex-col items-center justify-between hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 group">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <motion.span
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="text-2xl inline-block"
                            >
                                📅
                            </motion.span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {format(new Date(), 'MMMM yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Current Streak:</span>
                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{globalStats?.currentStreak || 0} Days</span>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {(() => {
                                const today = new Date();
                                const monthStart = startOfMonth(today);
                                const monthEnd = endOfMonth(today);
                                const startDate = startOfWeek(monthStart);
                                const endDate = endOfWeek(monthEnd);
                                const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                                const getStatus = (date) => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    let count = 0;
                                    routines.forEach(r => {
                                        if (r.history.includes(dateStr)) count++;
                                    });
                                    return count > 0;
                                };

                                return calendarDays.map((date, i) => {
                                    const isActive = getStatus(date);
                                    const isCurrentMonth = isSameMonth(date, monthStart);
                                    const isTodayDate = isSameDay(date, today);

                                    return (
                                        <div
                                            key={i}
                                            className={`
                                                aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all duration-300 relative
                                                ${!isCurrentMonth ? 'opacity-30' : ''}
                                                ${isActive
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105'
                                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                                                }
                                                ${isTodayDate && !isActive ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-800' : ''}
                                            `}
                                        >
                                            {format(date, 'd')}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-40 -z-10"></div>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Daily Progress</h2>
                    <p className="opacity-90 mb-6">You have completed {completedCount} of {totalCount} routines today.</p>

                    <div className="w-full bg-white/20 rounded-full h-4 backdrop-blur-sm">
                        <motion.div
                            className="bg-white h-4 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Routines List */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Your Routines</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <AnimatePresence>
                        {activeRoutines.map(routine => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                onToggle={toggleRoutine}
                                onToggleSubtask={toggleSubtask}
                                onEdit={(r, action) => {
                                    if (action === 'delete') {
                                        if (window.confirm('Are you sure you want to delete this routine?')) {
                                            deleteRoutine(r.id);
                                        }
                                    } else {
                                        openEditModal(r);
                                    }
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <AddRoutineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddRoutine}
                onEdit={handleEditRoutine}
                routineToEdit={routineToEdit}
            />
        </div>
    );
};

export default Dashboard;
