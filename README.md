[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

`Github` — https://github.com/keeonezy/express-mesto-gha


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  

## Запуск проекта

`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload

## Для единой структуры кода

`npx eslint . --fix` — приводит в порядок структуру проект

## API проекта

Регистрация пользователя: POST /signup  
Логин пользователя: POST /signin  
Получить всех пользователей: GET /users  
Получить данные текущего пользователя: GET /users/me  
Получить данные пользователя по id: GET /users/userID  
Обновить данные текущего пользователя: PATCH /users/me  
Обновить аватара текущего пользователя: PATCH /users/me/avatar  
Добавление карточки: POST /cards  
Получение всех карточек: GET /cards  
Удаление карточки: DELETE /cards/cardID  
Поставить лайк карточке: PUT /cards/cardID/likes  
Удалить лайк у карточки: DELETE /cards/cardID/likes  
