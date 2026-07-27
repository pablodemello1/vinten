import { useState } from 'react';
import MainLayout from './components/MainLayout';

export default function App() {
  const [userGoal, setUserGoal] = useState('');

  return <MainLayout userGoal={userGoal} setUserGoal={setUserGoal} />;
}
