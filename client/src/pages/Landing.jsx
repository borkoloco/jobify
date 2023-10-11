import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <img src={logo} alt="jobify" className="logo" />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            I´m baby synth poutine bicycle rights shaman tbh fashion axe
            cornhole locavore four loko shabby chic. Williamsburg cornhole
            microdosing XOXO, hashtag neutra gentrify franzen tattooed fit
            everyday carry fanny pack. Umami stumptown chia disrupt, XOXO fixie
            echo park beard knausgaard letterpress ramps. Etsy everyday carry
            hashtag, church-key vape sartorial sus dreamcatcher bespoke.
          </p>

          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
