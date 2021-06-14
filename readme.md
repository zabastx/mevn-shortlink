# MEVN Shortlink

**[Готовое приложение](https://zxlink.site)**

## Установка

Для установки требуется [NodeJS](https://nodejs.org/) v14+ и [@vue/cli](https://cli.vuejs.org/)

### Установка зависимостей для серверной и клиентской части
```sh
npm run full:install
```
### Запуск development сервера/клиента
```sh
npm run dev
```

### Сборка статических файлов в client/dist
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