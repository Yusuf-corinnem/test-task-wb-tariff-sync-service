## Описание проекта

Сервис для регулярной загрузки тарифов WB (endpoint `https://common-api.wildberries.ru/api/v1/tariffs/box`), накопления их в PostgreSQL (по дням) и экспорта актуальных данных в N Google-таблиц. Экспорт ведётся по регионам (по одному Spreadsheet на регион), поддерживаются 4 листа:
- `stocks_coefs`: коэффициенты (сортировка по возрастанию общего коэффициента)
- `stocks_delivery`: параметры доставки (включая коэффициенты)
- `stocks_storage`: параметры хранения
- `stocks_meta`: метаданные (date, dtTillMax, lastUpdatedAt; dtNextBox добавлен в схему и будет выводиться при наличии)

Приложение запускается в Docker, миграции применяются автоматически, сиды включаем/выключаем через `.env`.

## Технологии

- Node.js 20, TypeScript
- Express (HTTP API)
- PostgreSQL + Knex (миграции/репозитории)
- Docker / Docker Compose
- node-cron (расписание)
- googleapis (Google Sheets API)
- axios (HTTP к WB API, таймауты/ретраи)
- winston (структурированные логи, ротация)
- zod (валидация env)
- Архитектура: разделение `domain` / `infrastructure` / `http` / `config` / `shared`

## Инструкция к запуску

1) Подготовьте `.env` (см. `example.env`). Важно:
- БД: `POSTGRES_*` — оставьте значения postgres/postgres/postgres
- Приложение: `APP_PORT` (порт HTTP), `LOG_LEVEL` (info|warning|error)
- WB: `WB_API_KEY` (ключ), `WB_TIMEOUT` (мс таймаута запроса), `WB_RETRY_ATTEMPTS` (число повторов при 429/5xx/таймауте)
- Google:
  - `GOOGLE_CLIENT_EMAIL` — email сервис‑аккаунта
  - `GOOGLE_PRIVATE_KEY` с `\n` вместо переводов строк ИЛИ `GOOGLE_PRIVATE_KEY_BASE64` (base64 от всего PEM)
- Крон:
  - `CRON_ENABLED=true`
  - `CRON_SCHEDULE=0 * * * *` (каждый час) или, например, `0,30 * * * * *` (каждые 30 секунд)
- Сиды:
  - `SEEDS_ENABLED=true` — для быстрой проверки заполнят тестовые записи в таблицы БД (в т.ч. `spreadsheets`)

2) Запуск:
```bash
docker compose up --build
```

Для повторной чистой проверки:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

3) Добавьте Google‑таблицы (если сиды выключены):
- Создайте Spreadsheet в Google Sheets и листы: `stocks_coefs`, `stocks_delivery`, `stocks_storage`, `stocks_meta`
- Дайте доступ сервис‑аккаунту (`GOOGLE_CLIENT_EMAIL`) как Редактор
- Добавьте запись:
```http
POST /api/spreadsheets
{
  "spreadsheetId": "<ID из URL>",
  "regionFilter": "Центральный федеральный округ",
  "description": "WB — Центральный ФО",
  "isActive": true
}
```

4) Ручной экспорт (по желанию):
```http
POST /api/tariffs/export
{
  "date": "YYYY-MM-DD"
}
```

## Маршруты и работа приложения

- `GET /` — корневая информация и список основных endpoint’ов
- `GET /api/health` — healthcheck
- `GET /api/tariffs/dates` — доступные даты (по метаданным)
- `GET /api/tariffs/:date` — тарифы за дату
- `POST /api/tariffs/sync` — принудительное обновление тарифов из WB за сегодня
- `POST /api/tariffs/export` — выгрузка в Google Sheets (дата опциональна, берётся сегодня)
- `GET /api/spreadsheets` — список зарегистрированных таблиц
- `POST /api/spreadsheets` — добавить Spreadsheet (id/регион/описание/активность)
- `PUT /api/spreadsheets/:id` — изменить Spreadsheet

Крон (`CRON_ENABLED=true`) ежечасно: 1) обновляет тарифы на текущую дату, 2) экспортирует актуальные данные во все активные таблицы.

## Логирование

- Папка: `src/logs` (смонтирована в контейнер через bind‑mount, записи сохраняются на хосте).
- Файлы и ротация (winston + daily‑rotate‑file):
  - `combined-YYYY-MM-DD.log` — все инфо‑логи и выше
  - `error-YYYY-MM-DD.log` — только ошибки
  - Сжатие архивов: включено (`zippedArchive: true`)
  - Максимальный размер файла: `20m`
  - Хранение: `14d` (последние 14 дней)
- Формат: JSON со штампом времени и полями `context`, `metadata`, для ошибок — блок `errorInfo` (reason/location/stack).
- Дополнительно логи дублируются в консоль контейнера.

## Примечания по проверке (SEEDS_ENABLED)

- Если `SEEDS_ENABLED=true`, при старте будут добавлены тестовые данные и примеры таблиц (можно сразу вызывать `POST /api/tariffs/export`).
- Если `SEEDS_ENABLED=false`, сиды не запускаются, таблицы нужно добавить руками через API.

## Автор

Разработал Yusuf-corinnem.
