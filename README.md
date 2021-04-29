# UW AutoCalendar

**UW AutoCalendar** is a Chrome add-on that offers one-click course schedule integration with Google Calendar (referencing Canvas/Gradescope websites). The service will help students automatically keep their Google Calendars up to date with class schedules and deadlines (assignments, lectures/sections, exams, zoom links, etc.). Our target audience will be students currently enrolled at UW.

## Repo Layout

Our main source code will be in the [src](src/) directory. The [extension](extension/) directory is an unpacked Chrome addon that can be loaded directly as an extension.  

## Setup Instructions

Install [NodeJS](https://nodejs.org/en/), then install [TypeScript](https://www.typescriptlang.org/):

```
sudo npm install -g typescript
```

Install build dependencies:

```
npm install @types/chrome --save-dev
```

Install Jest dependencies:

```
npm install jest @types/jest ts-jest --save-dev
```

To generate source files (from the project root directory):

```
npm run build
```

To run tests (via Jest):

```
npm run test
```

After building JS source files, the [extension](extension/) directory can be directly loaded into Chrome.

## TODO

* Fix module import issues; e.g. importing from `session.js` in `src/google_calendar.ts` 
  fails within Jest, but importing from `session` fails within the Chrome extension.