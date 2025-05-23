import React, { useEffect, useState } from "react";
import { CheckboxSelect } from "../../../shared/ui/select";
import "./KeywordsPositions.css";
import { SearchEngineSelector } from "../../../widgets/common/ui/SearchEngineSelector";
import { RegionSelector } from "../../../widgets/common/ui/RegionSelector";
import { CustomDatePicker } from "../../../widgets/common/ui/CustomDatePicker";
import { parseDateFromYandex } from "../lib/utils";
import { HowToModal } from "./HowToModal";
import { InfoModal } from "./InfoModal";
import { Icon } from "../../../shared/ui/icon"; // Импортируем наши стили

export const KeywordsPositions = ({
  keywords,
  isLoading,
  searchers,
  regions,
  selectedSearcher,
  selectedRegion,
  onSearcherChange,
  onRegionChange,
  projectDataLoading,
  keywordsDateRange,
  onKeywordsDateRangeChange,
}) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [expandedKeywords, setExpandedKeywords] = useState([]);
  const [howToModalOpen, setHowToModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  debugger;
  const defaultStartDate = keywordsDateRange?.start
    ? new Date(parseDateFromYandex(keywordsDateRange.start))
    : new Date();
  const defaultEndDate = keywordsDateRange?.end
    ? new Date(parseDateFromYandex(keywordsDateRange.end))
    : new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const toggleKeyword = (keywordId) => {
    debugger;
    if (expandedKeywords.includes(keywordId)) {
      setExpandedKeywords(expandedKeywords.filter((id) => id !== keywordId));
    } else {
      setExpandedKeywords([...expandedKeywords, keywordId]);
    }
  };

  const filteredKeywords = keywords?.filter((keyword) =>
    searchQuery
      ? keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );
  useEffect(() => {
    if (keywordsDateRange?.start && keywordsDateRange?.end) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [keywordsDateRange]);

  // Функция для определения CSS класса позиции на основе значения и изменения
  const getPositionClass = (position, previousPosition = null) => {
    const value = position.value;

    // Если позиция не найдена (например, 0 или > 100)
    if (!value || value === 0 || value > 100 || value === "--") {
      return "position-cell not-found";
    }

    let classes = ["position-cell"];

    // Определяем класс для топ позиций
    if (value === 1) classes.push("top1");
    else if (value === 2) classes.push("top2");
    else if (value === 3) classes.push("top3");
    else if (value <= 5) classes.push("top4");
    else if (value <= 7) classes.push("top6");
    else if (value <= 9) classes.push("top8");
    else if (value === 10) classes.push("top10");

    // Если есть предыдущая позиция, определяем изменение
    if (previousPosition && previousPosition.value) {
      const change = previousPosition.value - value; // Положительное значение = улучшение позиции

      if (change > 0) {
        // Позиция улучшилась
        if (change >= 10) classes.push("move10");
        else if (change >= 5) classes.push("move5");
        else classes.push(`move${change}`);
      } else if (change < 0) {
        // Позиция ухудшилась
        const absChange = Math.abs(change);
        if (absChange >= 10) classes.push("move-10");
        else if (absChange >= 5) classes.push("move-5");
        else classes.push(`move-${absChange}`);
      } else {
        // Позиция не изменилась
        classes.push("move0");
      }
    }

    // Добавляем класс для high lighted позиций из исходного кода
    if (position.highlight === "green") {
      classes.push("position-green"); // Зеленый highlight соответствует топ 3
    } else if (position.highlight === "yellow") {
      classes.push("position-red"); // Желтый highlight соответствует топ 10
    }

    return classes.join(" ");
  };

  // Функция для получения класса индикатора изменений
  const getChangeIndicatorClass = (change) => {
    if (change.positive) return "change-indicator positive";
    if (change.value === 0) return "change-indicator neutral";
    return "change-indicator negative";
  };
  const resetDates = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    setStartDate(weekAgo);
    setEndDate(today);
  };

  const positionDates =
    filteredKeywords &&
    filteredKeywords.length > 0 &&
    filteredKeywords[0].positions
      ? filteredKeywords[0].positions.map((pos) => pos.date)
      : [];

  return (
    <div className="requests requests-yandex keywords">
      <div className="shop__control">
        <div
          className="shop__nav shop__nav-links period-dl"
          style={{
            display: "flex",
            gap: "20px",
            padding: "12px 0",
          }}
        >
          <SearchEngineSelector
            searchers={searchers}
            selectedSearcher={selectedSearcher}
            onSearcherChange={onSearcherChange}
            isLoading={projectDataLoading}
          />

          <RegionSelector
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
            isLoading={projectDataLoading}
          />
          <CustomDatePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            onApply={(dates) => {
              debugger;
              onKeywordsDateRangeChange({
                start: dates.start,
                end: dates.end,
              });
            }}
            onReset={resetDates}
          />
        </div>
      </div>
      <div className="requests__titles">
        <h2>Ключевые слова и позиции</h2>
        <div
          className="requests__titles-btn how-top-positions"
          onClick={() => setHowToModalOpen(true)}
        >
          Как поднять позиции сайта быстрее
        </div>
        {/*<a href="/" className="requests__titles-btn requests__titles-btn-excel">*/}
        {/*  <svg*/}
        {/*    width="24"*/}
        {/*    height="22"*/}
        {/*    viewBox="0 0 24 22"*/}
        {/*    fill="none"*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*  >*/}
        {/*    <path*/}
        {/*      d="M22.3417 3.56836H13.5818V6.27098H15.6036C15.9755 6.27098 16.2772 6.5737 16.2772 6.94659C16.2772 7.31958 15.9754 7.6223 15.6036 7.6223H13.5818V8.97375H15.6036C15.9755 8.97375 16.2772 9.27647 16.2772 9.64912C16.2772 10.0222 15.9754 10.3249 15.6036 10.3249H13.5818V11.6762H15.6036C15.9755 11.6762 16.2772 11.9789 16.2772 12.3519C16.2772 12.7246 15.9754 13.0274 15.6036 13.0274H13.5818V14.3789H15.6036C15.9755 14.3789 16.2772 14.6816 16.2772 15.0547C16.2772 15.4276 15.9754 15.7302 15.6036 15.7302H13.5818V18.4327H22.3417C22.7138 18.4327 23.0156 18.1301 23.0155 17.757V4.24397C23.0155 3.87098 22.7138 3.56836 22.3417 3.56836ZM19.6464 15.7302H18.2988C17.9269 15.7302 17.6248 15.4275 17.6248 15.0546C17.6248 14.6815 17.9269 14.3788 18.2988 14.3788H19.6464C20.0183 14.3788 20.3202 14.6815 20.3202 15.0546C20.3202 15.4275 20.0183 15.7302 19.6464 15.7302ZM19.6464 13.0273H18.2988C17.9269 13.0273 17.6248 12.7246 17.6248 12.3519C17.6248 11.9789 17.9269 11.6762 18.2988 11.6762H19.6464C20.0183 11.6762 20.3202 11.9789 20.3202 12.3519C20.3202 12.7246 20.0183 13.0273 19.6464 13.0273ZM19.6464 10.3249H18.2988C17.9269 10.3249 17.6248 10.0222 17.6248 9.64908C17.6248 9.27642 17.9269 8.9737 18.2988 8.9737H19.6464C20.0183 8.9737 20.3202 9.27642 20.3202 9.64908C20.3202 10.0222 20.0183 10.3249 19.6464 10.3249ZM19.6464 7.6222H18.2988C17.9269 7.6222 17.6248 7.31948 17.6248 6.9465C17.6248 6.57361 17.9269 6.27089 18.2988 6.27089H19.6464C20.0183 6.27089 20.3202 6.57361 20.3202 6.9465C20.3202 7.31953 20.0183 7.6222 19.6464 7.6222Z"*/}
        {/*      fill="#207245"*/}
        {/*    />*/}
        {/*    <path*/}
        {/*      d="M12.8694 1.02102C12.7155 0.892674 12.5093 0.837174 12.3154 0.877908L1.53422 2.90469C1.21481 2.96446 0.984375 3.24271 0.984375 3.5683V18.4326C0.984375 18.757 1.21481 19.0365 1.53422 19.0963L12.3153 21.1231C12.3557 21.1311 12.3975 21.1353 12.4394 21.1353C12.5956 21.1353 12.7479 21.0813 12.8693 20.9797C13.0244 20.8516 13.113 20.6597 13.113 20.4595V18.4326V15.7302V14.3788V13.0273V11.6761V10.3248V8.9736V7.62214V6.27088V3.5683V1.54152C13.113 1.34005 13.0244 1.14946 12.8694 1.02102ZM10.1877 14.2111C10.0596 14.3234 9.90173 14.3788 9.74395 14.3788C9.55683 14.3788 9.37083 14.3003 9.23728 14.1466L7.27795 11.9017L5.55956 14.1178C5.4263 14.2896 5.22811 14.3787 5.02734 14.3787C4.8833 14.3787 4.73625 14.3328 4.61217 14.2369C4.31986 14.0073 4.26586 13.5829 4.49503 13.2881L6.37369 10.8667L4.52063 8.74246C4.27538 8.46261 4.30373 8.03567 4.58395 7.78996C4.86159 7.54386 5.28755 7.5695 5.53406 7.85357L7.21594 9.78022L9.21202 7.2073C9.44213 6.91419 9.86536 6.8601 10.1578 7.08992C10.4502 7.31942 10.5044 7.74383 10.2753 8.03858L8.12006 10.8169L10.251 13.2585C10.4961 13.5384 10.4679 13.9654 10.1877 14.2111Z"*/}
        {/*      fill="#207245"*/}
        {/*    />*/}
        {/*  </svg>*/}
        {/*  Скачать Excel*/}
        {/*</a>*/}
        <button
          className="button-square-stroke button-small filters__head"
          onClick={() => setInfoModalOpen(true)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.99992 13.3335C10.9454 13.3335 13.3333 10.9457 13.3333 8.00016C13.3333 5.05464 10.9454 2.66683 7.99992 2.66683C5.0544 2.66683 2.66659 5.05464 2.66659 8.00016C2.66659 10.9457 5.0544 13.3335 7.99992 13.3335ZM7.99992 14.6668C11.6818 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6818 1.3335 7.99992 1.3335C4.31802 1.3335 1.33325 4.31826 1.33325 8.00016C1.33325 11.6821 4.31802 14.6668 7.99992 14.6668Z"
              fill="#6F767E"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.99992 6.6665C8.36811 6.6665 8.66659 6.96498 8.66659 7.33317V10.6671C8.66659 11.0353 8.36811 11.3338 7.99992 11.3338C7.63173 11.3338 7.33325 11.0353 7.33325 10.6671V7.33317C7.33325 6.96498 7.63173 6.6665 7.99992 6.6665Z"
              fill="#6F767E"
            />
            <circle cx="7.99992" cy="5.33317" r="0.666667" fill="#6F767E" />
          </svg>
        </button>
      </div>
      <div className="requests__table">
        <div className="requests__table-title">
          <div className="requests__table-title-item">
            <div className="search" style={{ width: "315px" }}>
              <div className="search__head">
                <button className="search__start">
                  <svg className="icon icon-search">
                    <use xlinkHref="#icon-search"></use>
                  </svg>
                </button>
                <button className="search__direction">
                  <svg className="icon icon-arrow-left">
                    <use xlinkHref="#icon-arrow-left"></use>
                  </svg>
                </button>
                <input
                  className="search__input"
                  type="text"
                  placeholder="Ключевые слова"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="search__close"
                    onClick={() => setSearchQuery("")}
                  >
                    <svg className="icon icon-close-circle">
                      <use xlinkHref="#icon-close-circle"></use>
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="search__body">
                  <div className="search__box">
                    {filteredKeywords?.slice(0, 5).map((keyword, index) => (
                      <a
                        href="#"
                        className="search__box-item"
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchQuery(keyword.keyword);
                        }}
                      >
                        {keyword.keyword}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="requests__table-title-item title no-flex">
            <div>Город</div>
          </div>
          <div className="requests__table-title-item title no-flex">
            <div>ПС</div>
          </div>
          <div className="requests__table-title-item title ">
            <div>Изм.</div>
            {positionDates.map((date, index) => (
              <div key={index}>{date}</div>
            ))}
          </div>
        </div>
        <div className="requests__table-body">
          {isLoading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Загрузка данных...
            </div>
          ) : (
            filteredKeywords?.map((keyword) => (
              <div
                key={keyword.id}
                className={`requests__table-body-row acc-wrap ${expandedKeywords.includes(keyword.id) ? "active" : ""}`}
              >
                <div
                  className="requests__table-body-item acc-title"
                  onClick={() => toggleKeyword(keyword.id)}
                >
                  <div>{keyword.keyword}</div>
                  <div
                    className={"requests__table-body-item acc-title add-info"}
                  >
                    <Icon
                      name="chevron"
                      className={`chevron ${expandedKeywords.includes(keyword.id) ? "active" : ""}`}
                    />
                    {/* Мобильные значения - используем новые стили */}
                    <div
                      className={getPositionClass(keyword.positions[0] || {})}
                      data-date={`Позиция на ${keyword.positions[0]?.date || "-"}`}
                    >
                      Позиция на {keyword.positions[0]?.date}:{" "}
                      {keyword.positions[0]?.value || "-"}
                    </div>
                    <div
                      className="request-city mobile-value"
                      data-city={`${keyword.city} / `}
                      data-searcher={keyword.searchEngine}
                    ></div>
                  </div>
                </div>
                <div className="requests__table-body-item">
                  <div>{keyword.city}</div>
                </div>
                <div className="requests__table-body-item">
                  <div>{keyword.searchEngine}</div>
                </div>
                <div className="requests__table-body-item">
                  <div
                    className={`requests__table-positions acc-body ${expandedKeywords.includes(keyword.id) ? "expanded" : ""}`}
                  >
                    <div
                      className={getChangeIndicatorClass(keyword.change)}
                      data-date="Изм."
                    >
                      <svg
                        style={{
                          display: "block",
                          position: "absolute",
                          top: "2px",
                          ...{
                            transform: keyword.change.positive
                              ? "none"
                              : "rotate(180deg)",
                          },
                        }}
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 3L12.3301 10.5H3.66987L8 3Z"
                          fill="currentColor"
                        />
                      </svg>
                      {keyword.change.value}
                    </div>

                    {/* Позиции с улучшенными стилями */}
                    {keyword.positions.map((position, index) => {
                      const previousPosition = keyword.positions[index + 1]; // Предыдущая позиция для сравнения
                      return (
                        <div
                          key={index}
                          className={getPositionClass(
                            position,
                            previousPosition,
                          )}
                          data-date={position.date}
                          title={`Позиция ${position.value} на ${position.date}`}
                        >
                          {position.value || "—"}
                          {position.diff && position.diff.value !== null && (
                            <span
                              className={
                                position.diff.upper
                                  ? "position-diff-up"
                                  : "position-diff-down"
                              }
                            >
                              {position.diff.upper ? "↑" : "↓"}
                              {position.diff.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {infoModalOpen && (
        <InfoModal
          title="Ключевые слова и позиции"
          description="Эта таблица показывает текущие позиции вашего сайта в поисковых системах по отслеживаемым ключевым словам. Здесь вы можете отслеживать изменения позиций с течением времени и видеть, как меняется видимость вашего сайта в поисковых системах."
          onClose={() => setInfoModalOpen(false)}
        />
      )}

      <HowToModal
        isOpen={howToModalOpen}
        onClose={() => setHowToModalOpen(false)}
      />
      {/*{infoModalOpen && (*/}
      {/*  <div className="info-modal">*/}
      {/*    <div className="info-modal__title">*/}
      {/*      <p>Ключевые слова и позиции</p>*/}
      {/*      <div*/}
      {/*        className="closeModalInfoBtn"*/}
      {/*        onClick={() => setInfoModalOpen(false)}*/}
      {/*      >*/}
      {/*        <svg*/}
      {/*          width="16"*/}
      {/*          height="16"*/}
      {/*          viewBox="0 0 16 16"*/}
      {/*          fill="none"*/}
      {/*          xmlns="http://www.w3.org/2000/svg"*/}
      {/*        >*/}
      {/*          <path*/}
      {/*            d="M4.47132 3.52876C4.21097 3.26841 3.78886 3.26841 3.52851 3.52876C3.26816 3.78911 3.26816 4.21122 3.52851 4.47157L7.05712 8.00017L3.52853 11.5288C3.26818 11.7891 3.26818 12.2112 3.52853 12.4716C3.78888 12.7319 4.21099 12.7319 4.47134 12.4716L7.99993 8.94298L11.5285 12.4716C11.7889 12.7319 12.211 12.7319 12.4713 12.4716C12.7317 12.2112 12.7317 11.7891 12.4713 11.5288L8.94274 8.00017L12.4713 4.47157C12.7317 4.21122 12.7317 3.78911 12.4713 3.52876C12.211 3.26841 11.7889 3.26841 11.5285 3.52876L7.99993 7.05737L4.47132 3.52876Z"*/}
      {/*            fill="#6F767E"*/}
      {/*          />*/}
      {/*        </svg>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="info-modal__desc">*/}
      {/*      Эта таблица показывает текущие позиции вашего сайта в поисковых*/}
      {/*      системах по отслеживаемым ключевым словам. Цвета позиций помогают*/}
      {/*      быстро оценить качество ранжирования: зеленые оттенки для*/}
      {/*      топ-позиций, красные для низких позиций, а изменения показывают*/}
      {/*      динамику.*/}
      {/*    </div>*/}
      {/*    <div*/}
      {/*      className="info-modal__btn closeModalInfoBtn"*/}
      {/*      onClick={() => setInfoModalOpen(false)}*/}
      {/*    >*/}
      {/*      Готово*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};
