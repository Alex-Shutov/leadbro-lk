import { loadAvatar } from "../../../core/lib/mapper.utils";

export const onCompanyInfoMapper = ({ data }) => {
  // Форматирование менеджера
  const mapData = data.data;
  const formatManager = (manager) => ({
    id: manager.id,
    name: [manager.last_name, manager.name, manager.middle_name]
      .filter(Boolean)
      .join(" "),
    role: manager.position?.name || "Менеджер",
    avatar: loadAvatar(manager.avatar),
    phone: manager.phone || "Не указан",
    email: manager.email || "Не указан",
  });

  // Форматирование услуг
  const formatServices = (services) => {
    if (!services?.last) return [];

    return [
      {
        id: services.last.id,
        type: services.last.type,
        name: services.last.name,
        status: services.last.active ? "active" : "inactive",
      },
      // Можно добавить другие услуги при необходимости
    ];
  };

  return {
    data: {
      company: {
        id: mapData.id,
        name: mapData.name,
        website: mapData.site || "Не указан",
        created_at: "2023-01-15", // Это поле отсутствует в исходных данных
        subscription_plan: "premium", // Это поле отсутствует в исходных данных
      },
      manager: mapData.manager ? formatManager(mapData.manager) : null,
      services: formatServices(mapData.services),
    },
  };
};
