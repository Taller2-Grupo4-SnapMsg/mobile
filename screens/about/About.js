import "../../styles/about.scss";

const About = () => (
  <div className="about-container">
    <div className="content">
      <h1>About</h1>
      <p>Developed using:</p>
      <ul>
        <li> React </li>
        <li>
          <a href={process.env.REACT_APP_API_URL}>reqres.in</a>
        </li>
      </ul>
    </div>
  </div>
);

export default About;
