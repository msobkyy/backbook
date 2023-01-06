import { useState } from "react";
import LoginForm from "../../components/login/LoginForm";
import LoginFooter from "../../components/login/LoginFooter";
import styles from "./style.module.css";
import SignupForm from "../../components/login/SignupForm";

function Login() {
  const [renderSignUp, setRenderSignUp] = useState(false);
  return (
    <div className="login">
      <div className={styles.wrapper}>
        <LoginForm setRenderSignUp={setRenderSignUp} />
        {renderSignUp && (
          <SignupForm
            renderSignUp={renderSignUp}
            setRenderSignUp={setRenderSignUp}
          />
        )}
        <LoginFooter />
      </div>
    </div>
  );
}

export default Login;
