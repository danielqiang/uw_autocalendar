import { Session } from "./session.js";

export default class Canvas {
    session: Session;
    url: string;
    constructor() {
        this.session = new Session();
        this.url = "https://canvas.uw.edu/api/v1/";
    }

    /** check_login_auth will redirect the user to make an API call from canvas, requiring authentication.
     * In the scenario that user does not have authorized cookies this function returns false
     * and user will be automatically be redirected to UW login portal where they input their pass and save cookies.
     * If user successfully navigates to canvas.uw.edu.* without redirect or error (code 200) this function returns true
     *
     * Note: user without auth cookies will be asked to login, however this function is not able to recognize when
     * the user successfully connects to canvas AFTER the initial attempt
     * (this requires communication between
     * foreground and background scripts, very hard)
     * Therefore the user must open the chrome extension again,
     * with the auth cookie now generated, and kick off the flow.
     *
     * @returns boolean: whether or not the user has auth cookies for canvas and is able to query the API,
     * true for yes, false otherwise
     */
    async check_login_auth(): Promise<boolean> {
        return await this.session.get(this.url + "courses").then((resp) => {
            // Session unable to query the API, send them to canvas.uw.edu to login and obtain auth cookies.
            if (resp.status != 200) {
                window.open("https://canvas.uw.edu");
            } else if (resp.status == 200) {
                // User successfully queries the canvas API, user has the required auth cookies, return true.
                return true;
            }
            return false;
        });
    }

    /**
     * get_ics() will attempt to query a users canvas information using existing cookies, if user does not have auth
     * cookies get_ics will return null, otherwise will return a readableStream attached to the .ics file for a
     * currently enrolled class belonging to the user.
     *
     * How is "currently enrolled" determined? Currently enrolled is based on the listed start date of the course
     * on the canvas API. If the start date of the course is less than *13* weeks from the current date, the course
     * is considered currently enrolled. We chose 13 weeks because fall quarter is abnormally long,
     * unexpected behavior created by this may include multiple quarter's events being returned by get_ics().
     *
     * @returns null if user does not have auth cookies, else array of readable streams,
     * one per course, attached to the calendar .ics file for the course
     *
     **/
    async get_events(): Promise<any> {
        const is_authenticated = await this.check_login_auth();
        if (is_authenticated) {
        //     let page_num = 1;
        //     let flag = true;
        //     let cur_course_cal_urls = [];
        //     // This is a super rough way of looking 13 weeks in the past. The reason we need to do this is because
        //     // we can not rely on profs to mark their class as finished upon completion in the canvas system therefore
        //     // we filter classes by those who have started in the past 13 weeks.
        //     let thirteen_weeks_ago = new Date(
        //         new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * 13
        //     );
        //
        //     // While there are more classes to look at.
        //     while (flag) {
        //         await this.session
        //             .get(this.url + "courses" + "?page=" + page_num)
        //             .then((resp) => resp.json())
        //             .then((resp) => {
        //                 let course_data = resp;
        //                 // If course data is empty, i.e. we've reached end of paginated list.
        //                 if (Object.keys(course_data).length == 0) {
        //                     flag = false;
        //                 }
        //                 for (let course_index in course_data) {
        //                     let course = course_data[course_index];
        //                     // Get course starting date.
        //                     let date = new Date(course["start_at"]);
        //
        //                     if (date >= thirteen_weeks_ago) {
        //                         cur_course_cal_urls.push(course.calendar.ics);
        //                     }
        //                 }
        //             });
        //         page_num += 1;
        //     }
        //     // Iterate over ics links.
        //     let calendar_streams = [];
        //     for (let course_index in cur_course_cal_urls) {
        //         let ics = cur_course_cal_urls[course_index];
        //         let calendar = await this.session
        //             .get(ics)
        //             .then((response) => response.body);
        //         calendar_streams.push(calendar);
        //     }
        //     return calendar_streams;

            let course_to_events_dict = {}
            let user_id = await this.get_user_id()
            let user_courses = await this.get_course_ids_and_names()
            // user courses contains two parallel arrays, holding name and ID of each course user currently enrolled in
            let user_course_names = user_courses[0]
            let user_course_ids = user_courses[1]
            for (let i = 0; i < user_course_ids.length; i++){
                let course_id = user_course_ids[i]
                //this creates a key value pair of type: <Course name (string), list of events (array)>
                course_to_events_dict[user_course_names[i]] = await this.download_course_events(user_id, course_id)
            }
            return course_to_events_dict
        }
        return null;
    }


    async get_user_id(): Promise<any> {
        const url = this.url + "users/self?include=[id]"
        let user_profile = await this.session.get(url).then((r) => r.json())
        return user_profile.id
    }

    async get_course_ids_and_names(): Promise<any>{
        let cur_course_ids = [];
        let cur_course_names = [];
        // This is a super rough way of looking 13 weeks in the past. The reason we need to do this is because
        // we can not rely on profs to mark their class as finished upon completion in the canvas system therefore
        // we filter classes by those who have started in the past 13 weeks.
        let thirteen_weeks_ago = new Date(
            new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * 13
        );

        await this.session
            .get(this.url + "courses" + "?per_page=" + (Number.MAX_SAFE_INTEGER - 1))
            .then((resp) => resp.json())
            .then((resp) => {
                let course_data = resp;
                for (let course_index in course_data) {
                    let course = course_data[course_index];
                    // Get course starting date.
                    let date = new Date(course["start_at"]);
                    if (date >= thirteen_weeks_ago) {
                        cur_course_ids.push(course.id);
                        cur_course_names.push(course.name);
                    }
                }
            });
        return [cur_course_names, cur_course_ids]
    }

    async download_course_events(user_id:String, course_id: String): Promise<any> {
        const url = this.url + "calendar_events?type=assignment&context_codes%5B%5D=user_" + user_id +
            "&context_codes%5B%5D=course_" + course_id +
            "&start_date=2021-04-25T07%3A00%3A00.000Z&end_date=2021-06-06T07%3A00%3A00.000Z&per_page=50";
        return this.session.get(url).then((r) => r.json());

    }


}
