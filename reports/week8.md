**Team Report**

*   Copy of the third section from last week:
    * Work on flow issues
    * begin implementation grade scope (stretch goal)
    * Set up more thorough testing infrastructure
    * Sort issues with batching and scaling up UW AutoCalendar to handle more users at once


*   Progress and issues:
    
    Most of this week was spent working on flow issues and fixing errors involving UI. Because it was peer review week we did not overhaul anything huge as we waited for input from those who would attempt to download and build UW autocalendar. During our meeting on Tuesday we successfully downloaded and ran the extension to completion on a fresh chrome account with no bugs. This was a big step as it meant that future users could do the same. While there were small bugs we discovered, nothing was going to pose enough of a challenge to derail the launch of the extension. We did however admit that grade scope, our stretch goal, was unattainable by the time of the final submission, and focused our efforts instead of flow and testing.


*   Plans and goals for the following week:
    * Further improve user flow from chrome add on installation to first use
    * Find a way to cut off the classes pushed to the google calendar to reduce the number of API calls made on now completed classes (from previous quarters)
    * Vastly improve testing architecture and JSDoc comments on all files in the repo

**Contributions of individual team members.**

*   Copy of the third section from last week:
    *   Xiaoyue Sun:
        *  UI overhaul -- remodel the UI to support the new workflow for calendar synchronization (1 week)

	*   Ariel Shurygin: 
        * Finish the wrapper classes and improve readability of google calendar events for end users.* Help other team members where needed and pick up new stretch goals if time is available.

	*   Benjamin Lowry:
        * Further expand testing infrastructure on canvas API.
		* Assist Laksh with gradescope authentication and queries. Because gradescope lacks a defined API like canvas and google calendar does, more help is needed here.
		* Help implement stretch goals if time allows it. 

	*   Laksh Gupta:
        *  Update the chrome webstore page with the most recent version of our project. Work on syncing Gradescope with Google Calendar as separate data source (stretch goal)

    *   Daniel Qiang:
        * Transition to importing ICS file on Google Calendar site rather than using Google Calendar API calls to fix scalability issues

*   Progress and issues:
    *   Xiaoyue Sun:
        * This week I added a security check in the front-end to ensure user can only synchronize their calendar once per minute. This is a case that has to be handled due to the general quota limits Google sets for users. Now every time user clicks the button to initiate a synchronization, back-end script will check the amount of time elapsed since the last synchronization has been done. It will only start to sync when the interval is more than a minute.

    *   Ariel Shurygin:
        * I successfully implemented the wrapper classes and started to look around for where I was needed next.
        * After speaking to the team it was decided I should help with building up the testing infrastructure on the canvas side, as well as comment out all the code within the canvas.ts file.

    *   Benjamin Lowry:
        * I started writing test coverage for the canvas.ts class and got familiar with jest’s mocking process. Ran into some issues trying to mock global variables in javascript like “window” and will remove tests related to that if it continues to not work.

    *   Laksh Gupta:
        * I started working on the stretch goal of integrating gradescope but ended up running into some problems with authentication. I also published a working version of our project to the Chrome webstore.

    *   Daniel Qiang:
        * I worked on porting the Google Calendar API uploading portion to using the “import calendar” feature on the Google Calendar webpage, which is far more scalable and avoids API rate limiting issues.

*   Plans and goals for the following week:
    *   Xiaoyue Sun:
        * Handle case that UI will crash if the popup page is closed and reopened when synchronization fails (3 days)
        * Make UI more robust referring to feedback received from peer review (3 days)

    *   Ariel Shurygin:
        * Comment in nice form all of the Canvas.ts file.
        * Add a number of offline tests to be run on every push to the repo, specifically testing canvas API, interfaces, and wrapper classes that I worked on/with.

    *   Benjamin Lowry:
        * Continue implementing test coverage on canvas.ts and move on to adding test coverage to other files like session.ts and utils.ts as necessary
        * Assist in adding code documentation to canvas.ts

    *   Laksh Gupta:
        *  Work on the testing infrastructure and write tests to make our code base more robust and find bugs. I will also work on adding more code documentation and comments to make the code more readable.

    *   Daniel Qiang:
        *  Add retry functionality to batched Google Calendar API requests so partial failures in batched requests are correctly retried when rate limiting issues occur (currently with per-minute rate limits for the Google Calendar API).

