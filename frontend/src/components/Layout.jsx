import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Settings, Plus, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoutine } from '../context/RoutineContext';

const Layout = ({ children, onAddRoutine }) => {
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useRoutine();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/analytics', icon: BarChart2, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside className="hidden sm:flex w-20 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col items-center lg:items-start py-8 transition-all duration-300">
                <div className="mb-12 px-4 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hidden lg:block">Routine</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
                    </button>
                </div>

                <div className="lg:hidden w-full flex justify-center mb-8">
                    <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg"></div>
                </div>

                <nav className="flex-1 w-full px-2 lg:px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`ml-3 font-medium hidden lg:block ${isActive ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full lg:hidden"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-2 lg:px-4 w-full mt-auto">
                    <button
                        onClick={onAddRoutine}
                        className="w-full flex items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-colors"
                    >
                        <Plus size={24} />
                        <span className="ml-2 font-semibold hidden lg:block">New Routine</span>
                    </button>
                </div>
            </aside>

            {/* Bottom Navigation for Mobile */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-2 py-3 z-50 pb-[env(safe-area-inset-bottom,20px)] transition-colors duration-300">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${isActive
                                ? 'text-indigo-600'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium mt-1">{item.label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={onAddRoutine}
                    className="flex flex-col items-center justify-center w-16 py-1 text-indigo-600"
                >
                    <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                        <Plus size={24} />
                    </div>
                    <span className="text-[10px] font-medium mt-1">New</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative mb-20 sm:mb-0">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
