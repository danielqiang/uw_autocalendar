**Team Report**

*   Copy of the third section from last week:
        *   Research tools/frameworks necessary for implementation: (1 week)
       *   Team: (3 days)
            *   OAuth 2.0 flow for Google Calendar
            *   Chrome extension setup
            *   Javascript familiarization
        *   Benjamin, Ariel: (3 days)
            *   Using the Canvas API via user credentials instead of API key
        *   Laksh, Daniel: (3 days)
            *   Gradescope authentication and API

*   Progress and issues: 
    *  Got some Canvas API calls to work and found that Canvas returns .ics files which may be convenient for importing into Google Calendar
    *  Did not find how to authenticate with Canvas yet
    *  Got OAuth implicit grant flow prototype working with JavaScript for Google Calendar, in addition to registering Google Calendar API key/client ID
   *   Set up Google extension with pop-up window designed

*   Plans and goals for the following week:
    *   Have a basic project architecture ready (2 days)
    *   Work out error 302 redirect to log into canvas when making an API call. If a user does not already have the cookie they must be redirected to UW login to obtain one (4 days)
    *   Upload Canvas event to Google Calendar (3 days)
    *   Finalize the button design (i.e. the number of buttons, functionality of each button, etc) that will be used in extension popup (1day)





**Contributions of individual team members.**

*   Copy of the third section from last week:

    *   Xiaoyue Sun:
        *   Research on OAuth 2.0 workflow for Google Calendar (2 days)
        *   Check Chrome extension setup (1-2 days)
        *   Get familiar with Javascript: reading materials/code to learn about libraries and structures & practicing with it (1 week)
    
    *   Ariel Shurygin:
        *   Research canvas authentication (2 days)
        *   Research javascript basics and familiarize with language (1 week)
        *   Begin discussing necessary resources and architecture for canvas portion with Ben
    
    *   Benjamin Lowry
        *   Prototype some Canvas API calls in javascript (2-3 days)
        *   Talk with Ariel about the Canvas data flow design (1 day)
        *   Talk with Daniel and Laksh about good ways to translate Canvas information into a Google calendar format (1 day)
    
    *   Laksh Gupta
        *   Research about javascript and get familiarized with the basic tools and software for the same. (1 week)
        *   Research about Google Calendar APIs and their integrations. (1 day)
        *   Understand the OAuth Authentication process for google services and figure out the best way to authenticate the user. (2-3 days)
        *   Talk with Ariel and Benjamin and decide the best way to integrate Canvas API with Google Calendar. (1 week)
    
    *   Daniel Qiang
        *   Research OAuth2 implicit grant flow to set up OAuth for a Javascript web app (2 days)
        *   Figure out how to create a wireframe Chrome add-on using JavaScript (2-3 days)
        *   Discuss with Laksh/the rest of the team on how best to approach working with the Google Calendar API and integrating everything with Canvas/other data sources. (1 week)
    
*   Progress and issues:

    *   Xiaoyue Sun
    
        *  Figuring out the general architecture of a directory which packed up the extension, I created one for UW Autocalendar. There were three fundamental pieces in the directory for our use case: manifest.json (specifying properties/permissions of the extension), popup.html (showed up when clicking the extension in toolbar), and background.js (automatically executed when the extension has been added to Chrome). To spin up the extension, I specified some basic properties and designed the popup UI for it. In the whole setup, the trickiest part was adjusting the layout of elements on popup. My HTML/CSS skills were very limited, so I had to keep searching solutions and adjusting CSS properties until it looked good, which was tedious and time consuming. Also, since the popup size was pre-determined and fixed, I hardcoded the position of each element. If any layout problems occur in the future, I will make modifications correspondingly.

    *   Ariel Shurygin
    
        * I worked with Benjamin this weekend to work on HTML requests to the Canvas API. We compiled a list of resources and documentation of the canvas API and developer toolkit. I also set up my Webstorm environment to be able to write HTMl and javascript code and test it as if it was being run from an extension. An issue Ben and I ran into was authentication, while our meeting was primarily to sort out API calls and see the general format of information we received, we often ran into issues authenticating with canvas when using webstorm. We spoke with Daniel for advice on how canvas authenticates users and plan to resolve this issue this week.
    
    *   Benjamin Lowry
    
        * I met up with Arik this weekend to work on the Canvas API part of our project. We researched the API and made calls on Canvas’s website to pull down course information. I opened an example .ics and found that is key-value structured. We were a bit confused about the dev API and getting a dev API key but we do not think we have to go down that path since if we just hit a redirect endpoint to redirect to my.uw to login to Canvas. We also re-familiarized ourselves a bit with Javascript.
    
    *   Laksh Gupta
    
        * Our group met a couple of times this week and worked on getting the Google Calendar API working. We familiarized ourselves with the OAuth protocol and basic javascript and started by working on a really basic chrome extension. Once we had the basic extension working we worked on getting some functionality of the google calendar API working. We were able to add/retrieve events from a person’s google calendar after they logged in. Now we need to work on hooking the API with the extension.
    
    *   Daniel Qiang 
        
        * I met with Laksh this week to work on setting up the boilerplate/manifest config for a Google Chrome add-on and getting an OAuth implicit grant flow for the Google Calendar API working from a JavaScript entrypoint. We were able to pull events from individual calendars based on Calendar ID and were working on integrating the OAuth flow with the Chrome extension. My main difficulties this week involved trying to get the OAuth flow working asynchronously so it works with a JavaScript promise/resolution framework. 

*   Plans and goals for the following week:
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
        * Work with Xiaoyue on setting up initial debugging interface for Google Chrome extension
