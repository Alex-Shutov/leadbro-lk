import React from "react";
import { Link } from "react-router-dom";
import { SigninForm } from "./SigninForm";
import { SigninSmsForm } from "./SigninSmsCode";

export const SigninPage = ({ smsVerification = false }) => {
  return (
    <div className="signin">
      <div className="signin__wrapper">
        <div className="signin__body">
          <div className="signin__sidebar">
            <div className="signin__logo">
              <Link to="/">
                <img src="/img/custom/logo.svg" alt="LeadBro" />
              </Link>
            </div>
            <div className="signin__sidebar-image">
              <img src="/img/custom/illustration.svg" alt="Иллюстрация" />
            </div>
            <div className="signin__sidebar-slogan">
              Маркетинговые решения нового уровня
            </div>
            <a href="tel:+73433644223" className="signin__sidebar-phone">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.68273 9.00943C2.5794 6.79522 3.69265 4.35157 5.81397 3.07877C6.8353 2.46598 8.15528 2.73192 8.85963 3.6924L10.4223 5.82331C11.0874 6.73027 11.1893 7.93307 10.6864 8.93904L10.2766 9.75849C10.158 9.99571 10.1393 10.2701 10.2606 10.506C10.4816 10.9356 10.9524 11.6971 11.8592 12.6038C12.766 13.5106 13.5274 13.9814 13.9571 14.2024C14.1929 14.3237 14.4673 14.305 14.7045 14.1864L15.524 13.7766C16.5299 13.2737 17.7327 13.3756 18.6397 14.0407L20.7706 15.6034C21.7311 16.3077 21.997 17.6277 21.3842 18.649C20.1114 20.7704 17.6678 21.8836 15.4536 20.7803C13.5874 19.8504 11.2028 18.3114 8.67717 15.7858C6.15156 13.2602 4.61261 10.8756 3.68273 9.00943Z"
                  fill="#FF6A55"
                />
              </svg>
              8 (343) 364-42-23
            </a>
            <a href="mailto:sale@lead-bro.ru" className="signin__sidebar-mail">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.95759 5.40673C2.82495 5.61793 2.91154 5.88824 3.12359 6.0195L11.9735 11.498C12.296 11.6977 12.7037 11.6977 13.0262 11.498L21.8764 6.01941C22.0884 5.88814 22.175 5.61782 22.0423 5.40662C21.5117 4.56167 20.5714 4 19.5 4H5.5C4.42853 4 3.48825 4.56171 2.95759 5.40673Z"
                  fill="#FF6A55"
                />
                <path
                  d="M22.5 8.88312C22.5 8.49137 22.0699 8.25179 21.7368 8.45799L14.079 13.1986C13.1114 13.7975 11.8883 13.7975 10.9208 13.1986L3.26318 8.45812C2.93008 8.25192 2.5 8.4915 2.5 8.88326V17C2.5 18.6569 3.84315 20 5.5 20H19.5C21.1569 20 22.5 18.6569 22.5 17V8.88312Z"
                  fill="#FF6A55"
                />
              </svg>
              sale@lead-bro.ru
            </a>
          </div>
          {smsVerification ? <SigninSmsForm /> : <SigninForm />}
        </div>
      </div>
    </div>
  );
};
