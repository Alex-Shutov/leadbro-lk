import React, { useState } from "react";
import { Layout } from "../../../shared/ui/layout";
import PageTtile from "../../../widgets/common/ui/PageTtile";
import { FaqItem } from "./FaqItem";

const faqData = [
  {
    question:
      "Сколько времени займет продвижение сайта и когда будут результаты?",
    answer:
      "Так как вручную проверять каждый день позиции нерационально, то для мониторинга позиций по Яндексу используется сервис Яндекс.XML — это сервис, позволяющий совершать автоматические поисковые запросы к Яндексу, обычно им пользуются крупные SEO компании...",
  },
  {
    question: "Вопрос повторяется еще раз?",
    answer: "Так как вручную проверять каждый день позиции нерационально...",
  },
  {
    question: "И снова тот же вопрос?",
    answer: "Да, просто как пример. Можно заменить.",
  },
  {
    question: "Финальный дубль вопроса?",
    answer: "Точно такой же ответ, чтобы показать аккордеон.",
  },
];

export const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Layout>
      <div className="page__inner acc-page" style={{ background: "#f4f4f4" }}>
        <PageTtile title={"Вопрос-Ответ"} className={"reports__title"} />
        <div className="faq__content">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isActive={activeIndex === index}
              onClick={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};
