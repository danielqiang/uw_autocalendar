# UW AutoCalendar

**UW AutoCalendar** is a Chrome add-on that offers one-click course schedule integration between Canvas and Google Calendar. It can be downloaded directly from the Chrome Web Store.

## Using the Extension

### Installation

Download UW AutoCalendar from the [Chrome Webstore](https://chrome.google.com/webstore/detail/uw-autocalendar/ledaenehpknpfpodpbaoagjifopbgffn?hl=en&authuser=5).

**Note:** UW AutoCalendar has been submitted for review to the Chrome Webstore but has not yet been published. Refer to the developer guide below for manual installation/build instructions.

### Usage

1. Open UW AutoCalendar from the extensions menu at the top right of your browser. For first time users: click “start account authentication” to link your google account with the extension. 
2. Select the services you wish to sync from and click “Sync to Calendar”. You may be redirected to a login page if user login is necessary.

Done! Syncs are usually quick but may take up to two minutes depending on internet speed and how many Canvas calendar events you have. 

**Note:** The Gradescope sync feature is under development and is currently inactive.

### Bug Reporting

Report any bugs through the issues tab on this repository. 

For bug reports include the following information:
* Extension version
* Clear description of observed behavior and expected behavior
* Steps to reproduce the bug (include OS/Chrome version information)

All current bugs are listed in the issues tab and will be resolved as they are fixed.

## Developer Usage

### Architecture Overview

![403_architecture_image](https://github.com/danielqiang/uw_autocalendar/blob/main/images/403_architecture_image.png)
Currently the project is composed of two major components: Canvas for data sourcing and Google Calendar for event update. Canvas API is triggered by the extension to fetch course information, and then Google Calendar uploads the events to the user calendar. 


### Repo Layout

The project source is in the [src](src/) directory. After building, the [extension](extension/) directory is an unpacked Chrome addon that can be loaded directly as an extension.  

### Build Instructions

**Note:** These instructions have been tested on MacOS/Linux. Try them without `sudo` if running on Windows.

First, clone this repo:

```
git clone https://github.com/danielqiang/uw_autocalendar.git
```

Install [NodeJS](https://nodejs.org/en/), then install [TypeScript](https://www.typescriptlang.org/):

```
sudo npm install -g typescript
```

Install build dependencies:

```
sudo npm install --save-dev
```

To generate JS source files inside [extension](extension/) (from the project root directory):

```
npm run build
```

To run tests (via Jest):

```
npm run test
```

After building JS source files via `npm run build`, the [extension](extension/) directory is a complete Chrome extension can be directly loaded into Chrome.

### Google Cloud Platform Setup

UW AutoCalendar does not yet have a stable extension ID as it has not yet been published to the Chrome Webstore, so you will need to set up the GCP infrastructure manually. This includes the following:

* Create a GCP Project for UW AutoCalendar
* Generate an OAuth client ID for your extension ID (created after loading the extension in developer mode)
* Enable the Google Calendar API
* Whitelist the Google account you intend to update calendars on.

To do this, make a new GCP project and [enable the Google Calendar API](https://cloud.google.com/endpoints/docs/openapi/enable-api). Build your project and [load it as an extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest) to get the chrome extension ID for your build, then create an [OAuth client ID](https://support.google.com/cloud/answer/6158849?hl=en) for a Chrome application (make sure to select **Chrome app** when asked for the application type). Take the client ID and place it inside [manifest.json](extension/manifest.json) by updating the `oauth.client_id` key, then reload the extension. This updates the OAuth client ID used by the extension.

To whitelist a Google account for use by UW AutoCalendar, go to the "OAuth Consent Screen" tab and add your Google account email as a test user. This allows you to authenticate with OAuth for UW AutoCalendar on that Google account.

Done! GCP setup is now complete.

### Adding New Tests

Tests are organized by the classes they test so add tests using this convention. Please add tests for any new or changed functionality submitted in pull requests.

### How to Contribute

To contribute, fork this repository and then create a pull request with your changes including:

* A descriptive commit message describing why these modifications are necessary
* Use cases of when these modifications will introduce changed behavior
* Overview of the tests you added to test your new functionality

Regarding contributing to releases: we are currently not allowing external developers to release new versions of UW AutoCalendar to the Chrome Webstore. 
