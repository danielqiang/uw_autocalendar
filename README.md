# UW AutoCalendar

**UW AutoCalendar** is a Chrome add-on that offers one-click course schedule integration with Google Calendar (referencing Canvas/Gradescope websites). The service will help students automatically keep their Google Calendars up to date with class schedules and deadlines (assignments, lectures/sections, exams, zoom links, etc.). Our target audience will be students currently enrolled at UW.

## Repo Layout

Our main source code will be in the [src](src/) directory. The [extension](extension/) directory is an unpacked Chrome addon that can be loaded directly as an extension.  

## Setup Instructions

Install [NodeJS](https://nodejs.org/en/), then install [TypeScript](https://www.typescriptlang.org/):

```
npm install -g typescript
```

Install dependencies:

```
npm install @types/chrome --save-dev
```

Generate the JavaScript source files (from the project root directory):

```
tsc
```

Done! The [extension](extension/) directory can now be loaded into Chrome.
