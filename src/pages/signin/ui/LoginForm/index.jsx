import React, { useState, useContext } from "react";
import styles from "../styles.module.sass";
import cn from "classnames";
import { useAuthStore } from "../../state/signin.store";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginByEmail: login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event?.preventDefault();
    login(email, password).then((res) => {
      res && navigate("/statistics");
    });
  };

  return (
    <form className={styles.loginForm}>
      <Input
        type={"input"}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        edited={true}
        className={styles.input}
        label={"Электронная Почта"}
      />
      <Input
        type={"password"}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        edited={true}
        className={styles.input}
        label={"Пароль"}
      />
      <div className={styles.buttonContainer}>
        <Button
          onClick={(e) => handleSubmit(e)}
          classname={cn(styles.submitButton)}
        >
          <span>Войти</span>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
