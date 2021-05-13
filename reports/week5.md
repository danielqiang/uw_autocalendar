**Team Report**

*   Copy of the third section from last week:
    *   Implement testing for Canvas API query portion (3 days)
    *   Update UI for beta (1 week)
    *   Google calendar upload completed (3 days)
    *   Beta flow complete (3 days)


*   Progress and issues:
    *   Testing has not been started for Canvas API, but class was refactored and changed to get calendar events
    *   Beta flow was finished and demo was recorded
    *   Google calendar API beta version was completed to create new calendar and upload events and now supports batched requests to speed up calendar synchronization
    *   UI improved with icons for current and future supported services in preparation for beta release


*   Plans and goals for the following week:
    *   Start writing testing coverage for both Canvas and google calendar APIs (1-2 days)
    *   Finish final investigation of Canvas authentication to triage whether we will change it (2 days)
    *   Add documentation where lacking in the code base (1 day)
    *   Prioritize improvement tasks and stretch goals (1 day)


**Contributions of individual team members.**

*   Copy of the third section from last week:
    *   Xiaoyue Sun:
        * Update the frontend UI to manifest all kinds of functionalities supported by the extension in a clean way. (1 week)

    *   Ariel Shurygin:
        * Update canvas class return to run on event entries rather than ics files. (1 day)
        * Fix authorization in worst case to run in one click (2 days)

    *   Benjamin Lowry:
        * Change our Canvas class to return a list of calendar events (1 day)
        * Investigate alternative flows for authentication and come up with a action plan of which one to pursue (2 days)
        * (Stretch goal) Start adding tests for our Canvas class

    *   Laksh Gupta:
        * Work on implementing the methods to convert the ICS files from canvas to events which can be uploaded to google calendar.(1 week)

    *   Daniel Qiang:
        * Clean up/refactor codebase, finish beta product for pulling events from Canvas and uploading them to Google Calendar

*   Progress and issues:
    *   Xiaoyue Sun:
        *  This week I redesigned the front-end UI to offer a cleaner and smoother user experience. I also added more instructions at each step to ensure user could get started the first time using the extension. On the other hand, getting the loading animation work was a pain, it was very time consuming to figure it out.

   	*   Ariel Shurygin:
   		* Ben and I worked to pull canvas events from classes. We chose canvas events rather than ICS files after some discussion with the google calendar team. We spent much of our time with the team recording the demo and discussing next steps. The canvas team is currently weighing the options between pursuing stretch goals and optimizing the sign in process 
   	
    *   Benjamin Lowry:
        * Ariel and I worked on the Canvas API to get it to pull down Canvas calendar events so that Google Calendar could ingest them. This went quite smoothly, but we still spent additional time investigating Canvas authentication since it is still not where we want it to be. We then all spent multiple hours on Tuesday as a team finishing up the beta version and recording the demo.

   	*   Laksh Gupta:
   	    * Worked on writing transformer code to convert canvas data into google calendar event objects which can be uploaded to google calendar. Helped with getting the beta release ready.

   	*   Daniel Qiang:
   	    * Added asynchronous batching functionality for HTTP requests, improving sync speed ~5x. Also refactored Canvas API to use requestor pattern and extended Google Calendar API to allow deleting/creating calendars by name.


*   Plans and goals for the following week:
    *   Xiaoyue Sun:
        *  Continue developing the front-end UI to make it more robust. (1 week)
        *  Add option window for configuring the extension. (4 days)
        
    *   Ariel Shurygin: 
        * Either pursue stretch goals listed in the living document(3+ days) or finalize the flow for authentication (2 days). Regardless of which path the canvas team decides on adding tests for the canvas API is a requirement (1 day)

    *   Benjamin Lowry:
        * Start the addition of test coverage to the Canvas class (1 day)* Revise Canvas class documentation to be updated to current functionality (1 day)
        * Work on other improvements or stretch goals depending on team needs (2 days) 
        
    *   Laksh Gupta:
        *  Start testing our beta code, clean up and make the code base more robust. Start adding some stretch goal features.

   	*   Daniel Qiang:
   	    *  Move AutoCalendar sync process to background script so user does not have to stay on the popup during the synchronization process (3 days). 
        * Batch requests (different from async batching via Promise.all()) so fewer requests have to be made in total to the Google Calendar API. (3 days)
