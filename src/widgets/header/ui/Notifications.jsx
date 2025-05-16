import React, { useRef } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";

export const Notifications = ({ isActive, onToggle }) => {
  const notificationRef = useRef(null);
  useOutsideClick(notificationRef, () => {
    if (isActive) {
      onToggle(notificationRef.current);
    }
  }, [".header__head"]);

  const handleBodyClick = (e) => {
    e.stopPropagation();
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(e);
  };
  return (
    <div
      className={cn("header__item header__item_notifications", {
        active: isActive,
      })}
      ref={notificationRef}
    >
      <button
        className={cn("header__head", { active: isActive })}
        onClick={handleToggle}
      >
        <svg
          className="icon icon-notification"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeWidth="2"
            d="M15.357 20.1758C15.7129 19.6278 15.2374 19 14.584 19H9.41595C8.76251 19 8.28703 19.6278 8.64294 20.1758C9.35604 21.2738 10.5932 22 12 22C13.4067 22 14.6439 21.2738 15.357 20.1758Z"
            fill="#1A1D1F"
          />
          <path
            strokeWidth="2"
            d="M20.5858 17H3.40408C2.62863 17 2 16.3714 2 15.5959C2 15.2151 2.15471 14.8506 2.42864 14.586L3.45736 13.5924C3.84919 13.2139 4.06969 12.692 4.06791 12.1473L4.06086 9.99568C4.04641 5.58403 7.61873 2 12.0304 2C16.4319 2 20 5.5681 20 9.96958L20 12.1716C20 12.702 20.2107 13.2107 20.5858 13.5858L21.5858 14.5858C21.851 14.851 22 15.2107 22 15.5858C22 16.3668 21.3668 17 20.5858 17Z"
            fill="#1A1D1F"
          />
        </svg>
      </button>
      <div className="header__body" onClick={handleBodyClick}>
        <div className="header__top">
          <div className="header__title">Уведомления</div>
          <div className="actions actions_small">
            <div className="actions__body">
              <button className="actions__option">
                <svg className="icon icon-check">
                  <use xlinkHref="#icon-check"></use>
                </svg>
                Mark as read
              </button>
              <button className="actions__option">
                <svg className="icon icon-trash">
                  <use xlinkHref="#icon-trash"></use>
                </svg>
                Delete notifications
              </button>
            </div>
          </div>
        </div>
        <div className="shop__control" style={{ marginBottom: "10px" }}>
          <div className="shop__nav shop__nav-links">
            <div className="shop-links__wrap">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <Link className="shop__link js-tabs-link active" to="#">
                    Все
                  </Link>
                </div>
                <div className="swiper-slide">
                  <Link className="shop__link js-tabs-link" to="#">
                    Оплата
                  </Link>
                </div>
                <div className="swiper-slide">
                  <Link className="shop__link js-tabs-link" to="#">
                    Информация
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header__list">
          <div className="header__notification new">
            <div className="header__notification-title">
              <p>Оплата счета №98698</p>
              <span>1ч</span>
            </div>
            <div className="header__notification-desc">
              Напоминаем вам о необходимости оплаты услуг
            </div>
            <Link to="/" className="header__notification-btn">
              Оплатить
            </Link>
          </div>
          <div className="header__notification new">
            <div className="header__notification-title">
              <p>Договор №24249</p>
              <span>1ч</span>
            </div>
            <div className="header__notification-desc">
              Прикрепляем договор на оказание услуг по SEO-продвижению
            </div>
            <Link to="/" className="header__notification-btn">
              Скачать
            </Link>
          </div>
          <div className="header__notification">
            <div className="header__notification-title">
              <p>Задача по проекту</p>
              <span>1ч</span>
            </div>
            <div className="header__notification-desc">
              Просим согласовать макет главной страницы
            </div>
            <Link to="/" className="header__notification-btn">
              Смотреть
            </Link>
          </div>
        </div>
        <Link className="button header__button" to="notification.html">
          Все просмотрены
        </Link>
      </div>
    </div>
  );
};
