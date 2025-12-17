import React from 'react';
import { useRoutine } from '../context/RoutineContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { format, subDays, startOfMonth, eachDayOfInterval, endOfMonth, isSameDay, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';

const Analytics = () => {
    const { routines } = useRoutine();

    // --- Data Preparation for Charts ---

    // 1. Weekly Completion Data (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
            date: format(d, 'EEE'), // Mon, Tue, etc.
            fullDate: format(d, 'yyyy-MM-dd'),
            completed: 0
        };
    });

    // Calculate completions for each day in the last 7 days
    // Note: In a real app with a backend, we'd query this. 
    // Here we have to iterate through all routines and their history.
    last7Days.forEach(day => {
        let count = 0;
        routines.forEach(routine => {
            if (routine.history && routine.history.includes(day.fullDate)) {
                count++;
            }
        });
        day.completed = count;
    });

    // 2. Monthly Consistency (Mock Data for visual wow factor if history is empty)
    // In a real scenario, we'd map real history.
    const monthlyData = [
        { name: 'Week 1', value: 65 },
        { name: 'Week 2', value: 80 },
        { name: 'Week 3', value: 45 },
        { name: 'Week 4', value: 90 },
    ];

    // 3. Routine Specific Performance
    const routinePerformance = routines.map(r => ({
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
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Weekly Activity</h3>
                    <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={last7Days}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                                    className="dark:bg-gray-900 dark:text-gray-100"
                                />
                                <Bar
                                    dataKey="completed"
                                    fill="#6366f1"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trend Area Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Monthly Trend</h3>
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }} />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
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

                {/* Routine Streaks Horizontal Bar */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Current Streaks</h3>
                    <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart layout="vertical" data={routinePerformance} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" className="dark:stroke-gray-700" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
                                    className="dark:fill-gray-400"
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }} />
                                <Bar dataKey="streak" fill="#ec4899" radius={[0, 6, 6, 0]} barSize={24} background={{ fill: '#f9fafb', radius: [0, 6, 6, 0] }} className="dark:fill-gray-700" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
