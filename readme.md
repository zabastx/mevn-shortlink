# MEVN Shortlink

Сокращение ссылок с использованием MongoDB, Express, Vue, Node

## Установка

Для установки требуется [NodeJS](https://nodejs.org/) v14+ и [@vue/cli](https://cli.vuejs.org/)

### Установка зависимостей для серверной и клиентской части
```sh
npm run full:install
```

### Компиляция typescript серверной части
```sh
npm run tsc
```

### Сборка клиентской части в client/dist
```sh
npm run client
```

### Запуск собранного приложения
```sh
npm run start
```

## Переменные среды

| process.env.* | Описание |
| ------ | ------ |
| MONGOURI | MongoDB connection string |
| PORT | порт express сервера |
| JWTS | секретное слово для jsonwebtoken |
| BOT_API | API ключ для telegram бота |
| MYTGID | ID пользователя telegram для получения обратной связи |
| NODE_ENV | режим работы (development/production) |
| BASE_URL | Базовый URL короткой ссылки |
