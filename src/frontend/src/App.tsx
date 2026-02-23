import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GamePage from './pages/GamePage';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <GamePage />
    </div>
  );
}

export default App;
