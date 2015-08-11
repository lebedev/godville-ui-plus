# По-русски (in russian):
## Как собрать дополнение из исходников:

1. Склонировать репозиторий.
2. Установить `nodejs`.
3. Выполнить `npm install` в корне репозитория.
4. Выполнить `grunt debug` в корне репозитория для однократной сборки или `grunt --force` для слежения за изменениями в папке `source` и автосборки.
5. Таким образом, в папке `debug` будет папочка `chrome` (экстеншон для Хрома) и файл `godville-ui-plus@badluck.dicey.xpi` (аддон для ФФ).

## Что куда собирается и где запускается:
* Все файлы из `source/superhero/*.js` собираются в `superhero.js`.
* Все файлы из `source/forum/*.js` собираются в `forum.js`.
* [Загрузчик аддона для ФФ](https://github.com/zeird/godville-ui-plus/blob/master/source/firefox/resources/godville-ui-plus/lib/main.js).
* [Загрузчик экстеншона для Хрома](https://github.com/zeird/godville-ui-plus/blob/master/source/chrome/loader.js).

## Структура репозитория:
    .
    |-help_guide/ (картинки для окошка помощи)
    |-images/ (картинки: фон и лопатка)
    |-release/ (текущие релизные версии аддона и экстеншона)
    |-source/ (весь исходный код)
        |-chrome/ (специфичные для Хрома файлы)
        |-firefox/ (специфичные для ФФ файлы)
        |-superhero/ (файлы, касающиеся страницы героя /superhero)
        |-forum/ (файлы, касающиеся форума /forums/*)
        |-*.js (разные скрипты)
        |-*.css (разные файлы стилей)
    |-* (разные файлы сборки дополнения, номера версии, файла обновления для ФФ и т.п.)
Обычно код редактируется только в `source/*`, `source/superhero/*` и `source/forum/*`.

# In english (по-английски):
## How to build extension from source:

1. Clone the repo.
2. Install `nodejs`.
3. Execute `npm install` in the repo's root folder.
4. Execute `grunt debug` in the repo's root folder to build once or `grunt --force` to watch for changes in `source` folder and rebuild every time.
5. So in the `debug` folder you'll have `chrome` folder (unpacked extension for Chrome) and `godville-ui-plus@badluck.dicey.xpi` file (add-on for Firefox).

## Where and what builds and executes:
* All files from `source/superhero/*.js` compile to `superhero.js`.
* All files from `source/forum/*.js` compile to `forum.js`.
* [Loader of add-on for Firefox](https://github.com/zeird/godville-ui-plus/blob/master/source/firefox/resources/godville-ui-plus/lib/main.js).
* [Loader of extension for Chrome](https://github.com/zeird/godville-ui-plus/blob/master/source/chrome/loader.js).

## Repository tree structure:
    .
    |-help_guide/ (images for help dialog)
    |-images/ (images: default background and shovel)
    |-release/ (current release versions of add-on and extension)
    |-source/ (all the source code)
        |-chrome/ (Chrome extension specific files)
        |-firefox/ (Firefox add-on specific files)
        |-superhero/ (files, concerning /superhero page)
        |-forum/ (files, concerning /forums/* pages)
        |-*.js (various scripts)
        |-*.css (various stylesheets)
    |-* (other files of project building, version number, update file for Firefox add-on etc.)
Usually only the code from `source/*`, `source/superhero/*` and `source/forum/*` should be edited.

[![Code Climate](https://codeclimate.com/github/zeird/godville-ui-plus/badges/gpa.svg)](https://codeclimate.com/github/zeird/godville-ui-plus)
