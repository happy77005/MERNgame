import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function Home() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
    navigate('/game'); // Go to game directly after saving
  };

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home-bg d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg p-4 border-0 rounded-4" data-aos="zoom-in">
              <div className="card-body text-center">
                <h6 className="display-4 mb-4 gradient-text" data-aos="fade-down">Welcome to Riddle Quest!</h6>
                <p className="lead mb-4" data-aos="fade-up">Enter your details to begin your adventure. Solve riddles, earn points, and challenge your mind!</p>
                <form onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
                  <div className="mb-3">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userDetails.name}
                      onChange={handleChange}
                      className="form-control form-control-lg stylish-input"
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={userDetails.age}
                      onChange={handleChange}
                      className="form-control form-control-lg stylish-input"
                      placeholder="Enter age"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 stylish-btn" data-aos="zoom-in" data-aos-delay="400">
                    Start Game
                  </button>
                </form>
                <div className="mt-5" data-aos="fade-up" data-aos-delay="600">
                  <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/brain-2029365_1280.png" alt="Riddle Quest" className="img-fluid riddle-img" style={{maxHeight: '180px'}} />
                  <p className="mt-3 text-muted">Are you ready to test your wits?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 