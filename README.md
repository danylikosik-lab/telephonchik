# Телефончик (Gartic Phone Clone)

Монорепозиторий: `client` (Vite + React + TypeScript + Tailwind) и `server` (Node.js + Express + Socket.io + TypeScript).

## Запуск

Установка зависимостей (один раз):

```bash
cd telefonchik
npm install
cd server && npm install
cd ../client && npm install
```

Запуск dev-серверов:

```bash
cd telefonchik
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/health`

## Что уже готово

- Экран приветствия: ник + цвет аватарки (сохранение в `localStorage`)
- Меню: создать/присоединиться
- Создание комнаты: выбор режима + обязательные «Расширенные настройки»
- Бэкенд: создание/присоединение к комнате, синхронизация состояния лобби

## Дальше по плану

- Сохранение настроек комнаты на сервере при создании (и редактирование в лобби)
- Экран игры и реализация логики 15 режимов (ходы/таймеры/канвас/результаты)
- `Story`: озвучка бота на клиенте через Web Speech API (русский голос, вкл/выкл)

