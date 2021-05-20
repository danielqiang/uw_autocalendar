**Team Report**

*   Copy of the third section from last week:
    *   Start writing testing coverage for both Canvas and google calendar APIs (1-2 days)
    *   Finish final investigation of Canvas authentication to triage whether we will change it (2 days)
    *   Add documentation where lacking in the code base (1 day)
    *   Prioritize improvement tasks and stretch goals (1 day)


*   Progress and issues:
    *   Move the synchronization workflow to backend so that user did not require to keep the popup open during synchronization process
    *   Updated UI supports to choose specific courses schedule syncing to personal calendar
    *   Extension got approved by the Google Webstore


*   Plans and goals for the following week:
    * Work on flow issues (4 days)
    * Begin implementation grade scope (stretch goal) (4 days)
    * Set up more thorough testing infrastructure (3 days)
    * Sort issues with batching and scaling up UW AutoCalendar to handle more users at once (4 days)


**Contributions of individual team members.**

*   Copy of the third section from last week:
    *   Xiaoyue Sun:
        *  Continue developing the front-end UI to make it more robust. (1 week)
        *  Add option window for configuring the extension. (4 days)

    *   Ariel Shurygin:
        * Either pursue stretch goals listed in the living document(3+ days) or finalize the flow for authentication (2 days).
        * Regardless of which path the canvas team decides on adding tests for the canvas API is a requirement (1 day)

    *   Benjamin Lowry:
        * Start the addition of test coverage to the Canvas class (1 day)
        * Revise Canvas class documentation to be updated to current functionality (1 day)
        * Work on other improvements or stretch goals depending on team needs (2 days)

    *   Laksh Gupta:
        *  Start testing our beta code, clean up and make the code base more robust. Start adding some stretch goal features.

    *   Daniel Qiang:
        *  Move AutoCalendar sync process to background script so user does not have to stay on the popup during the synchronization process (3 days).
        * Batch requests (different from async batching via Promise.all()) so fewer requests have to be made in total to the Google Calendar API. (3 days)
*   Progress and issues:
    *   Xiaoyue Sun:
        *  This week I added one more section in the popup, which allowed user to choose specific courses that are going to be synced to their calendar. This made the synchronization more flexible and meaningful. Since all the API calls were already set up, fetching the whole course lists from canvas and displaying them on the popup were straightforward. Also, I became more familiar with the front-end design, so I could work more efficiently.

    *   Ariel Shurygin:
        * This week I worked on setting up wrapper classes for canvas events and assignments. The goal of these wrapper classes was to provide backup information to the user if professors failed to provide certain information in their calendar listing. I did this by gathering multiple different sources of the same information so that if a certain piece was missing, there would not be a null value on the calendar. While implementing this I discovered an important bug which was impacting the amount of traffic able to be sent from the plug in to google calendar, a bug which would affect the way our plug in could scale to many users other than just our team of five. Our team is still working to resolve this issue.

    *   Benjamin Lowry:
        * I worked on the testing infrastructure for the Canvas API, implemented some basic tests, as well as researched more the issue of authentication flow on canvas. I helped port some of the canvas code to our backend script and helped fix bugs which arose as a result of the move.

    *   Laksh Gupta:
        * This week I started to explore the Gradescope API related stuff, which was one of the stretch goals. Also, I worked on getting the chrome extension published on the Chrome webstore and cleaned up some of our permissions.
    
	*   Daniel Qiang:
		* Added HTTP request batching functionality for Google Calendar API calls. Also changed core flow to execute from the background script instead of the popup (so the user can navigate away from the popup during sync).
	    * Merged Chrome Identity API fix for OAuth token cache clearing (used in UW AutoCalendar) to core DefinitelyTyped TypeScript repo (~6.6m users): https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52931
    
*   Plans and goals for the following week:
    *   Xiaoyue Sun:
        *  UI overhaul -- remodel the UI to support the new workflow for calendar synchronization (1 week)

	*   Ariel Shurygin: 
        * Finish the wrapper classes and improve readability of google calendar events for end users. (4 days)
        * Help other team members where needed and pick up new stretch goals if time is available. (3 days)
    
	*   Benjamin Lowry:
        * Further expand testing infrastructure on canvas API.* Assist Laksh with gradescope authentication and queries. Because gradescope lacks a defined API like canvas and google calendar does, more help is needed here. (1 week)
		* Help implement stretch goals if time allows it. 

	*   Laksh Gupta:
        * Update the chrome webstore page with the most recent version of our project. (3 days)
        * Work on syncing Gradescope with Google Calendar as separate data source (stretch goal) (4 days)
    
    * Daniel Qiang:
        * Transition to importing ICS file on Google Calendar site rather than using Google Calendar API calls to fix scalability issues (1 week).
