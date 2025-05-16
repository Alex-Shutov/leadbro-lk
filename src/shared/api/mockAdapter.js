import MockAdapter from "axios-mock-adapter";
import apiClient from "./client";

const mock = new MockAdapter(apiClient, { delayResponse: 1000 });

mock.onGet("/metrics").reply(200, {
  requests: {
    total: 1958,
    percentage: 80,
    trend: "up",
  },
  goals: {
    total: 356,
    percentage: 55,
    trend: "up",
  },
  positions: {
    total: 785,
    percentage: 40,
    trend: "down",
  },
});

mock.onGet("/charts/search").reply(200, {
  labels: [
    "12.12",
    "19.12",
    "26.12",
    "02.01",
    "09.01",
    "16.01",
    "23.01",
    "30.01",
  ],
  data: [500, 600, 550, 450, 620, 500, 600, 550],
});

mock.onGet("/charts/rejections").reply(200, {
  labels: [
    "12.12",
    "19.12",
    "26.12",
    "02.01",
    "09.01",
    "16.01",
    "23.01",
    "30.01",
  ],
  data: [300, 320, 270, 230, 280, 300, 320, 270],
});

mock.onGet("/requests/latest").reply(200, [
  {
    id: 1,
    query: "SMM агенство",
    city: "Москва",
    searchEngine: "Яндекс",
    positions: [
      { date: "25.01", value: 3, trend: "up", status: "good" },
      { date: "26.01", value: 7, trend: "up", status: "average" },
      { date: "27.01", value: 4, trend: "up", status: "good" },
    ],
  },
  {
    id: 2,
    query: "SMM москва лучшее агенство",
    city: "Москва",
    searchEngine: "Яндекс",
    positions: [
      { date: "25.01", value: 8, trend: "down", status: "bad" },
      { date: "26.01", value: 11, trend: "down", status: "bad" },
      { date: "27.01", value: 5, trend: "up", status: "good" },
    ],
  },
  {
    id: 3,
    query: "Контекстная реклама",
    city: "Санкт-Петербург",
    searchEngine: "Google",
    positions: [
      { date: "25.01", value: 9, trend: "neutral", status: "average" },
      { date: "26.01", value: 9, trend: "neutral", status: "average" },
      { date: "27.01", value: 9, trend: "neutral", status: "average" },
    ],
  },
]);

mock.onPost("/auth/login").reply((config) => {
  const { phone } = JSON.parse(config.data);

  if (phone === "+7 999-999-99-99") {
    return [200, { success: true, message: "SMS код отправлен" }];
  }

  return [400, { success: false, message: "Неверный номер телефона" }];
});

mock.onPost("/auth/verify").reply((config) => {
  const { code } = JSON.parse(config.data);

  if (code === "1234") {
    return [
      200,
      {
        success: true,
        token: "mock-auth-token",
        user: {
          id: 1,
          name: "Vladislav Kondratov",
          email: "username@email.com",
          avatar: "/img/content/avatar.jpg",
        },
      },
    ];
  }

  return [400, { success: false, message: "Неверный код" }];
});

mock.onGet("/auth/me").reply((config) => {
  return [
    200,
    {
      id: 1,
      name: "Vladislav Kondratov",
      email: "username@email.com",
      avatar: "/img/content/avatar.jpg",
    },
  ];
});

mock.onGet("/company/info").reply(200, {
  company: {
    id: 1,
    name: "ООО Компания",
    website: "yoursite.ru",
    created_at: "2023-01-15",
    subscription_plan: "premium",
  },
  manager: {
    id: 101,
    name: "Алексей Иванов",
    role: "Ведущий менеджер",
    avatar: "/img/content/avatar-2.jpg",
    phone: "+7 (999) 123-45-67",
    email: "manager@leadbro.ru",
  },
  services: [
    {
      id: 1,
      type: "seo",
      name: "SEO",
      status: "active",
    },
    {
      id: 2,
      type: "contextual",
      name: "Контекстная реклама",
      status: "active",
      styles: {
        icon: {
          viewBox: "0 0 24 24",
          size: 20,
        },
      },
    },
    {
      id: 3,
      type: "development",
      name: "Разработка",
      status: "active",
      styles: {
        icon: {
          viewBox: "0 0 24 24",
          size: 20,
        },
      },
    },
  ],
});

