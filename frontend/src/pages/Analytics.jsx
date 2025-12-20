import React from 'react';
import { useRoutine } from '../context/RoutineContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell } from 'recharts';
import { format, subDays, startOfMonth, eachDayOfInterval, endOfMonth, isSameDay, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Trophy } from 'lucide-react';

const Analytics = () => {
    const { routines } = useRoutine();
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [showInfo, setShowInfo] = React.useState(false);

    // --- Data Preparation for Charts ---

    // 1. Weekly Completion Data (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dayStr = format(d, 'yyyy-MM-dd');

        let completed = 0;
        let total = 0;

        routines.forEach(routine => {
            const routineStartDate = routine.startDate || '2000-01-01';

            // Strictly exclude deleted routines to allow "cleaning up" data
            if (!routine.deleted && dayStr >= routineStartDate) {
                total++;
                if (routine.history && routine.history.includes(dayStr)) {
                    completed++;
                }
            }
        });

        return {
            date: format(d, 'EEE'),
            fullDate: dayStr,
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    });

    const weeklyStats = (() => {
        const avg = Math.round(last7Days.reduce((acc, curr) => acc + curr.percentage, 0) / 7);
        const bestDay = [...last7Days].sort((a, b) => b.percentage - a.percentage)[0];
        return { avg, bestDay };
    })();

    // 2. Monthly Consistency (Real Data)
    const monthlyData = (() => {
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);

        // Get all weeks in the current month
        const weeks = [];
        let currentIterDate = start;

        // Loop to find week starts
        while (currentIterDate <= end) {
            const weekStart = startOfWeek(currentIterDate, { weekStartsOn: 1 }); // Monday start
            const weekEnd = endOfWeek(currentIterDate, { weekStartsOn: 1 });

            // Avoid duplicates if iteration steps small
            const weekLabel = `Week ${weeks.length + 1}`;
            if (!weeks.some(w => w.name === weekLabel)) {

                // Calculate completion for this week
                let completedCount = 0;
                let totalPossible = 0;

                // Iterate days in this week
                let dayIter = weekStart;
                while (dayIter <= weekEnd) {
                    // Only count days up to today to avoid skewing future data with 0s
                    // But for "Trends" sometimes seeing 0 is correct for future. 
                    // Let's count all days in month to behave like a standard calendar view
                    if (dayIter > end) break; // Don't go into next month visually if strictly monthly

                    const dayStr = format(dayIter, 'yyyy-MM-dd');

                    routines.forEach(routine => {
                        // Check if routine existed on this day
                        const routineStartDate = routine.startDate || '2000-01-01';

                        // Strictly exclude deleted routines
                        const isActiveOnDate = !routine.deleted && dayStr >= routineStartDate;

                        if (isActiveOnDate) {
                            // Count potential for this day
                            totalPossible++;
                            // Count actual
                            if (routine.history && routine.history.includes(dayStr)) {
                                completedCount++;
                            }
                        }
                    });

                    dayIter = new Date(dayIter.setDate(dayIter.getDate() + 1));
                }

                // If totalPossible is 0 (no routines), avoid NaN
                const percentage = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

                weeks.push({
                    name: weekLabel,
                    value: percentage
                });
            }

            // Jump to next week
            currentIterDate = new Date(weekEnd);
            currentIterDate.setDate(currentIterDate.getDate() + 1);
        }

        return weeks;
    })();

    // 3. Routine Specific Performance (Only active routines)
    const routinePerformance = routines.filter(r => !r.deleted).map(r => ({
        name: r.title,
        streak: r.streak,
        total: r.history ? r.history.length : 0
    }));

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics 📊</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Track your progress and consistency over time.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Weekly Activity Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                    <div className="p-6 md:p-8 relative z-10">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Weekly Activity</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Your average consistency is <span className="font-bold text-indigo-500">{weeklyStats.avg}%</span> this week.
                                </p>
                            </div>
                            {weeklyStats.avg > 0 && (
                                <div className="text-right pb-0.5">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Best Day</span>
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <p className="font-bold text-gray-800 dark:text-white leading-none">{weeklyStats.bestDay.date}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={last7Days} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700/50" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur text-white p-3 rounded-xl shadow-xl border border-gray-700/50 transform transition-all -translate-y-2">
                                                        <p className="font-bold text-sm mb-1">{label}</p>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                                            <p className="text-lg font-bold text-indigo-300">
                                                                {data.percentage}%
                                                            </p>
                                                        </div>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                                                            {data.completed} / {data.total} Habits
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="percentage"
                                        fill="url(#barGradient)"
                                        radius={[8, 8, 8, 8]}
                                        barSize={28}
                                        animationDuration={1500}
                                    >
                                        {
                                            last7Days.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fillOpacity={entry.percentage === 0 ? 0.2 : 1} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend Area Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                Monthly Trend
                                <div className="relative">
                                    <button
                                        onClick={() => setShowInfo(!showInfo)}
                                        className="text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none"
                                        aria-label="Show chart info"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                    </button>
                                    <AnimatePresence>
                                        {showInfo && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 p-3 bg-gray-900/95 dark:bg-gray-700/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl z-20 text-center"
                                            >
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 dark:bg-gray-700/95 rotate-45"></div>
                                                Shows your weekly habit completion rate percentage.
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </h3>
                            {/* Dynamic Insight */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {(() => {
                                    if (monthlyData.length === 0) return "No data available yet.";
                                    const bestWeek = [...monthlyData].sort((a, b) => b.value - a.value)[0];
                                    const currentWeek = monthlyData[monthlyData.length - 1];

                                    if (bestWeek.value === 0) return "Start tracking your habits to see trends!";

                                    if (currentWeek.name === bestWeek.name) {
                                        return `🔥 You're on fire! This week is your best yet (${bestWeek.value}%).`;
                                    } else {
                                        return `Aim to beat your best: ${bestWeek.name} (${bestWeek.value}%).`;
                                    }
                                })()}
                            </p>
                        </div>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                            {format(new Date(), 'MMMM')}
                        </span>
                    </div>

                    <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    domain={[0, 100]}
                                    unit="%"
                                    width={30}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                                    labelStyle={{ color: '#6b7280', marginBottom: '0.25rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calendar Style Streak (Current Month) */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 flex flex-col items-center justify-between hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 group">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl animate-pulse">📅</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {format(new Date(), 'MMMM yyyy')}
                            </span>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl">
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
                                        if (r.history && r.history.includes(dateStr)) count++;
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
                                                cursor-pointer hover:scale-110
                                            `}
                                            onClick={() => setSelectedDate(date)}
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

                {/* Routine Habits Performance List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Habit Performance</h3>
                    <div className="space-y-6">
                        {routines.filter(r => !r.deleted).map(routine => {
                            // Calculate Consistency (Last 30 Days)
                            const history = routine.history || [];
                            const today = new Date();
                            let completedCount = 0;
                            // Check last 30 days
                            for (let i = 0; i < 30; i++) {
                                const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
                                if (history.includes(dateStr)) {
                                    completedCount++;
                                }
                            }
                            const consistency = Math.round((completedCount / 30) * 100);

                            return (
                                <div key={routine.id} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-xl">
                                                {routine.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{routine.title}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Target: Daily</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-2 mb-1">
                                                <span className="text-orange-500 font-bold flex items-center gap-1">
                                                    {routine.streak} 🔥
                                                </span>
                                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                                <span className={`font-bold ${consistency >= 80 ? 'text-green-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                                    {consistency}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Consistency (30d)</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${consistency}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${consistency >= 80 ? 'bg-green-500' :
                                                consistency >= 50 ? 'bg-indigo-500' :
                                                    'bg-indigo-400 opacity-70'
                                                }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Day Details Modal */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDate(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {format(selectedDate, 'MMMM d, yyyy')}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {format(selectedDate, 'EEEE')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            {/* Stats */}
                            {(() => {
                                const dateStr = format(selectedDate, 'yyyy-MM-dd');

                                // Filter routines that existed on this date (Strictly exclude deleted)
                                const activeRoutinesForDay = routines.filter(r => {
                                    const startDate = r.startDate || '2000-01-01';
                                    return !r.deleted && dateStr >= startDate;
                                });

                                const activeTotal = activeRoutinesForDay.length;
                                const completedRoutines = activeRoutinesForDay.filter(r => r.history && r.history.includes(dateStr));
                                const completedCount = completedRoutines.length;
                                const percentage = activeTotal > 0 ? Math.round((completedCount / activeTotal) * 100) : 0;

                                if (activeTotal === 0) {
                                    return (
                                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                            <p>No habits were active on this date.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        {/* Progress Card */}
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
                                            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm">
                                                <span className={`text-xl font-bold ${percentage === 100 ? 'text-green-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                                    {percentage}%
                                                </span>
                                                {percentage === 100 && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-1 shadow-sm">
                                                        <Trophy size={12} fill="currentColor" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                                                    {percentage === 100 ? 'Perfect Day! 🎉' : percentage >= 50 ? 'Great Progress! 🚀' : 'Keep Going! 💪'}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    You completed <span className="font-semibold text-indigo-600 dark:text-indigo-400">{completedCount}</span> out of <span className="font-semibold text-gray-900 dark:text-white">{activeTotal}</span> habits.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Routine List */}
                                        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {activeRoutinesForDay.map(routine => {
                                                const isCompleted = routine.history && routine.history.includes(dateStr);
                                                return (
                                                    <div
                                                        key={routine.id}
                                                        className={`
                                                            flex items-center justify-between p-3 rounded-xl border transition-colors
                                                            ${isCompleted
                                                                ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30'
                                                                : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-xl">{routine.icon}</div>
                                                            <div>
                                                                <p className={`font-medium ${isCompleted ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                    {routine.title}
                                                                </p>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                    {routine.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="text-green-500 dark:text-green-400" size={24} />
                                                            ) : (
                                                                <Circle className="text-gray-300 dark:text-gray-600" size={24} />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Analytics;
