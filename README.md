# Проект "Система управления контактными данными клиентов"

Это приложение позволяет работать с контактной информацией клиентов.

![the list of clients](https://github.com/laaleksandrova/contacts-client-app/blob/master/system_images/image_1.png){ width=39% }


## Функции

* Просмотр списка клиентов в виде таблицы
* Добавление нового клиента
* Изменение информации о существующем клиенте (ФИО и контактная информация)
* Удаление информации о существующем клиенте
* Сортировка всех колонок таблицы, кроме контактов и действий
* Поиск данных в таблице


Каждый клиент имеет следующие данные:

* Имя
* Фамилия
* Отчество
* Массив объектов с контактными данными, где каждый объект содержит:
  * Тип контакта (телефон, email, VK и т.п.)
  * Значение контакта (номер телефона, адрес email, ссылка на страницу в VK и т.п.)

Интерфейс состоит из единственной страницы, на которой расположена таблица клиентов, кнопка для добавления нового клиента, а также шапка с логотипом компании и строкой поиска клиентов.

## Установка

Следуйте этим шагам:

- Клонируйте репозиторий с помощью команды `git clone <адрес репозитория>`.
- Откройте отдельно папку backend, в ней находится README.md по запуску сервера.
- Откройте отдельно папку frontend.
- Откройте файл index.html в браузере.

## Использование

* Таблица строится на основе данных из API.
* Все заголовки колонок, кроме контактов и действий, можно нажать, чтобы установить сортировку по соответствующему полю.
* При вводе текста в поле для поиска данные для таблицы перезапрашиваются из API с введенным поисковым запросом.
* Контакты клиента отображаются при наведении указателя на контакт, всплывающая подсказка с типом и значением этого контакта в формате "Тип: значение".
* При нажатии на кнопку "Изменить" появляется модальное окно с формой изменения клиента.
* При нажатии на кнопку "Удалить" появляется модальное окно с подтверждением действия. Если удаление подтверждается, то клиент удаляется. Модальное окно с формой закрывается. Таблица отрисовывается заново.
* Форма создания клиента открывается в виде модального окна по нажатию на кнопку "Добавить клиента", которая находится под таблицей. Форма открывается сразу с незаполненными полями.
* Форма редактирования клиента открывается в виде модального окна по нажатию на кнопку "Изменить", которая находится в таблице клиентов. Форма заполнена соответствующими данными клиента.
* В блоке контактов есть возможность добавить до 10 контактов. Для добавления контакта имеется кнопка "Добавить контакт". Каждый контакт можно удалить из списка по нажатию на крестик справа от него.
* По нажатию на кнопку сохранения изменения отправляются на сервер с использованием метода создания или изменения существующего клиента. Модальное окно с формой закрывается. Таблица отрисовывается заново.
* По нажатию на кнопку с крестиком, кнопку отмены или фон модального окна модальное окно закрывается.

## Технологии и инструменты

* Дополнительно использовались универсальный плагин всплывающих подсказок Tippy.js и библиотека Choices.js для создания кастомизируемого выпадающего списка.
