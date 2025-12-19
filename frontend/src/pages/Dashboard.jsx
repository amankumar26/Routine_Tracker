import React from 'react';
import { useRoutine } from '../context/RoutineContext';
import RoutineCard from '../components/RoutineCard';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfWeek, subWeeks, eachDayOfInterval, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay } from 'date-fns';

import AddRoutineModal from '../components/AddRoutineModal';

const Dashboard = () => {
    // Dashboard component
    const { routines, toggleRoutine, deleteRoutine, user, editRoutine, addRoutine, toggleSubtask, globalStats, dailyQuote, punishments, completePunishment } = useRoutine();
    const today = format(new Date(), 'EEEE, MMMM do');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [routineToEdit, setRoutineToEdit] = React.useState(null);
    const [punishmentCardExpanded, setPunishmentCardExpanded] = React.useState(true);

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

    // Punishment Capture Logic
    const fileInputRef = React.useRef(null);
    const [uploadingId, setUploadingId] = React.useState(null);

    const handleImageCapture = (e) => {
        const file = e.target.files[0];
        if (file && uploadingId) {
            // Compress/Resize image to avoid localStorage limits
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Resize to max 300px width/height
                    const MAX_SIZE = 300;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress quality
                    completePunishment(uploadingId, dataUrl);
                    setUploadingId(null);
                    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

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
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-500 dark:text-gray-400">{today}</p>
                    {globalStats?.happyPoints > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
                            <span>🌟</span>
                            <span>{globalStats.happyPoints} Happy Points</span>
                        </div>
                    )}
                </div>
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

            {/* Floating Punishment Card */}
            <AnimatePresence>
                {punishments.length > 0 && (
                    <>
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 right-6 z-50 w-full max-w-sm px-4 md:px-0 pointer-events-none"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/50 overflow-hidden pointer-events-auto ring-4 ring-red-50 dark:ring-red-900/20">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 p-4 flex items-center justify-between cursor-pointer"
                                    onClick={() => setPunishmentCardExpanded(!punishmentCardExpanded)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl animate-wiggle">😈</span>
                                        <h3 className="font-bold text-red-700 dark:text-red-400">Punishment Zone</h3>
                                        <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {punishments.length}
                                        </span>
                                    </div>
                                    <button className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 transition-colors">
                                        {punishmentCardExpanded ? '▼' : '▲'}
                                    </button>
                                </div>

                                {/* Hidden File Input for Capture */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageCapture}
                                />

                                {/* Content */}
                                <AnimatePresence>
                                    {punishmentCardExpanded && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
                                                    Missed habits? Pay the price to earn back 🌟 Happy Points!
                                                </p>
                                                <div className="space-y-3">
                                                    {punishments.map(punishment => (
                                                        <motion.div
                                                            key={punishment.id}
                                                            layout
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            className="bg-white dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm group"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">
                                                                        {punishment.task}
                                                                    </p>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        <span className="opacity-75">Missed: </span>
                                                                        <span className="font-semibold text-red-500 dark:text-red-400">
                                                                            {punishment.sourceRoutine}
                                                                        </span>
                                                                        <span className="opacity-50 ml-1">
                                                                            ({punishment.date})
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setUploadingId(punishment.id);
                                                                        if (fileInputRef.current) fileInputRef.current.click();
                                                                    }}
                                                                    className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs font-bold rounded-lg shadow-md shadow-red-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-1"
                                                                >
                                                                    <span>📸</span> Done
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
