import React from "react";

const SwiperElement = ({ items, selectedItem, onClick }) => {
  return (
    <div className="swiper-wrapper">
      {items.map((el, index) => (
        <div className="swiper-slide" key={el.id || index}>
          <a
            className={`shop__link js-tabs-link ${selectedItem === el.key ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              debugger;
              e.preventDefault();
              onClick(el);
            }}
          >
            {el.label}
          </a>
        </div>
      ))}
    </div>
  );
};

export default SwiperElement;
