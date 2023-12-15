import classes from "./Login.module.css";
import { apiUrl } from "../utils/helpers";

const Login: React.FC = () => {
  return (
    <div className={classes.container}>
      <a className={classes["login-button"]} href={`${apiUrl}/auth/google`}>
        <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" />{" "}
        Entrar con google
      </a>
    </div>
  );
};

export default Login;
