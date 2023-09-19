
import { useSession } from "../../contexts/auth/Auth";
import { Link } from "react-router-dom";
import "./styles.scss";

const NavBar = () => {
  const session = useSession();
  return (
    <div className="menu">
      <div className="links">
        <nav>
          <span style={{ marginRight: "1em" }}>
            <Link to="/">home</Link>
          </span>
          <span>
            <Link to="/about">about</Link>
          </span>
        </nav>
      </div>
      <div className="greetings">
        <div>Token: {session.token}</div>
        <span>Welcome Home!</span>
        <button onClick={session.logout}>Log out</button>
      </div>
    </div>
  );
};
export default NavBar
