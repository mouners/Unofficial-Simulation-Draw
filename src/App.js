// React hooks (useState, useEffect) for managing component state and lifecycle methods.
// useNavigate from react-router-dom to navigate programmatically between routes.
// Imports a CSS file (App.css) for styling.
import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [isShrunk, setIsShrunk] = useState(false); // isShrunk: A boolean state to manage the shrinking effect of the top bar on scroll.

  // Adds a scroll event listener to the window to track the scroll position.
  useEffect(() => {
    const handleScroll = () => {
      // Checks the scroll position (window.scrollY):
      if (window.scrollY > 100) {

        // If greater than 100 pixels, it sets isShrunk to true, triggering a CSS class to shrink the top bar.
        setIsShrunk(true);
      } else {

        // If less than or equal to 100 pixels, it sets isShrunk to false.
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleans up the event listener when the component is unmounted.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Header: Displays a disclaimer about the simulation. */} 
      <p className='header'>
        This project is an unofficial simulation of the UEFA Champions League draw. It is not affiliated with or endorsed by UEFA.
      </p>
      {/* Top Bar: A navigation bar with links to "Home," "Draw," and "About" pages.*/}
      <div className={`topBar ${isShrunk ? 'shrink' : ''}`}>
        <nav>
          <a href='/'>Home</a>
          <a href='/draw'>Draw</a>
          <a href='/about'>About</a>
        </nav>
      </div>
      {/* Container: Displays the title and a button to navigate to the "Draw" page.*/}
      <div className='container'>
        <p className='title'>Unofficial Simulation Champions League Draw</p>
        <button className='startBtn' onClick={() => navigate('/draw')}>Start Draw</button> {/*  Navigates to the "Draw" page. */}
        <p className="info" onClick={() => navigate('/about')}>For more info, click here</p> {/* Navigates to the "About" page. */}
      </div>
    </div>
  );
}

export default App;
