import React, { useCallback, useEffect, useRef } from "react";
import { Layout } from "../../../shared/ui/layout";
import PageTtile from "../../../widgets/common/ui/PageTtile";
import PageTable from "../../../widgets/common/ui/PageTable";
import DocumentsCategories from "./DocumentsCategories";
import { useDocumentsStore } from "../state/documents.store";
import { SwipeContainer } from "../../../widgets/swipe/ui/SwipeContainer";
import "../../../widgets/swipe/ui/swipe.css";
import TasksColumns from "../../tasks/ui/TasksColumns";
import PageTableItem from "../../../widgets/common/ui/PageTableItem";

export const DocumentsPage = () => {
  const {
    docTypes,
    selectedDocType,
    setSelectedDocType,
    getDocTypes,
    fetchDocuments,
    isLoading,
    documents,
  } = useDocumentsStore();
  const categoriesContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        getDocTypes();
        fetchDocuments();
      }
    };

    loadData();
  }, [getDocTypes]);

  const handleDocTypeClick = useCallback(
    (key, index) => {
      const newCategory = selectedDocType === key ? null : key;
      if (!categoriesContainerRef.current) return;

      const container = categoriesContainerRef.current;
      const items = container.querySelectorAll(".swiper-slide");

      if (items[index]) {
        container.scrollTo({
          left: items[index].offsetLeft,
          behavior: "smooth",
        });
      }

      setSelectedDocType(newCategory);
      // fetchTasks();
    },
    [setSelectedDocType, selectedDocType],
  );

  const itemForDocMapping = {
    date: "Дата",
    sum: "Сумма",
    status: "Статус оплаты",
    number: "Номер",
  };

  const itemsForDocTable = documents.map((el) => {
    return Object.entries(el).map(([key, value]) =>
      key === "type" || itemForDocMapping[key]
        ? { value, label: itemForDocMapping[key], className: el.className }
        : null,
    );
  });
  console.log(itemsForDocTable, "items", documents);
  return (
    <Layout>
      <div className="page__inner reports-page">
        <PageTtile className={"reports__title"} title={"Документы"} />
        <div className={"shop__control"}>
          <div className={"shop__nav shop__nav-links"}>
            <div
              ref={categoriesContainerRef}
              className="shop-links__wrap"
              style={{
                overflowX: "auto",
                display: "flex",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              <DocumentsCategories
                availableDocTypes={docTypes}
                selectedDocType={selectedDocType}
                setSelectedDocType={handleDocTypeClick}
              />
            </div>
          </div>
        </div>
        <div className="tasks__wrap">
          {isLoading ? (
            <div className="loading-placeholder">Загрузка документов...</div>
          ) : documents.length === 0 ? (
            <div className="empty-placeholder">Документы не найдены</div>
          ) : (
            <div>
              <PageTable>
                {itemsForDocTable.map((items) => (
                  <PageTableItem
                    items={items}
                    columnClassName={"reports__item-column"}
                    itemClassName={"reports__item"}
                  />
                ))}
              </PageTable>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
