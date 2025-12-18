import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Edit2, Check, X } from 'lucide-react';
import { useRoutine } from '../context/RoutineContext';

const Settings = () => {
    const { user, updateUserName, notificationsEnabled, toggleNotifications, darkMode, toggleDarkMode } = useRoutine();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user.name);

    const handleSave = () => {
        updateUserName(newName);
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Settings ⚙️</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your preferences and account.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">

                {/* Profile Section */}
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-bold shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="text-lg font-bold text-gray-900 dark:text-gray-100 dark:bg-gray-800 border-b-2 border-indigo-500 focus:outline-none w-full"
                                autoFocus
                            />
                        ) : (
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <button onClick={handleSave} className="p-2 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40">
                                <Check size={20} />
                            </button>
                            <button onClick={() => { setIsEditing(false); setNewName(user.name); }} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40">
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="ml-auto px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors whitespace-nowrap">
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Settings Options */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your daily reminders</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="toggle"
                                checked={notificationsEnabled}
                                onChange={toggleNotifications}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                style={{ right: notificationsEnabled ? '0' : 'auto', left: notificationsEnabled ? 'auto' : '0', borderColor: notificationsEnabled ? '#4f46e5' : '#e5e7eb' }}
                            />
                            <label
                                htmlFor="toggle"
                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                        </div>
                    </div>

                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                                <Moon size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="toggleDark"
                                id="toggleDark"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                style={{ right: darkMode ? '0' : 'auto', left: darkMode ? 'auto' : '0', borderColor: darkMode ? '#8b5cf6' : '#e5e7eb' }}
                            />
                            <label
                                htmlFor="toggleDark"
                                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${darkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            ></label>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-700/30">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">Local Data Storage</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">All your data is stored locally on this device. No data is sent to potential servers.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors whitespace-nowrap"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
