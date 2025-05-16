import React, { useState } from "react";
import { StatCard } from "../../widgets/StatCard";
import { InfoModal } from "../../widgets/InfoModal";
import { Chart } from "../../../../shared/ui/chart";
import { Select } from "../../../../shared/ui/select";

export const StatisticsTabs = ({
  visits,
  rejections,
  goals,
  visitsLoading,
  rejectionsLoading,
  goalsLoading,
  graphType,
  selectedConversion,
  onConversionChange,
}) => {
  const [visitsInfoOpen, setVisitsInfoOpen] = useState(false);
  const [rejectionsInfoOpen, setRejectionsInfoOpen] = useState(false);
  const [goalsInfoOpen, setGoalsInfoOpen] = useState(false);

  return (
    <div className="page__col graphs__container">
      {/* Visits Card */}
      <StatCard
        title="Визиты из поисковых систем"
        value={visits?.value || "-"}
        change={visits?.change}
        comparedTo={visits?.comparedTo}
        onInfoClick={() => setVisitsInfoOpen(true)}
      >
        {visitsInfoOpen && (
          <InfoModal
            title="Визиты из поисковых систем"
            description="Этот график показывает общее количество визитов из поисковых систем. Эти данные помогают отслеживать эффективность поисковой оптимизации и понимать, как меняется поисковый трафик с течением времени."
            onClose={() => setVisitsInfoOpen(false)}
          />
        )}
        <Chart
          id="search-visits"
          type={graphType}
          series={visits?.series}
          categories={visits?.categories}
          isLoading={visitsLoading}
        />
      </StatCard>

      {/* Rejections Card */}
      <StatCard
        title="Отказы"
        value={rejections?.value + "%" || "-"}
        change={rejections?.change}
        comparedTo={rejections?.comparedTo}
        onInfoClick={() => setRejectionsInfoOpen(true)}
      >
        {rejectionsInfoOpen && (
          <InfoModal
            title="Отказы"
            description="Этот график показывает общий процент отказов. Отказом считается визит, в рамках которого сосотоялся просмотр лишь одной страницы, продолжающийся менее 15 секунд. Этот показатель демонстрирует, насколько сайт соответствует запросу пользователя. Чем ниже процент отказов, тем лучше."
            onClose={() => setRejectionsInfoOpen(false)}
          />
        )}
        <Chart
          id="rejections"
          type={graphType}
          series={rejections?.series}
          categories={rejections?.categories}
          isLoading={rejectionsLoading}
        />
      </StatCard>

      {/* Goals Card */}
      <StatCard
        title="Выполненные цели"
        value={goals?.value !== 0 ? goals?.value + "%" || "-" : "Нет данных"}
        change={goals?.value !== 0 ? goals?.change : null}
        comparedTo={goals?.comparedTo}
        onInfoClick={() => setGoalsInfoOpen(true)}
      >
        {goalsInfoOpen && (
          <InfoModal
            title="Выполненные цели"
            description="Этот график показывает количество выполненных целей (конверсий) на сайте. Цели могут включать заполнение форм, звонки, покупки и другие действия, которые посетители совершают на вашем сайте."
            onClose={() => setGoalsInfoOpen(false)}
          />
        )}
        <Chart
          id="goals"
          type={graphType}
          series={goals?.series}
          categories={goals?.categories}
          isLoading={goalsLoading}
          height="100px"
        />
        <div className="card__select">
          <Select
            options={
              goals?.conversions?.map((conv) => ({
                value: conv,
                label: conv,
              })) || []
            }
            value={selectedConversion}
            onChange={onConversionChange}
          />
        </div>
      </StatCard>

      {/* Calltracking Card */}
      <div className="total card">
        <div className="card__head">
          <div className="title-blue card__title" style={{ padding: 0 }}>
            Количество звонков с сайта
          </div>
        </div>
        <img src="img/custom/Locked.svg" alt="" />
        <a href="/" className="requests__titles-btn">
          Подключить Calltracking
        </a>
      </div>
    </div>
  );
};
