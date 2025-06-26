import { Link } from "react-router-dom";
import './homepage.css';


const Homepage = () => {

  return (
    <div className='homepage'>
      <img src="./orbital.png" alt="" className="orbit" />
      <div className="left">
        <h1>CALVI AI</h1>
        <h2>Et quidem non optio facilis ratione suscipit</h2>
        <h3>Lorem ipsum...</h3>
        <Link to="/dashboard" style={{textDecoration:"none"}}>Get Started</Link>
      </div>
      <div className="terms">
        <img src="./logo.png" alt="" />
        <div className="links">
          <Link to="/" style={{ textDecoration: "none", color: "grey" }}>Terms of Services</Link>
          <span>|</span>
          <Link to="/" style={{ textDecoration: "none", color: "grey" }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
