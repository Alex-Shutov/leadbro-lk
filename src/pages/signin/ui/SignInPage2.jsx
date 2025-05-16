import React from "react";
import styles from "./styles.module.sass";
import LoginForm from "./LoginForm";

export const SignInPage2 = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.authContainer}>
        <div className={styles.formSection}>
          <LoginForm />
        </div>
        <div className={styles.imageSection}>
          <img
            src="/img/login-illustration.png"
            alt="Login illustration"
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
};
