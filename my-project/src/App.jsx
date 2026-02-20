import { useEffect, useState } from 'react';
import './App.css'
import LandingPage from './Pages/LandingPage'
import Loader from './Component/Loader/Loader'
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {  
    // Loader 2 second baad hide hoga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
  
    return () => {
      clearTimeout(timer);
    };

  }, []);
  return (
    <>
      {loading ? <Loader /> : <LandingPage />}
    </>
  )
}

export default App
