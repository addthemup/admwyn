import './App.css';
import HeroHeader from './components/HeroHeader';
import Grow from './components/Grow';
import Basketball from './components/Basketball';
import LittleThings from './components/LittleThings';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative App">
      <HeroHeader />
      <Grow />
      <Basketball />
      <LittleThings />
    </div>
  );
}

export default App;
