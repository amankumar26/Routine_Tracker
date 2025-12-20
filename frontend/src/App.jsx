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
  const { addRoutine } = useRoutine();

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
      />
    </Router>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-600 p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
            <p className="mb-4">The app encountered a critical error.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg">
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <RoutineProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </RoutineProvider>
  );
}

export default App;
