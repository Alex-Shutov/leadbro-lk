import { loadAvatar } from "../../../core/lib/mapper.utils";

export const onMeMapper = ({ data }) => {
  debugger;
  data = data.data;
  return {
    data: {
      company: {
        id: data.id,
      },
      manager: {
        id: data.manager.id,
        name: [
          data.manager.last_name,
          data.manager.name,
          data.manager.middle_name,
        ]
          .filter(Boolean)
          .join(" "),
        email: data.manager.email,
        phone: data.manager.phone,
        avatar: loadAvatar(data.manager.avatar),
      },
      id: data.id,
      managerId: data.manager.id,
      name: [
        data.manager.last_name,
        data.manager.name,
        data.manager.middle_name,
      ]
        .filter(Boolean)
        .join(" "),
      email: data.manager.email,
      avatar: loadAvatar(data.manager.avatar),
      services: data.services.map((el) => ({
        id: el.id,
        type: el.type,
        name: el.name,
        status: el.active ? "active" : "inactive",
      })),
    },
  };
};
