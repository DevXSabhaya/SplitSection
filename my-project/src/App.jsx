import { useEffect, useState } from 'react';
import './App.css'
import LandingPage from './Pages/LandingPage'
import Loader from './Component/Loader/Loader'
function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOutLoader, setFadeOutLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start fade out animation 3.5 seconds in, then hide loader and show content
    const fadeTimer = setTimeout(() => {
      setFadeOutLoader(true);
      // After fade out animation completes, hide loader and show content
      setTimeout(() => {
        setLoading(false);
        setShowContent(true);
      }, 500);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
    };

  }, []);
  return (
    <div className="app-container">
      {loading && <Loader fadeOut={fadeOutLoader} />}
      {showContent && <div className="app-content"><LandingPage /></div>}
    </div>
  )
}

export default App
