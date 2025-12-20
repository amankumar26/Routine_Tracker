import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import AddRoutineModal from './components/AddRoutineModal';
import { RoutineProvider, useRoutine } from './context/RoutineContext';

// Wrapper to handle modal state which needs access to context
const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addRoutine, addReminder } = useRoutine();

  const handleAddReminder = (reminder) => {
    addReminder(reminder);
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Layout onAddRoutine={() => setIsModalOpen(true)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <AddRoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addRoutine}
        onAddReminder={handleAddReminder}
      />
    </Router>
  );
};

function App() {
  return (
    <RoutineProvider>
      <AppContent />
    </RoutineProvider>
  );
}

export default App;
