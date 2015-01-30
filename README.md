[![Code Climate](https://codeclimate.com/github/zeird/godville-ui-plus/badges/gpa.svg)](https://codeclimate.com/github/zeird/godville-ui-plus)

# Как собрать дополнение из сорцов:

1. Склонировать репозиторий.
2. Установить `nodejs`.
3. Выполнить `npm install` в корне репозитория.
4. Выполнить `grunt debug` в корне репозитория для однократной сборки или `grunt --force` для слежения за изменениями в папке `source` и автосборке.
5. Таким образом, в папке `debug` будет папочка `chrome` (экстеншон для Хрома) и файл `godville-ui-plus@badluck.dicey.xpi` (аддон для ФФ).

# Hot to build extension from source:

1. Clone the repo.
2. Install `nodejs`.
3. Execute `npm install` in the repo's root folder.
4. Execute `grunt debug` in the repo's root folder to build once or `grunt --force` to watch for changes in `source` folder and rebuild every time.
5. So in the `debug` folder you'll have `chrome` folder (unpacked extension for Chrome) and `godville-ui-plus@badluck.dicey.xpi` file (add-on for Firefox).
