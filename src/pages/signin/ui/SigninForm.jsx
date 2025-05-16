import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { useAuthStore } from "../state/signin.store";

export const SigninForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);

    if (e.target.value.length === 16) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonActive && !isLoading) {
      const success = await login(phoneNumber);
      if (success) {
        navigate("/signin-sms");
      }
    }
  };

  return (
    <div className="signin__content">
      <h1>Авторизация</h1>
      <div className="signin__content-code">
        Введите телефон для получения СМС-кода
      </div>
      <form className="signin__content-form" onSubmit={handleSubmit}>
        <PhoneInput value={phoneNumber} onChange={handlePhoneChange} />
        <Button
          type="submit"
          className={isButtonActive ? "_active" : ""}
          disabled={!isButtonActive || isLoading}
        >
          {isLoading ? "Отправка..." : "Отправить"}
        </Button>
        {error && <div className="signin__error">{error}</div>}
      </form>
      <div className="signin__content-politic">
        Нажимая «Отправить», я принимаю{" "}
        <a href="">условия передачи информации</a> и даю согласие на получение
        информации о продуктах и услугах компании
      </div>
    </div>
  );
};
