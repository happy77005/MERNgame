import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Store user details in sessionStorage
    const storedDetails = sessionStorage.getItem('userDetails');
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
    alert('Details saved successfully!');
  };

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const startGame = () => {
    if (!userDetails.name || !userDetails.age) {
      alert('Please fill in your details first!');
      return;
    }
    navigate('/game');
  };

  return (
    <div className="home-container">
      <div className="clock-container">
        <h2>Current Time</h2>
        <p>{currentTime.toLocaleTimeString()}</p>
        <p>{currentTime.toLocaleDateString()}</p>
      </div>

      <div className="form-container">
        <h2>Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={userDetails.age}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Save Details</button>
        </form>
        <button onClick={startGame} className="start-game-button">
          Start Game
        </button>
      </div>
    </div>
  );
}

export default Home; 