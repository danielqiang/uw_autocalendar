**Team Report**

*   Copy of the third section from last week:
    *   Finish authentication flows for both google calendar and canvas SAML. (3 days)
    *   Add settings tab to pop-up UI. (3 days)
    *   Flesh out method stubs for each class (canvas and calendar) so that each team is aware of what type of information they will receive / be expected to return, from the other software components. (3 days)

*   Progress and issues:
    *   Canvas authentication completed. User with cookies able to query their classes and receive calendar information in two clicks (open extension and click start). Users without cookies able to complete flow in four clicks.
    *   Authentication flow for Canvas takes more clicks than intended when user does not have required auth cookies.
    *   Implementation of Google Calendar API completed.


*   Plans and goals for the following week:
    *   Implement testing for Canvas API query portion (3 days)
    *   Update UI for beta (1 week)
    *   Google calendar upload completed (3 days)
    *   Beta flow complete (3 days)


**Contributions of individual team members.**

*   Copy of the third section from last week:
    *   Xiaoyue Sun:
    * Add settings tab on extension popup to allow synchronization from a specific service. (3 days)
      * If time allows, join Daniel and Laksh to continue the API development for Google calendar data transmission. (4 days)

*   Ariel Shurygin:
    * Adapt canvas authentication to use chrome extension whitelists. Finish authentication flow so a user can log into their canvas and API calls to their classes can begin. (1 week)

*   Benjamin Lowry:
    * Implement authentication workflow in the plugin that we were able to spike out in python. (4 days)
    * Try and spike out an alternative method of authentication by using cookies requiring users to manually login to Canvas periodically. (3 days)

*   Laksh Gupta:
    * Work on creating an API to pull/push data to the user’s Google calendar and create stubs for the working with the incoming Canvas data. (1 week)

*   Daniel Qiang:
    * Flesh out Google Calendar API class and update our first calendar using an ICS file manually downloaded from Canvas. (1 week)

*   Progress and issues:
    *   Xiaoyue Sun:
        *  This week I worked with Danial and Laksh together to almost complete the Google Calendar API class. It contained all basic functions served to handle calendar/event related operations. We had figured out the API workflow last week, and Daniel had already set up the structure of API calls before our group meeting, which all helped the implementation this week go smoothly. We finished the setup of Jest and the CI system during the meeting as well.

   	*   Ariel Shurygin:
   		* Ben and I worked on canvas authentication last week, we were able to easily create the flow needed if the user already obtained cookies, however we were unsatisfied with our auth flow in the scenario that the user first needed to obtain authorization cookies. Our goal was to be able to redirect the user to the login site and gather their classes in a single click, however understanding when the user was completed with sign in processes ended up being very difficult and required an extra two clicks from the user in order to complete the flow. This is the main issue we are now working on this week.
   	*   Benjamin Lowry:
        * Ariel and I were able to get a working flow for Canvas authentication working. It is a little less user friendly than we would hope for at the moment, so there will likely be more work on it in the next few weeks. We also were able to move a bit past authentication and implement the first pass at our API calls to canvas. We are going to change the interface a little bit to return event information instead of links to .ics files after talking with the Google Calendar squad.

   	*   Laksh Gupta:
   	    * This week I worked with Xiaoyue and Daniel to implement the testing infrastructure with jest and the Continuous Integration system with Github Actions. We also flushed out the Google Calendar API and implemented methods to pull and push data from Google Calendar.

   	*   Daniel Qiang:
   	    * This week I worked with Laksh/Xiaoyue to flesh out the Google Calendar API using async/await. We also implemented a CI/CD workflow that runs our tests (via the Jest framework) on every commit to the main branch via GitHub Actions.


*   Plans and goals for the following week:
    *   Xiaoyue Sun:
        *  Update the frontend UI to manifest all kinds of functionalities supported by the extension in a clean way. (1 week)

    *   Ariel Shurygin:
        * Update canvas class return to run on event entries rather than ics files. (1 day)
        * fix authorization in worst case to run in one click (2 days)

    *   Benjamin Lowry:
        * Change our Canvas class to return a list of calendar events (1 day)
        * Investigate alternative flows for authentication and come up with a action plan of which one to pursue (2 days)
        * (Stretch goal) Start adding tests for our Canvas class

    *   Laksh Gupta:
        *  Work on implementing the methods to convert the ICS files from canvas to events which can be uploaded to google calendar.(1 week)

   	*   Daniel Qiang:
        * Clean up/refactor codebase, finish beta product for pulling events from Canvas and uploading them to Google Calendar
		

