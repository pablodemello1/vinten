import { useState } from 'react';
import MainLayout from './components/MainLayout';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export default function App() {
  const [userGoal, setUserGoal] = useState('');

  return (
    <>
      <MainLayout userGoal={userGoal} setUserGoal={setUserGoal} />
      <PWAInstallPrompt />
    </>
  );
}

