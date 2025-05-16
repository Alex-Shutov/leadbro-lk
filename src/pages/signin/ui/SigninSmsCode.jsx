import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button";
import { useAuthStore } from "../state/signin.store";

export const SigninSmsForm = () => {
  const navigate = useNavigate();
  const { verifyCode, isLoading, error } = useAuthStore();
  const [smsCode, setSmsCode] = useState(["", "", "", ""]);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleCodeChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newCode = [...smsCode];
      newCode[index] = value;
      setSmsCode(newCode);

      if (value && index < 3 && inputRefs[index + 1].current) {
        inputRefs[index + 1].current.focus();
      }

      setIsButtonActive(newCode.every((digit) => digit !== ""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !smsCode[index] &&
      index > 0 &&
      inputRefs[index - 1].current
    ) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonActive && !isLoading) {
      const code = smsCode.join("");
      const success = await verifyCode(code);
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="signin__content">
      <h1>Авторизация</h1>
      <div className="signin__content-code">Введите код из СМС</div>
      <form className="signin__content-form" onSubmit={handleSubmit}>
        <div className="signin__inputs">
          {smsCode.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="tel"
              className="numberInput"
              placeholder="0"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <Button
          type="submit"
          className={isButtonActive ? "_active" : ""}
          disabled={!isButtonActive || isLoading}
        >
          {isLoading ? "Проверка..." : "Отправить"}
        </Button>
        {error && <div className="signin__error">{error}</div>}
      </form>
    </div>
  );
};
