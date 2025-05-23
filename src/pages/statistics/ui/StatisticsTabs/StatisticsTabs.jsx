import React, { useState } from "react";
import { StatCard } from "../../widgets/StatCard";
import { InfoModal } from "../../widgets/InfoModal";
import { Chart } from "../../../../shared/ui/chart";
import { Select } from "../../../../shared/ui/select";
import LockedCard from "../../../../widgets/common/ui/LockedCard";
import { serviceHasMetricsData } from "../../../../core/lib/utils";

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
  serviceType,
}) => {
  const [visitsInfoOpen, setVisitsInfoOpen] = useState(false);
  const [rejectionsInfoOpen, setRejectionsInfoOpen] = useState(false);
  const [goalsInfoOpen, setGoalsInfoOpen] = useState(false);
  const enableVisitsCard = serviceHasMetricsData(serviceType);
  const enableRejectionsCard = serviceHasMetricsData(serviceType);
  const enableGoaldCard = true;

  return (
    <div className="page__col graphs__container">
      {/* Visits Card */}
      <StatCard
        title="Визиты из поисковых систем"
        value={enableVisitsCard ? visits?.value || "-" : null}
        change={visits?.change}
        comparedTo={visits?.comparedTo}
        onInfoClick={enableVisitsCard ? () => setVisitsInfoOpen(true) : null}
      >
        {visitsInfoOpen && enableVisitsCard && (
          <InfoModal
            title="Визиты из поисковых систем"
            description="Этот график показывает общее количество визитов из поисковых систем. Эти данные помогают отслеживать эффективность поисковой оптимизации и понимать, как меняется поисковый трафик с течением времени."
            onClose={() => setVisitsInfoOpen(false)}
          />
        )}
        {enableVisitsCard ? (
          <Chart
            id="search-visits"
            type={graphType}
            series={visits?.series}
            categories={visits?.categories}
            isLoading={visitsLoading}
          />
        ) : (
          <LockedCard label={"Подключить VisitsTracking"} />
        )}
      </StatCard>

      {/* Rejections Card */}
      <StatCard
        title="Отказы"
        value={enableRejectionsCard ? (rejections?.value ?? "--") + "%" : null}
        change={rejections?.change}
        comparedTo={rejections?.comparedTo}
        onInfoClick={
          enableRejectionsCard ? () => setRejectionsInfoOpen(true) : null
        }
      >
        {rejectionsInfoOpen && enableRejectionsCard && (
          <InfoModal
            title="Отказы"
            description="Этот график показывает общий процент отказов. Отказом считается визит, в рамках которого сосотоялся просмотр лишь одной страницы, продолжающийся менее 15 секунд. Этот показатель демонстрирует, насколько сайт соответствует запросу пользователя. Чем ниже процент отказов, тем лучше."
            onClose={() => setRejectionsInfoOpen(false)}
          />
        )}
        {enableRejectionsCard ? (
          <Chart
            id="rejections"
            type={graphType}
            series={rejections?.series}
            categories={rejections?.categories}
            isLoading={rejectionsLoading}
          />
        ) : (
          <LockedCard label={"Подключить RejectTracking"} />
        )}
      </StatCard>

      {/* Goals Card */}
      <StatCard
        title="Выполненные цели"
        value={
          enableRejectionsCard
            ? goals?.value !== 0
              ? (goals?.value ?? "--") + "%"
              : "Нет данных"
            : null
        }
        change={goals?.value !== 0 ? goals?.change : null}
        comparedTo={goals?.comparedTo}
        onInfoClick={enableRejectionsCard ? () => setGoalsInfoOpen(true) : null}
      >
        {goalsInfoOpen && (
          <InfoModal
            title="Выполненные цели"
            description="Этот график показывает количество выполненных целей (конверсий) на сайте. Цели могут включать заполнение форм, звонки, покупки и другие действия, которые посетители совершают на вашем сайте."
            onClose={() => setGoalsInfoOpen(false)}
          />
        )}
        {enableRejectionsCard ? (
          <Chart
            id="goals"
            type={graphType}
            series={goals?.series}
            categories={goals?.categories}
            isLoading={goalsLoading}
            height="100px"
          />
        ) : (
          <LockedCard label={"Подключить GoalTracking"} />
        )}
        {enableRejectionsCard && (
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
        )}
      </StatCard>

      {/* Calltracking Card */}
      <StatCard title={"Количество звонков с сайта"}>
        <LockedCard label={"Подключить CallTracking"} />
      </StatCard>
    </div>
  );
};
