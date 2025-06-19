import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import questions from './data/questions.json';
import answers from './data/answers.json';
import gameHints from './data/hints.json';
import './App.css';

function Game() {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [stopwatch, setStopwatch] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [notification, setNotification] = useState(null);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [currentHint, setCurrentHint] = useState('');
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    // Check if user details exist
    const storedUserDetails = sessionStorage.getItem('userDetails');
    if (!storedUserDetails) {
      window.location.href = '/';
    } else {
      setUserDetails(JSON.parse(storedUserDetails));
    }

    // Start stopwatch with time acceleration
    const timer = setInterval(() => {
      if (isStopwatchRunning) {
        setStopwatch(prev => {
          const newTime = prev + timeMultiplier;
          // Reset time multiplier when reaching 60 seconds
          if (newTime >= 60) {
            setTimeMultiplier(1);
            setShowGlitch(false);
          }
          // Trigger glitch effect at 10 seconds
          else if (prev < 10 && newTime >= 10) {
            setTimeMultiplier(5);
            setShowGlitch(true);
            // Remove glitch effect after 1 second
            setTimeout(() => setShowGlitch(false), 1000);
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStopwatchRunning, timeMultiplier]);

  // Format stopwatch time
  const formatStopwatch = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentAnswer = answers[level.toString()];
    if (answer.toLowerCase() === currentAnswer.toLowerCase()) {
      if (level < Object.keys(questions).length) {
        // Calculate score based on time taken with max deduction of 60
        const timeDeduction = Math.min(60, Math.floor(stopwatch / 10) * 10); // Max deduction is 60 points
        const levelScore = Math.max(40, 100 - timeDeduction); // Minimum score is 40
        setScore(prev => prev + levelScore);
        
        setMessage(`Congratulations! Welcome to level ${level + 1}. You earned ${levelScore} points!`);
        setLevel(prev => prev + 1);
        setStopwatch(0); // Reset stopwatch for new level
        setTimeMultiplier(1); // Reset time multiplier
      } else {
        setMessage('Congratulations! You have completed all levels!');
        setIsStopwatchRunning(false);
      }
    } else {
      setMessage(answer + ' is incorrect. Try again!');
    }
    setAnswer('');
  };

  const handleHint = () => {
    if (stopwatch < 60) {
      setNotification('Hints are available after 1 minute!');
      return;
    }
    
    if (hints > 0) {
      setHints(prev => prev - 1);
      setShowHint(true);
      const hint = gameHints[level.toString()];
      setCurrentHint(hint);
      setNotification(`Hint: ${hint}`);
    } else {
      setNotification('No hints remaining!');
    }
  };

  return (
    <div className="App">
      <div className={`glitch-overlay ${showGlitch ? 'active' : ''}`}></div>
      <header className="App-header">
        <h1>Riddle Game</h1>
        <div className="game-container">
          <div className="game-info">
            <h2>Level {level}</h2>
            {userDetails && <p className="user-welcome">Welcome, {userDetails.name}!</p>}
            <p>Hints remaining: {hints}</p>
            <p className="score">Score: {score}</p>
            <p className="stopwatch">Time: {formatStopwatch(stopwatch)}</p>
            {stopwatch < 60 && (
              <p className="hint-timer">Hints available in: {60 - stopwatch} seconds</p>
            )}
            {timeMultiplier > 1 && (
              <p className="time-acceleration">time loosing</p>
            )}
          </div>
          
          <p className="riddle">
            {questions[level.toString()]}
          </p>
          
          {showHint && currentHint && (
            <p className="hint-display">
              Hint: {currentHint}
            </p>
          )}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="answer-input"
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>

          <div className="game-controls">
            <button 
              onClick={handleHint} 
              className="hint-button" 
              disabled={hints === 0 || stopwatch < 60}
            >
              Show Hint ({hints})
            </button>
          </div>
          
          {message && <p className="message">{message}</p>}
          
          {notification && (
            <div className="notification">
              {notification}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
