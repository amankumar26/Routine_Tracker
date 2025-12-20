/**
 * Logic for determining punishments based on routine type and severity.
 */

// Cache for API Dares
let apiDareCache = [];

export const fetchDares = async (count = 3) => {
    try {
        // Fetch multiple times in parallel since API returns one at a time
        const promises = Array(count).fill().map(() =>
            fetch('/api/truthordare/dare').then(res => res.json())
        );

        const results = await Promise.all(promises);
        const newDares = results.map(data => data.question).filter(Boolean); // Extract question text

        apiDareCache.push(...newDares);
        // Keep cache manageable
        if (apiDareCache.length > 20) {
            apiDareCache = apiDareCache.slice(-20);
        }
    } catch (error) {
        console.warn('Failed to fetch punishments from API:', error);
    }
};

export const getPunishmentForRoutine = (routineTitle, severity = 1) => {
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
        // Default: Mixed Bag (API or Local)

        // 60% chance to use API dare if available
        if (apiDareCache.length > 0 && Math.random() > 0.4) {
            selectedTask = apiDareCache.shift();
            // Refill in background if low
            if (apiDareCache.length < 2) fetchDares(3);
        } else {
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
                "Make your bed perfectly",
                "Call a friend and sing Happy Birthday (randomly)",
                "Post a silly selfie on your story",
                "Text a random emoji to a friend without context",
                "Do a chicken dance for 1 minute",
                "Speak in a fake accent for the next 30 mins",
                "Wear socks on your hands for 15 minutes"
            ];
            selectedTask = select(mixedTasks);
        }
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
