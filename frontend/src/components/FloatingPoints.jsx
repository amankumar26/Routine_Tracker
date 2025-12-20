import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutine } from '../context/RoutineContext';

const FloatingPoints = () => {
    const { pointPopups } = useRoutine();

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
            <AnimatePresence>
                {pointPopups.map((popup) => (
                    <motion.div
                        key={popup.id}
                        initial={{ opacity: 0, scale: 0.5, y: 0 }}
                        animate={{ opacity: 1, scale: 1.5, y: -100 }}
                        exit={{ opacity: 0, y: -200 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute text-4xl font-bold text-yellow-500 drop-shadow-lg flex items-center gap-2"
                    >
                        <span>+{popup.amount}</span>
                        <span>🌟</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default FloatingPoints;
