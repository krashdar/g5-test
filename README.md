# G5Test

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.14.

## Задание

Необходимо реализовать 3-х страничный проект, который будет в себя включать реализацию связи с GitHub Api ( арі.github.com ). Верстку страниц рекоендуется выполнять с помощью Bootstrap
1. Страница ‘blocks’.
Необходимо создать страницу, на которой будет находиться строка поиска и кнопка ‘Search’. После введения значения для поиска и нажатия на кнопку, необходимо сделать соответсвующий запрос на GitHub Api и вывести первые 20 результатов в блочном списке ниже строки поиска.
2. Страница ‘table’.
Необходимо создать страницу с такой же реализацией поиска, но для списка выведения данных использовать табличную разметку.
3. Страница ‘detail’.
Необходимо создать страницу с детальной информацией пользователя. Переход на страницу должен осуществляться по клику на пользователя в списках результатов поиска на страницах ‘blocks’ и ‘table’. На странице должны выводиться такие данные: аватар, логин, тип пользователя, ссылка на профиль.
4. Навигация по проекту.
Реализовать навигацию вверху страниц и добавить ссылки на страницы ‘blocks’ и ‘table’.

## Дополнительное задание
1. Реализация авторизации.
Необходимо реализовать страницу авторизации пользователя с помощью Firebase(https://firebase.google.com/). Реализовать авторизацию по email и по GitHub пользователя. Если пользователь не авторизирован, у него не должно быть доступа к другим страницам проекта. Если пользователь авторизирован у него в блоке навигации должны отображаться следующие данные: логин, аватар, выпадающий список с функцией ‘Logout’.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
