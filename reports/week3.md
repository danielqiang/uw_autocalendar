**Team Report**

*   Copy of the third section from last week:
    *   Have a basic project architecture ready (2 days)
    *   Work out error 302 redirect to log into canvas when making an API call. If a user does not already have the cookie they must be redirected to UW login to obtain one (4 days)
    *   Upload Canvas event to Google Calendar (3 days)
    *   Finalize the button design (i.e. the number of buttons, functionality of each button, etc) that will be used in extension popup (1 day)


*   Progress and issues:
    *  Discussed and finalized basic project architecture, researched website whitelisting on chrome extensions to address 302 redirect CORS errors.
    *  Discussed additional UI requirement and finalized look and feel of the overall pop-up tab.


*   Plans and goals for the following week:
    *   Finish authentication flows for both google calendar and canvas SAML. (3 days)
    *   Add settings tab to pop-up UI. (3 days)
    *   Flesh out method stubs for each class (canvas and calendar) so that each team is aware of what type of information they will receive / be expected to return, from the other software components. (3 days)





**Contributions of individual team members.**

*   Copy of the third section from last week:
    *   Xiaoyue Sun:
        *   Add more buttons on extension popup and finalize the frontend design for now (2 days)
        *   Talk with Daniel and Laksh to learn about their progress (1 day)
        *   Join Daniel and Laksh to work together on backend stuff (will figure out specific tasks after the conversation ) (1 week)

    *   Ariel Shurygin:
        *   Implement SAML canvas authentication system (1 week)
        *   Return a list of .ics files for all currently enrolled classes for a user (1 day)
        *   Return a list of course JSON objects if .ics does not exist (1 day)

    *   Benjamin Lowry
        *   Implement beginning structure of Canvas class that allows our plugin to extract canvas information as a data type (1 day)
        *   Add some redirect calls so we can authenticate into Canvas through MyUW (2 days)

    *   Laksh Gupta
        *   Understand the OAuth Authentication process for google services and figure out the best way to authenticate the user. (2-3 days)
        *   Work with Xiaoyue and Daniel and get the front end chrome extension hooked in with the google calendar API.

    *   Daniel Qiang
        *   Create working prototype for OAuth flow execution from Google Chrome extension (either asynchronously or synchronously) (2-3 days)
        *   Work with Xiaoyue on setting up initial debugging interface for Google Chrome extension



*   Progress and issues:
    *   Xiaoyue Sun

        * This week, I deleted some hard-coded sections and remodeled the front-end design which guaranteed later updates would be more flexible and less prone to errors. Then I worked with Daniel and Laksh on getting permission to user account and accessing user data under the hood of OAuth services. Due to the unfamiliarity with the structure, we ran into many issues in this process. Some APIs worked generally but not with extension, and we met CORS errors rejecting the requests as well. Efforts were made in order to successfully fetch the target data. After all kinds of attempts, we figured out the workable solution eventually.

    *   Ariel Shurygin

        * Lots of issues with SAML redirect, worked in conjunction with Daniel to figure out source of CORS errors which were the underlying cause of the problems. Discussed with entire team about the approach Canvas team took and pivoted away from current strategy in favor of one which was more integrated with the strengths and limitations of using google chrome extensions (such as whitelisted websites to avoid CORS rather than running on a node.js server)

    *   Benjamin Lowry

        * Was not able to get authentication working in Canvas but we do have a better understanding of one method of doing so that we should be able to implement this coming week. This is through whitelisting sites for CORS issues. Did not start writing Canvas class, after creating a plan with the team this week I think that will not happen until next week. We will continue working on authentication this week.

    *   Laksh Gupta

        * I worked with Daniel and Xiaoyue to combine the Google OAuth workflow with the front end chrome extension. We ran into a lot of bugs trying to navigate the google docs. Also the docs for chrome extensions are not really well defined so getting The google api to work with it required a lot of workarounds. We kept running into some CORS errors which Daniel figured out. At the end of this week we have a working extension which can authenticate the user using OAuth and create a link to the user’s google calendar.

    *   Daniel Qiang

        * Worked with Laksh/Xiaoyue to get Google Calendar API calls working and authenticated through OAuth and hooked into a wireframe Chrome extension via test buttons. I also refactored the OAuth callback flow to use async/await and ported the JS source over to TypeScript in my GitHub branch, and will discuss with the team on moving to TypeScript going forward as it is easier to maintain/more commonly used in industry.

*   Plans and goals for the following week:
    *   Xiaoyue Sun:
        * Add settings tab on extension popup to allow synchronization from a specific service. (3 days)
        * If time allows, join Daniel and Laksh to continue the API development for Google calendar data transmission. (4 days)

    *   Ariel Shurygin:
        * Adapt canvas authentication to use chrome extension whitelists. Finish authentication flow so a user can log into their canvas and API calls to their classes can begin. (1 week)

    *   Benjamin Lowry
        * Implement authentication workflow in the plugin that we were able to spike out in python. (4 days)
        * Try and spike out an alternative method of authentication by using cookies requiring users to manually login to Canvas periodically. (3 days)

    *   Laksh Gupta
        * Work on creating an API to pull/push data to the user’s Google calendar and create stubs for the working with the incoming Canvas data. (1 week)

    *   Daniel Qiang
        * Flesh out Google Calendar API class and update our first calendar using an ICS file manually downloaded from Canvas. (1 week)

