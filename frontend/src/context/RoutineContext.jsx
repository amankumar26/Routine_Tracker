import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, subDays, parseISO, isBefore } from 'date-fns';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    // Initial mock data
    const [routines, setRoutines] = useState(() => {
        const saved = localStorage.getItem('routines');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                title: 'Morning Jog',
                time: '07:00 AM',
                icon: '🏃',
                streak: 5,
                completedToday: false,
                startDate: '2023-10-01',
                history: ['2023-10-20', '2023-10-21', '2023-10-22', '2023-10-23', '2023-10-24'],
                subtasks: [
                    { id: 1, title: 'Wear running shoes', completed: false },
                    { id: 2, title: 'Warm up', completed: false }
                ]
            },
            { id: 2, title: 'Read Book', time: '09:00 PM', icon: '📖', streak: 12, completedToday: false, startDate: '2023-10-01', history: [], subtasks: [] },
            { id: 3, title: 'Drink Water', time: 'All Day', icon: '💧', streak: 2, completedToday: false, startDate: '2023-10-01', history: [], subtasks: [] },
            { id: 4, title: 'Code', time: '10:00 AM', icon: '💻', streak: 30, completedToday: false, startDate: '2023-10-01', history: [], subtasks: [] },
        ];
    });

    // Punishment State
    const [punishments, setPunishments] = useState(() => {
        const saved = localStorage.getItem('punishments');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('punishments', JSON.stringify(punishments));
    }, [punishments]);

    const punishmentTasks = [
        "Do 20 Pushups",
        "No Social Media for 2 Hours",
        "Read 10 Pages of a Boring Book",
        "Walk for 15 Minutes without Music",
        "Clean your Room",
        "Meditate for 10 Minutes",
        "Write 'I will not miss my habits' 50 times",
        "Drink 1 Liter of Water immediately",
        "Do a 1-minute Plank",
        "Don't eat sugar today",
        "Cold Shower",
        "Donate $1 to a jar",
        "Call a relative you haven't spoken to in a while",
        "No Netflix/YouTube today"
    ];

    const completePunishment = (id) => {
        setPunishments(prev => prev.filter(p => p.id !== id));

        // Award Happy Points
        setGlobalStats(prev => ({
            ...prev,
            happyPoints: (prev.happyPoints || 0) + 10
        }));

        if (notificationsEnabled) {
            new Notification('Redemption! 🌟', {
                body: `You earned 10 Happy Points for completing a punishment!`,
                icon: '/vite.svg'
            });
        }
    };

    const getPunishmentForRoutine = (routineTitle, severity = 1) => {
        const title = routineTitle.toLowerCase();
        let selectedTask = "";

        // Helper to select task
        const select = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Fitness/Physical Related
        if (title.includes('run') || title.includes('jog') || title.includes('gym') || title.includes('workout') || title.includes('exercise') || title.includes('walk') || title.includes('sport')) {
            const tasks = [
                "Do 20 Jumping Jacks",
                "Do 10 Burpees",
                "Hold a Plank for 1 minute",
                "Run/Walk 1 mile extra today",
                "Do 15 Pushups",
                "Wall sit for 1 minute",
                "Climb 3 flights of stairs",
                "Do 20 Squats"
            ];
            selectedTask = select(tasks);
        }

        // Intellectual/Productivity
        else if (title.includes('read') || title.includes('study') || title.includes('code') || title.includes('write') || title.includes('learn') || title.includes('work')) {
            const tasks = [
                "Read a dictionary page",
                "Write 'I will not procrastinate' 20 times",
                "No Social Media for 1 Hour",
                "Watch a 15 min educational video (no entertainment)",
                "Organize your workspace for 10 mins",
                "Write a 50-word essay on why you missed this task"
            ];
            selectedTask = select(tasks);
        }

        // Health/Wellness
        else if (title.includes('water') || title.includes('sleep') || title.includes('eat') || title.includes('diet') || title.includes('floss')) {
            const tasks = [
                "Drink 0.5L of water in one go",
                "No sugar for 12 hours",
                "Eat a raw vegetable (carrot/cucumber) without dip",
                "Cold Shower",
                "Don't eat out/order food today",
                "Go to bed 15 mins earlier tonight"
            ];
            selectedTask = select(tasks);
        }

        // Spiritual/Mindfulness
        else if (title.includes('meditate') || title.includes('pray') || title.includes('journal') || title.includes('gratitude') || title.includes('reflection')) {
            const tasks = [
                "Meditate for 10 Minutes (Silence)",
                "Write down 5 things you are grateful for",
                "Read a spiritual or philosophical text for 10 mins",
                "Sit in silence without devices for 15 mins",
                "Perform a random act of kindness",
                "Call someone and tell them you appreciate them"
            ];
            selectedTask = select(tasks);
        }
        else {
            // Default: Mixed Bag
            const mixedTasks = [
                "Send a genuine compliment message to 3 friends",
                "Pick up litter in your neighborhood for 5 mins",
                "Donate $1 to a local charity or jar",
                "Write a thank you note to someone who helped you",
                "Reflect on a recent mistake and how to fix it",
                "Listen to a 10-min guided meditation",
                "Spend 10 mins in nature without your phone",
                "Deep breathing exercises for 5 mins",
                "Clean your bathroom",
                "No music/podcasts for 2 hours",
                "Unsubscribe from 3 newsletter emails",
                "Delete 1 unused app from your phone",
                "Do the dishes immediately after eating",
                "Make your bed perfectly"
            ];
            selectedTask = select(mixedTasks);
        }

        // --- APPLY SEVERITY SCALING ---
        // If severity > 1, multiply numbers in the string
        if (severity > 1) {
            // RegEx to look for numbers and multiply them
            selectedTask = selectedTask.replace(/(\d+(\.\d+)?)/g, (match) => {
                const num = parseFloat(match);
                // Scale factor: 1.5x for Level 2, 2x for Level 3, etc.
                const scaled = Math.ceil(num * (1 + (severity - 1) * 0.5));
                return scaled;
            });

            // Append a warning based on severity
            if (severity === 2) selectedTask += " (Double intensity! ⚠️)";
            if (severity >= 3) selectedTask += " (MAX PUNISHMENT! 💀)";
        }

        return selectedTask;
    };

    // Check if it's a new day to reset 'completedToday'
    useEffect(() => {
        const lastOpenDate = localStorage.getItem('lastOpenDate');
        const today = format(new Date(), 'yyyy-MM-dd');

        if (lastOpenDate && lastOpenDate !== today) {
            // Generate punishments for missed routines from the LAST SESSION
            const missedRoutines = routines.filter(r => !r.deleted && !r.completedToday);

            if (missedRoutines.length > 0) {
                const newPunishments = missedRoutines.map(r => {
                    // CALCULATE SEVERITY (Consecutive Miss Days)
                    let severity = 1;
                    const referenceDate = new Date(lastOpenDate);

                    // Check up to 5 days back from the missed date
                    for (let i = 1; i <= 5; i++) {
                        const checkDate = subDays(referenceDate, i);
                        const checkDateStr = format(checkDate, 'yyyy-MM-dd');

                        // If date is before routine start, stop checking
                        if (isBefore(checkDate, parseISO(r.startDate))) break;

                        // If NOT in history, it was missed
                        if (!r.history.includes(checkDateStr)) {
                            severity++;
                        } else {
                            // Found a completed day, streak of misses ends
                            break;
                        }
                    }

                    return {
                        id: Date.now() + Math.random(),
                        task: getPunishmentForRoutine(r.title, severity),
                        sourceRoutine: r.title,
                        date: lastOpenDate,
                        severity: severity // Store for potential UI display
                    };
                });

                setPunishments(prev => [...prev, ...newPunishments]);

                // Notify user
                if (notificationsEnabled) {
                    new Notification('Punishment Time! 😈', {
                        body: `You missed ${missedRoutines.length} habits. Check the dashboard for your penalties!`,
                        icon: '/vite.svg'
                    });
                }
            }
        }

        if (lastOpenDate !== today) {
            setRoutines(prev => prev.map(r => ({
                ...r,
                completedToday: false,
                subtasks: r.subtasks ? r.subtasks.map(st => ({ ...st, completed: false })) : []
            })));
            localStorage.setItem('lastOpenDate', today);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('routines', JSON.stringify(routines));
    }, [routines]);

    const toggleRoutine = (id) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        setRoutines(prev => prev.map(routine => {
            if (routine.id === id) {
                const isCompleted = !routine.completedToday;
                let newHistory = [...(routine.history || [])];
                let newStreak = routine.streak;

                if (isCompleted) {
                    if (!newHistory.includes(today)) newHistory.push(today);
                    // Simple streak increment for demo. Real logic checks consecutive days.
                    newStreak += 1;
                } else {
                    newHistory = newHistory.filter(d => d !== today);
                    newStreak = Math.max(0, newStreak - 1);
                }

                return { ...routine, completedToday: isCompleted, history: newHistory, streak: newStreak };
            }
            return routine;
        }));
    };

    const toggleSubtask = (routineId, subtaskId) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        setRoutines(prev => prev.map(routine => {
            if (routine.id === routineId) {
                const updatedSubtasks = routine.subtasks.map(st =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                );

                const allSubtasksCompleted = updatedSubtasks.every(st => st.completed);
                let updatedRoutine = { ...routine, subtasks: updatedSubtasks };

                // Auto-complete routine if all subtasks are done
                if (allSubtasksCompleted && !routine.completedToday) {
                    let newHistory = [...(routine.history || [])];
                    if (!newHistory.includes(today)) newHistory.push(today);
                    let newStreak = routine.streak + 1;

                    updatedRoutine = {
                        ...updatedRoutine,
                        completedToday: true,
                        history: newHistory,
                        streak: newStreak
                    };
                }
                // Auto-uncheck routine if a subtask is unchecked (optional but consistent)
                else if (!allSubtasksCompleted && routine.completedToday) {
                    let newHistory = (routine.history || []).filter(d => d !== today);
                    let newStreak = Math.max(0, routine.streak - 1);

                    updatedRoutine = {
                        ...updatedRoutine,
                        completedToday: false,
                        history: newHistory,
                        streak: newStreak
                    };
                }

                return updatedRoutine;
            }
            return routine;
        }));
    };

    const addRoutine = (newRoutine) => {
        setRoutines(prev => [...prev, {
            ...newRoutine,
            id: Date.now(),
            streak: 0,
            completedToday: false,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            deleted: false,
            history: [],
            icon: newRoutine.icon || '✨',
            subtasks: newRoutine.subtasks || []
        }]);
    };

    const deleteRoutine = (id) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        setRoutines(prev => prev.map(r =>
            r.id === id
                ? { ...r, deleted: true, deletedAt: today }
                : r
        ));
    };

    const editRoutine = (updatedRoutine) => {
        setRoutines(prev => prev.map(r => r.id === updatedRoutine.id ? { ...r, ...updatedRoutine } : r));
    };

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { name: 'Aman', email: 'aman@example.com' };
    });

    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        return localStorage.getItem('notificationsEnabled') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled);
    }, [notificationsEnabled]);

    const updateUserName = (name) => {
        setUser(prev => ({ ...prev, name }));
    };

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications');
            return false;
        }

        // Always request permission explicitly to trigger the prompt
        // if it hasn't been denied
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                // Send a test notification immediately to confirm
                new Notification('Habbita Notifications Enabled! 🎉');
                return true;
            }
        }

        if (Notification.permission === 'denied') {
            alert('Notifications are blocked. Please enable them in your browser settings.');
        }

        return false;
    };

    const toggleNotifications = () => {
        if (notificationsEnabled) {
            setNotificationsEnabled(false);
        } else {
            requestNotificationPermission();
        }
    };

    // Web Audio API for Alarm Sound
    const playAlarmSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // Create a sequence of beeps
            const now = ctx.currentTime;

            const createBeep = (startTime, freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

                osc.start(startTime);
                osc.stop(startTime + 0.5);
            };

            // Play 3 beeps
            createBeep(now, 880);
            createBeep(now + 0.6, 880);
            createBeep(now + 1.2, 880);

        } catch (e) {
            console.error("Failed to play alarm sound", e);
        }
    };

    // Notification Timer Loop
    // Track notified routines for the day to prevent duplicates
    const notifiedRoutinesRef = React.useRef(new Set());

    // --- Global Stats (Streaks & Badges) ---
    const [globalStats, setGlobalStats] = useState(() => {
        const saved = localStorage.getItem('globalStats');
        return saved ? JSON.parse(saved) : {
            currentStreak: 0,
            bestStreak: 0,
            lastAllCompletedDate: null,
            badges: [],
            happyPoints: 0
        };
    });

    // Motivational Quotes
    const quotes = [
        "Believe you can and you're halfway there.",
        "Your future is created by what you do today, not tomorrow.",
        "Don't watch the clock; do what it does. Keep going.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "The secret of your future is hidden in your daily routine.",
        "You will never change your life until you change something you do daily.",
        "Consistency is key.",
        "Small steps every day.",
        "The only bad workout is the one that didn't happen.",
        "Action is the foundational key to all success.",
        "Don't stop when you're tired. Stop when you're done.",
        "Your only limit is your mind.",
        "Discipline is doing what needs to be done, even if you don't want to.",
        "Great things never come from comfort zones.",
        "Dream big. Start small. Act now.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Don't wait for opportunity. Create it.",
        "Success doesn't just find you. You have to go out and get it.",
        "Wake up with determination. Go to bed with satisfaction.",
        "Do something today that your future self will thank you for.",
        "It always seems impossible until it's done.",
        "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
        "Focus on the step in front of you, not the whole staircase.",
        "Doubt kills more dreams than failure ever will.",
        "Hard work beats talent when talent doesn't work hard.",
        "Stay hungry, stay foolish.",
        "The journey of a thousand miles begins with one step.",
        "What you do makes a difference, and you have to decide what kind of difference you want to make.",
        "The difference between who you are and who you want to be is what you do.",
        "Every morning we are born again. What we do today is what matters most.",
        "Aaj ka kaam kal par mat todo.",
        "Koshish karne walon ki kabhi haar nahi hoti.",
        "Sapne wo nahi jo sote waqt aaye, sapne wo hai jo sone na de.",
        "Mehnat itni khamoshi se karo ki safalta shor macha de.",
        "Waqt sabka badalta hai, bas thoda waqt lagta hai.",
        "Jo hota hai, acche ke liye hota hai.",
        "Himmat mat haarna, abhi bahut aage jaana hai.",
        "Chote kadam bhi badi manzil tak le jaate hain.",
        "Kal kare so aaj kar, aaj kare so ab.",
        "Rukna nahi hai, bas chalte rehna hai.",
        "Agar fail ho gaye to kya hua? Failure ek beginning hai, end nahi.",
        "Jitni badi struggle hogi, jeet utni hi shandaar hogi.",
        "Khud par vishwas rakho, duniya tumhari hogi.",
        "Manzil unhi ko milti hai, jinke sapno mein jaan hoti hai.",
        "Zindagi mein kabhi bhi haar mat maano, kya pata agli koshish hi kamyaabi ho."
    ];

    const [dailyQuote, setDailyQuote] = useState(() => {
        // Try to get today's quote from storage
        const savedQuoteData = localStorage.getItem('dailyQuoteData');
        const today = format(new Date(), 'yyyy-MM-dd');

        if (savedQuoteData) {
            const { date, quote } = JSON.parse(savedQuoteData);
            if (date === today) {
                return quote;
            }
        }
        return ''; // Default empty, will be set in effect if not found
    });

    useEffect(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const savedQuoteData = localStorage.getItem('dailyQuoteData');

        // If we already have a quote for today, do nothing (state is already set correctly)
        if (savedQuoteData) {
            const { date } = JSON.parse(savedQuoteData);
            if (date === today) return;
        }

        // Otherwise generate a new one
        const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setDailyQuote(newQuote);
        localStorage.setItem('dailyQuoteData', JSON.stringify({
            date: today,
            quote: newQuote
        }));
    }, []);

    // Check Streak Logic
    useEffect(() => {
        if (routines.length === 0) return;

        const allCompleted = routines.every(r => r.completedToday);
        const today = format(new Date(), 'yyyy-MM-dd');

        if (allCompleted) {
            setGlobalStats(prev => {
                if (prev.lastAllCompletedDate === today) return prev; // Already updated today

                // Check if streak continues
                // const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd'); 
                // We need to handle date math carefully. 
                // If last completion was NOT yesterday and NOT today, reset to 1. 
                // But wait, if they missed yesterday, efficient logic is needed.
                // Assuming standard "streak" logic: must be consecutive days.

                const lastDate = prev.lastAllCompletedDate ? new Date(prev.lastAllCompletedDate) : null;
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterdayStr = format(yesterdayDate, 'yyyy-MM-dd');

                let newStreak = 1;
                if (prev.lastAllCompletedDate === yesterdayStr) {
                    newStreak = prev.currentStreak + 1;
                }

                // Check Badges
                const newBadges = [...prev.badges];
                const milestones = [
                    { days: 3, title: '3 Day Fire', icon: '🔥' },
                    { days: 7, title: 'Week Warrior', icon: '⚔️' },
                    { days: 30, title: 'Monthly Master', icon: '👑' },
                    { days: 50, title: 'Discipline God', icon: '🔱' }
                ];

                let badgeEarned = false;
                milestones.forEach(m => {
                    if (newStreak >= m.days && !newBadges.find(b => b.title === m.title)) {
                        newBadges.push({ ...m, unlockedAt: today });
                        badgeEarned = true;
                    }
                });

                if (badgeEarned) {
                    // Optional: could trigger a special celebration state here
                    new Notification('New Badge Unlocked! 🏆', {
                        body: `Congratulations! You've reached a ${newStreak} day streak!`,
                        icon: '/vite.svg'
                    });
                }

                return {
                    ...prev,
                    currentStreak: newStreak,
                    bestStreak: Math.max(prev.bestStreak, newStreak),
                    lastAllCompletedDate: today,
                    badges: newBadges
                };
            });
        }
    }, [routines]);

    useEffect(() => {
        localStorage.setItem('globalStats', JSON.stringify(globalStats));
    }, [globalStats]);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    // Notification Timer Loop
    useEffect(() => {
        if (!notificationsEnabled) return;

        const checkRoutines = () => {
            const now = new Date();
            const currentTime = format(now, 'hh:mm a'); // e.g., "07:00 AM"
            const todayDate = format(now, 'yyyy-MM-dd');

            routines.forEach(routine => {
                // Create a unique key for this notification instance
                const notificationKey = `${routine.id}-${todayDate}-${routine.time}`;

                // Check if time matches, not completed, and not already notified today
                if (routine.time === currentTime && !routine.completedToday && !notifiedRoutinesRef.current.has(notificationKey)) {

                    // Send notification
                    new Notification(`Time for ${routine.title}!`, {
                        body: `It's ${routine.time}. Don't forget to ${routine.icon} ${routine.title}.`,
                        icon: '/vite.svg'
                    });

                    // Play Alarm Sound
                    playAlarmSound();

                    // Mark as notified
                    notifiedRoutinesRef.current.add(notificationKey);
                }
            });
        };

        // Run immediately to catch if we just opened the app at the right time
        checkRoutines();

        const intervalId = setInterval(checkRoutines, 10000); // Check every 10 seconds for better precision

        return () => clearInterval(intervalId);
    }, [notificationsEnabled, routines]);

    return (
        <RoutineContext.Provider value={{
            routines,
            toggleRoutine,
            addRoutine,
            editRoutine,
            deleteRoutine,
            toggleSubtask,
            user,
            updateUserName,
            notificationsEnabled,
            toggleNotifications,
            globalStats,
            dailyQuote,
            darkMode,
            toggleDarkMode,
            punishments,
            completePunishment
        }}>
            {children}
        </RoutineContext.Provider>
    );
};