mock.onPut("/company/update").reply((config) => {
  const data = JSON.parse(config.data);

  return [
    200,
    {
      company: {
        ...data,
        updated_at: new Date().toISOString(),
      },
    },
  ];
});

export default mock;

const mockTasks = [
  {
    id: 1,
    title: "lead-bro.ru Дизайн сайта + верстка",
    description:
      "В рамках этой задачи необходимо подкорректировать некоторые страницы и заголовки.",
    tag: { text: "Дизайн", type: "green" },
    status: "planned",
    users: [
      { id: 1, image: "img/custom/customer-2.png" },
      { id: 2, image: "img/custom/customer-3.png" },
      { id: 3, image: "img/custom/customer-3.png" },
    ],
    createdAt: "12.12.2023",
    tasks: [
      "1. Сводная кейсов (нужно изменить согласно последним предложениям) +",
      "2. Посадочная страница кейса по разработке сайта. Необходимо убрать зависимость картинки на странице услуги от первой картинке в кейсе, так мы сможем более гибко заполнять кейс. +",
      "3. Поменять заголовки на всем сайте, сейчас на всех блоках заголовок h1 +",
      "4. Добавить на страницу о компании стандарты работы. (Евгения подготовит материал и приложит к задаче, дедлайн для подготовки 30.11) +",
      '5. Изменить блок "наши клиенты" обсуждали идеи в телеграмм чате +',
      "6. Заверстать новые страницы: \nПродвижение сайта за позиции \nПродвижение молодых сайтов",
      "7. Упорядочить статьи в блоге по дате добавления +",
      "8. Упорядочить кейсы +",
      "9. Скорректировать вывод кейса по разработке",
    ],
    additionalInfo:
      "Контент для блока собран в связанной задаче последним комментом. Если будет возникать проблема с размещением 100% инф то можно по согласованию с Максимом что нибудь убрать",
    team: [
      {
        id: 1,
        name: "Илья Сорокин",
        position: "Дизайнер",
        image: "img/custom/customer-3.png",
      },
      {
        id: 2,
        name: "Анна Смирнова",
        position: "Дизайнер",
        image: "img/custom/customer-3.png",
      },
      {
        id: 3,
        name: "Дмитрий Петров",
        position: "Дизайнер",
        image: "img/custom/customer-3.png",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Илья Сорокин",
        text: "Начал работу над задачей",
        date: "13.12.2023",
      },
    ],
  },
  {
    id: 2,
    title: "Задача по проекту",
    description: "Необходимо разработать новый дизайн и верстку для сайта",
    tag: { text: "Дизайн", type: "green" },
    status: "planned",
    users: [
      { id: 3, image: "img/custom/customer-2.png" },
      { id: 4, image: "img/custom/customer-3.png" },
    ],
    createdAt: "10.12.2023",
    tasks: [
      "1. Разработать макет в Figma",
      "2. Согласовать с клиентом",
      "3. Внести правки по комментариям",
    ],
    additionalInfo: "Референсы находятся в общей папке проекта",
    team: [
      {
        id: 3,
        name: "Анна Смирнова",
        position: "Дизайнер",
        image: "img/custom/customer-2.png",
      },
      {
        id: 4,
        name: "Дмитрий Петров",
        position: "Арт-директор",
        image: "img/custom/customer-3.png",
      },
    ],
    comments: [],
  },
  {
    id: 3,
    title: "Задача по проекту",
    description: "Необходимо выполнить SEO-оптимизацию сайта",
    tag: { text: "SEO", type: "red" },
    status: "planned",
    users: [
      { id: 5, image: "img/custom/customer-2.png" },
      { id: 6, image: "img/custom/customer-3.png" },
      { id: 7, image: "img/custom/customer-3.png" },
    ],
    createdAt: "09.12.2023",
    tasks: [
      "1. Анализ конкурентов",
      "2. Подбор ключевых слов",
      "3. Оптимизация мета-тегов",
    ],
    additionalInfo: "Учесть новые требования поисковых систем",
    team: [
      {
        id: 5,
        name: "Егор Соколов",
        position: "SEO-специалист",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
  {
    id: 4,
    title: "Задача по проекту",
    description: "Необходимо отредактировать тексты для всех разделов сайта",
    tag: { text: "Редактор", type: "purple" },
    status: "planned",
    users: [
      { id: 8, image: "img/custom/customer-2.png" },
      { id: 9, image: "img/custom/customer-3.png" },
    ],
    createdAt: "08.12.2023",
    tasks: [
      "1. Редактирование текстов главной страницы",
      "2. Редактирование текстов раздела услуг",
      "3. Редактирование текстов блога",
    ],
    additionalInfo: "Учесть пожелания клиента по стилистике",
    team: [
      {
        id: 8,
        name: "Мария Иванова",
        position: "Редактор",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
  {
    id: 5,
    title: "Задача по проекту",
    description: "Необходимо разработать дизайн мобильной версии сайта",
    tag: { text: "Дизайн", type: "green" },
    status: "completed",
    users: [
      { id: 10, image: "img/custom/customer-2.png" },
      { id: 11, image: "img/custom/customer-3.png" },
    ],
    createdAt: "05.12.2023",
    tasks: [
      "1. Разработать дизайн главной страницы",
      "2. Разработать дизайн внутренних страниц",
      "3. Согласовать с клиентом",
    ],
    additionalInfo: "Использовать Material Design",
    team: [
      {
        id: 10,
        name: "Александр Петров",
        position: "UI/UX Дизайнер",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
  {
    id: 6,
    title: "Задача по проекту",
    description: "Необходимо разработать SEO-стратегию для нового сайта",
    tag: { text: "SEO", type: "red" },
    status: "in_progress",
    users: [{ id: 12, image: "img/custom/customer-2.png" }],
    createdAt: "03.12.2023",
    tasks: [
      "1. Анализ рынка и конкурентов",
      "2. Разработка SEO-стратегии",
      "3. Составление плана работ",
    ],
    additionalInfo: "Учесть специфику региональности",
    team: [
      {
        id: 12,
        name: "Игорь Иванов",
        position: "SEO-специалист",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
  {
    id: 8,
    title: "Задача по проекту",
    description: "Необходимо разработать SEO-стратегию для нового сайта",
    tag: { text: "SEO", type: "red" },
    status: "completed",
    users: [{ id: 12, image: "img/custom/customer-2.png" }],
    createdAt: "03.12.2023",
    tasks: [
      "1. Анализ рынка и конкурентов",
      "2. Разработка SEO-стратегии",
      "3. Составление плана работ",
    ],
    additionalInfo: "Учесть специфику региональности",
    team: [
      {
        id: 12,
        name: "Игорь Иванов",
        position: "SEO-специалист",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
  {
    id: 7,
    title: "Задача по проекту",
    description: "Необходимо подготовить отчет по проделанной работе",
    tag: { text: "Редактор", type: "purple" },
    status: "completed",
    users: [
      { id: 13, image: "img/custom/customer-2.png" },
      { id: 14, image: "img/custom/customer-3.png" },
    ],
    createdAt: "01.12.2023",
    tasks: [
      "1. Сбор данных по проекту",
      "2. Анализ выполненных работ",
      "3. Подготовка отчета",
    ],
    additionalInfo: "Использовать корпоративный шаблон",
    team: [
      {
        id: 13,
        name: "Елена Смирнова",
        position: "Руководитель проекта",
        image: "img/custom/customer-2.png",
      },
    ],
    comments: [],
  },
];

const taskCategories = [
  "SEO",
  "Разработка",
  "Отдел контента",
  "Дизайн",
  "Отдел тестирования",
  "Отдел аналитики",
  "Редактор",
];

const months = [
  "Выбрать месяц",
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

mock.onGet(/\/tasks(\?.*)?/).reply((config) => {
  const url = new URL(`http://example.com${config.url}`);
  const categoryParam = url.searchParams.get("category");
  const monthParam = url.searchParams.get("month");

  let filteredTasks = [...mockTasks];

  if (categoryParam) {
    filteredTasks = filteredTasks.filter(
      (task) => task.tag.text === categoryParam,
    );
  }

  if (monthParam && monthParam !== "Выбрать месяц") {
    if (monthParam === "Январь") {
      filteredTasks = filteredTasks.filter(
        (task) => parseInt(task.id) % 3 === 0,
      );
    } else if (monthParam === "Февраль") {
      filteredTasks = filteredTasks.filter(
        (task) => parseInt(task.id) % 2 === 0,
      );
    } else if (monthParam === "Март") {
      filteredTasks = filteredTasks.filter(
        (task) => parseInt(task.id) % 2 === 1,
      );
    }
  }

  return [200, filteredTasks];
});
mock.onGet(/\/tasks\/\d+/).reply((config) => {
  const taskId = parseInt(config.url.split("/").pop(), 10);
  const task = mockTasks.find((task) => task.id === taskId);

  if (task) {
    return [200, task];
  }

  return [404, { message: "Задача не найдена" }];
});
mock.onPost(/\/tasks\/\d+\/comments/).reply((config) => {
  const taskId = parseInt(config.url.split("/")[2], 10);
  const taskIndex = mockTasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return [404, { message: "Задача не найдена" }];
  }

  try {
    const commentData = JSON.parse(config.data);

    if (!commentData.text) {
      return [400, { message: "Текст комментария не может быть пустым" }];
    }

    const newComment = {
      id: mockTasks[taskIndex].comments.length + 1,
      author: "Текущий пользователь",
      text: commentData.text,
      date: new Date().toLocaleDateString("ru-RU"),
    };

    mockTasks[taskIndex].comments.push(newComment);

    return [201, newComment];
  } catch (error) {
    return [400, { message: "Некорректные данные комментария" }];
  }
});

const statisticsMocks = {
  visits: {
    data: {
      value: 1485,
      change: 37.8,
      comparedTo: "13.12.2023",
      series: [
        {
          name: "Monthly",
          data: [500, 600, 550, 450, 620, 500, 600, 550],
        },
      ],
      categories: [
        "12.12",
        "13.12",
        "14.12",
        "15.12",
        "16.12",
        "17.12",
        "18.12",
        "19.12",
      ],
    },
  },

  rejections: {
    data: {
      value: 24.98,
      change: 37.8,
      comparedTo: "13.12.2023",
      series: [
        {
          name: "Monthly",
          data: [500, 600, 550, 450, 620, 500, 600, 550],
        },
      ],
      categories: [
        "12.12",
        "13.12",
        "14.12",
        "15.12",
        "16.12",
        "17.12",
        "18.12",
        "19.12",
      ],
    },
  },

  goals: {
    data: {
      value: 24.98,
      change: -37.8,
      comparedTo: "13.12.2023",
      series: [
        {
          name: "Monthly",
          data: [500, 600, 550, 450, 620, 500, 600, 550],
        },
      ],
      categories: [
        "12.12",
        "13.12",
        "14.12",
        "15.12",
        "16.12",
        "17.12",
        "18.12",
        "19.12",
      ],
      conversions: [
        { id: 1, name: "Все конверсии" },
        { id: 2, name: "Звонки" },
        { id: 3, name: "Заявки" },
        { id: 4, name: "Чаты" },
      ],
    },
  },

  positions: {
    data: {
      series: [
        {
          name: "Monthly",
          data: [500, 600, 550, 450, 620, 500, 600, 550],
        },
        {
          name: "Weekly",
          data: [300, 320, 270, 230, 280, 300, 320, 270],
        },
        {
          name: "Daily",
          data: [100, 80, 140, 100, 180, 100, 80, 140],
        },
      ],
      categories: [
        "12.12",
        "13.12",
        "14.12",
        "15.12",
        "16.12",
        "17.12",
        "18.12",
        "19.12",
      ],
      stats: [
        { title: "Топ 1-3", count: 7, percentage: 1, color: "gray" },
        { title: "Топ 1-10", count: 302, percentage: 36, color: "orange" },
        { title: "Топ 1-30", count: 561, percentage: 67, color: "purple" },
        { title: "Топ 1-50", count: 586, percentage: 70, color: "green" },
        { title: "Все запросы", count: 840, percentage: 100, color: "default" },
        { title: "WS10", count: 7, percentage: 1, color: "yellow" },
        { title: "PTraf", count: 7, percentage: 1, color: "blue" },
      ],
    },
  },

  keywords: {
    data: {
      keywords: [
        {
          id: 1,
          keyword: "влагостойкие стеновые панели цена",
          city: "Екатеринбург",
          searchEngine: "Y",
          change: { value: 97, positive: true },
          positions: [
            { date: "18.12", value: 3, highlight: "green" },
            { date: "17.12", value: 4, highlight: "yellow" },
            { date: "16.12", value: 3 },
            { date: "15.12", value: 3 },
            { date: "14.12", value: 3 },
          ],
        },
        {
          id: 2,
          keyword: "влагостойкие стеновые панели цена",
          city: "Екатеринбург",
          searchEngine: "Y",
          change: { value: 97, positive: true },
          positions: [
            { date: "18.12", value: 3 },
            { date: "17.12", value: 4 },
            { date: "16.12", value: 3 },
            { date: "15.12", value: 3 },
            { date: "14.12", value: 3 },
          ],
        },
        {
          id: 3,
          keyword: "влагостойкие стеновые панели цена",
          city: "Екатеринбург",
          searchEngine: "Y",
          change: { value: 97, positive: false },
          positions: [
            { date: "18.12", value: 3 },
            { date: "17.12", value: 4 },
            { date: "16.12", value: 3 },
            { date: "15.12", value: 3 },
            { date: "14.12", value: 3 },
          ],
        },
      ],
      cities: ["Екатеринбург", "Москва", "Пермь", "Тверь"],
      groups: ["Группа 1", "Группа 2", "Группа 3", "Группа 4"],
    },
  },
};

const docsMocks = [
  {
    id: 0,
    type: "Акт",
    date: "12.12.2023",
    number: "123123",
    sum: "44 000, 00 ₽",
    status: "Оплачено",
    className: "_green",
  },
  {
    id: 1,
    type: "Документ",
    date: "12.12.2023",
    number: "123123",
    sum: "44 000, 00 ₽",
    status: "Оплачено",
    className: "_green",
  },
  {
    id: 2,
    type: "Отчет",
    date: "12.12.2023",
    number: "123123",
    sum: "44 000, 00 ₽",
    status: "Оплачено",
    className: "_green",
  },
  {
    id: 3,
    type: "Акт",
    date: "12.12.2023",
    number: "123123",
    sum: "44 000, 00 ₽",
    status: "Не оплачено",
    className: "_red",
  },
];

// Statistics endpoints
mock.onGet(/\/statistics\/visits/).reply(200, statisticsMocks.visits);
mock.onGet(/\/statistics\/rejections/).reply(200, statisticsMocks.rejections);
mock.onGet(/\/statistics\/goals/).reply(200, statisticsMocks.goals);
mock.onGet(/\/statistics\/positions/).reply(200, statisticsMocks.positions);
mock.onGet(/\/statistics\/keywords/).reply(200, statisticsMocks.keywords);

mock.onGet("/task-categories").reply(200, taskCategories);

mock.onGet("/task-months").reply(200, months);

mock.onGet("/docs").reply(200, docsMocks);
