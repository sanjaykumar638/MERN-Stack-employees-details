import { Link } from "react-router-dom"
import  '.././App.css'
export const NavBar = () => {
  const handleLout = ()=>{
    localStorage.removeItem("token");
  }
return (
    <div className="navbarCustom">
       <nav className="navbar  navbar-expand-sm navbar-dark bg-light text-uppercase " style={{backgroundImage:"radial-gradient( circle 654px at 0.6% 48%,  rgba(12,170,255,1) 0%, rgba(151,255,129,1) 99.3% )"}}>
        <div className="container-fluid " >
            <ul className="navbar-nav ms-5 mt-2">
              <li className="nav-item">
                <Link className="btn btn-light btn-outline-primary" to="/department">Designation</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-light btn-outline-primary" to="/employee">Employee</Link>
               </li>
               <li className="nav-item">
              <button className="Logout" onClick={handleLout}><Link className="btn btn-light btn-outline-primary LogoutLink" to="/">logout <span><i className="fa-sharp fa-solid fa-right-from-bracket"  style={{ fontSize: "16px" }}></i></span></Link></button>
              </li>
            </ul>
          </div>
      </nav>
        <h1 style={{textAlign:"center"}}>Employee Management System</h1>
    </div>
)
}