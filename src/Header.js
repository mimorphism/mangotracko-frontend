import { Link } from "react-router-dom";


const Header = () => {
  
return (
    <div id="mango-header">
      <header className="header">
        <Link className="logo" style={{fontSize:'35px'}}>MangoTracko
          <div className="bar"></div>
        </Link>
        <div className="toggle"></div>
        <ul>
          <li><Link to="finishedreading" className="link" style={{fontSize:'25px'}}>Finished
            <div className="bar"></div></Link>
          </li>
          <li><Link to="currentlyreading" className="link" style={{fontSize:'25px'}}>Currently Reading
            <div className="bar"></div></Link>
            </li>
          <li><Link to="addMango" className="link" style={{fontSize:'25px'}}>Add Mango
            <div className="bar"></div></Link>
          </li>
          <li><Link id="finishMango" className="link" style={{fontSize:'25px'}}>Finish Mango
            <div className="bar"></div></Link>
          </li>
        </ul>
      </header>
    </div>

  );
}

export default Header;