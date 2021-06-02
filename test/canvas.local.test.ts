import Canvas, { CanvasSAMLSession } from "../src/canvas";
import {HTTPMethod, Session} from "../src/session";
import {expect, jest} from "@jest/globals";
import 'isomorphic-fetch';

/**
 * Test that authentication callback is executed correctly.
 *
 * @group local
 */
test("CanvasSAML Session Authentication Callback", done => {
    // Return an unauthorized response whenever the Session's request is hit.
    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>((resolve, reject) => {
                resolve(new Response(new Blob(), {
                    status: 401,
                    statusText: "Unauthorized"
                }));
            });
        });

    const canvasSession = new CanvasSAMLSession();

    const mockPromiseResponse = new Promise<Response>((resolve, reject) => {
        resolve(new Response(new Blob(),{
            status: 200,
            statusText: "OK"
        }));
    });

    const mockCallback = jest.fn(() => mockPromiseResponse);
    const authSpy = jest.spyOn(canvasSession, "authenticate").
        mockImplementation((callback) => new Promise(resolve => {
            resolve(mockCallback());
        }));

    canvasSession.get("https://canvas.uw.edu").then(resp => {
        expect(resp.status).toEqual(200);
        expect(resp.statusText).toEqual("OK");
        expect(mockCallback).toBeCalledTimes(1);
        expect(authSpy).toBeCalledTimes(1);
        expect(requestSpy).toBeCalledTimes(1);
        requestSpy.mockRestore();
        done();
    });
});

/**
 * Test that Session.request is called correctly when a request
 * is made and the user is already authenticated with Canvas.
 */
test("CanvasSAML Session Authenticated Request", done => {
    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>((resolve, reject) => {
                resolve(new Response(new Blob(), {
                    status: 200,
                    statusText: "OK"
                }));
            });
        });

    const canvasSession = new CanvasSAMLSession();
    canvasSession.get("https://canvas.uw.edu").then(resp => {
        expect(resp.status).toEqual(200);
        expect(resp.statusText).toEqual("OK");
        expect(requestSpy).toBeCalledTimes(1);
        requestSpy.mockRestore();
        done();
    });
});

const userData = {
    "id": 1234,
    "name": "John Smith",
    "created_at": "2018-05-14T05:52:41-07:00",
    "sortable_name": "Smith, John",
    "short_name": "John Smith",
    "avatar_url": "https://canvas.uw.edu/images/messages/avatar-50.png",
    "locale": null,
    "effective_locale": "en",
    "permissions": {
        "can_update_name": true,
        "can_update_avatar": true,
        "limit_parent_app_web_access": false
    }
}

test("Test getting user ID", done => {
    const canvas = new Canvas();

    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>((resolve, reject) => {
                const resp = new Response(JSON.stringify(userData), {
                        status: 200,
                        statusText: "OK"
                    });
                resolve(resp);
            });
        });

    canvas.user_id().then(uid => {
        expect(uid).toEqual(1234);

        canvas.user_id().then(uid2 => {
            // Should be cached now.
            expect(uid2).toEqual(1234);
            expect(requestSpy).toBeCalledTimes(1);
            requestSpy.mockRestore();
            done();
        })
    });
});

const userCourses = [
    {
        "id": 123,
        "name": "Class #1",
        "account_id": 1,
        "uuid": "oKpr9lt9BeEuIzo94qfafldUnOiUfDKwy4DyqYCL",
        "start_at": String(Date()),
        "grading_standard_id": null,
        "is_public": false,
        "created_at": "2018-03-21T14:21:24Z",
        "course_code": "C1",
        "default_view": "wiki",
        "root_account_id": 83919,
        "enrollment_term_id": 4097,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 2000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "apply_assignment_group_weights": false,
        "calendar": {
            "ics": "https://canvas.uw.edu/feeds/calendars/course_oKpr9lt9BeEuIzo94qfafldUnOiUfDKwy4DyqYCL.ics"
        }
    },
    {
        "id": 124,
        "name": "Class #2",
        "account_id": 1,
        "uuid": "i3WUJVkf58mKZTqF6yiytbSJP0IOizpVemeAEj4z",
        "start_at": String(Date()),
        "grading_standard_id": null,
        "is_public": false,
        "created_at": "2019-03-27T14:31:27Z",
        "course_code": "C2",
        "default_view": "assignments",
        "root_account_id": 83919,
        "enrollment_term_id": 4158,
        "license": "private",
        "grade_passback_setting": null,
        "end_at": null,
        "public_syllabus": false,
        "public_syllabus_to_auth": false,
        "storage_quota_mb": 2000,
        "is_public_to_auth_users": false,
        "homeroom_course": false,
        "course_color": null,
        "apply_assignment_group_weights": false,
        "calendar": {
            "ics": "https://canvas.uw.edu/feeds/calendars/course_i3WUJVkf58mKZTqF6yiytbSJP0IOizpVemeAEj4z.ics"
        }
    }
];

test("Test getting user courses", done => {
    const canvas = new Canvas();

    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>((resolve, reject) => {
                const resp = new Response(JSON.stringify(userCourses), {
                    status: 200,
                    statusText: "OK"
                });
                resolve(resp);
            });
        });

    canvas.courses().then(courses => {
        expect(courses[0].id).toEqual(123);
        expect(courses[1].id).toEqual(124);

        canvas.courses().then(courses2 => {
            // Should be cached now.
            expect(courses2[0].id).toEqual(123);
            expect(courses2[1].id).toEqual(124);
            expect(requestSpy).toBeCalledTimes(1);
            requestSpy.mockRestore();
            done();
        })
    });
});

const userAssignment1 = [
    {
        "title": "Project proposal",
        "workflow_state": "published",
        "created_at": "2021-04-03T17:52:48Z",
        "updated_at": "2021-05-19T04:11:22Z",
        "all_day": false,
        "all_day_date": "2021-04-06",
        "lock_info": {
            "lock_at": "2021-04-06T20:15:00Z",
            "can_view": true,
            "asset_string": "assignment_6264328"
        },
        "id": "assignment_6264328",
        "type": "assignment",
        "assignment": {
            "id": 6264328,
            "lock_info": {
                "lock_at": "2021-04-06T20:15:00Z",
                "can_view": true,
                "asset_string": "assignment_6264328"
            },
            "course_id": 1448864,
            "name": "Project proposal",
            "submission_types": [
                "online_upload"
            ],
            "has_submitted_submissions": true,
            "due_date_required": false,
            "max_name_length": 255,
            "in_closed_grading_period": false,
            "user_submitted": true,
            "is_quiz_assignment": false,
            "can_duplicate": true,
            "original_course_id": null,
            "original_assignment_id": null,
            "original_assignment_name": null,
            "original_quiz_id": null,
            "workflow_state": "published",
            "muted": false,
            "allowed_extensions": [
                "zip"
            ],
        },
        "context_code": "course_1448864",
        "context_name": "CSE 403 A Sp 21: Software Engineering",
        "end_at": "2021-04-06T20:00:00Z",
        "start_at": "2021-04-06T20:00:00Z",
    },
    {
        "title": "Project proposal 2",
        "workflow_state": "published",
        "created_at": "2021-04-03T17:52:48Z",
        "updated_at": "2021-05-19T04:11:22Z",
        "all_day": false,
        "all_day_date": "2021-04-06",
        "lock_info": {
            "lock_at": "2021-04-06T20:15:00Z",
            "can_view": true,
            "asset_string": "assignment_6264328"
        },
        "id": "assignment_6264328",
        "type": "assignment",
        "assignment": {
            "id": 6264329,
            "lock_info": {
                "lock_at": "2021-04-06T20:15:00Z",
                "can_view": true,
                "asset_string": "assignment_6264328"
            },
            "course_id": 1448864,
            "name": "Project proposal",
            "submission_types": [
                "online_upload"
            ],
            "has_submitted_submissions": true,
            "due_date_required": false,
            "max_name_length": 255,
            "in_closed_grading_period": false,
            "user_submitted": true,
            "is_quiz_assignment": false,
            "can_duplicate": true,
            "original_course_id": null,
            "original_assignment_id": null,
            "original_assignment_name": null,
            "original_quiz_id": null,
            "workflow_state": "published",
            "muted": false,
            "allowed_extensions": [
                "zip"
            ],
        },
        "context_code": "course_1448864",
        "context_name": "CSE 403 A Sp 21: Software Engineering",
        "end_at": "2021-04-06T20:00:00Z",
        "start_at": "2021-04-06T20:00:00Z",
    },
];
const userAssignment2 = [
    {
        "title": "Requirements",
        "workflow_state": "published",
        "created_at": "2021-04-09T15:34:21Z",
        "updated_at": "2021-05-19T04:11:22Z",
        "all_day": true,
        "all_day_date": "2021-04-13",
        "lock_info": {
            "lock_at": "2021-04-14T06:59:59Z",
            "can_view": true,
            "asset_string": "assignment_6273862"
        },
        "id": "assignment_6273862",
        "type": "assignment",
        "assignment": {
            "id": 6273862,
            "lock_info": {
                "lock_at": "2021-04-14T06:59:59Z",
                "can_view": true,
                "asset_string": "assignment_6273862"
            },
            "course_id": 1448864,
            "name": "Requirements",
            "submission_types": [
                "online_upload"
            ],
            "has_submitted_submissions": true,
            "due_date_required": false,
            "max_name_length": 255,
            "in_closed_grading_period": false,
            "user_submitted": true,
            "is_quiz_assignment": false,
            "can_duplicate": true,
            "original_course_id": 1448864,
            "original_assignment_id": 6264328,
            "original_assignment_name": "Project proposal",
            "original_quiz_id": null,
            "workflow_state": "published",
            "muted": false,
            "allowed_extensions": [
                "pdf"
            ],
        },
        "context_code": "course_1448864",
        "context_name": "CSE 403 A Sp 21: Software Engineering",
        "end_at": "2021-04-14T06:59:59Z",
        "start_at": "2021-04-14T06:59:59Z",
    },
];

test("Test getting user assignments", done => {
    const canvas = new Canvas();

    let i = 0;
    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            let payload = [];
            if (i == 0) {
                payload = userAssignment1;
            } else if (i == 1) {
                payload = userAssignment2;
            }
            i += 1;
            return new Promise<Response>((resolve, reject) => {
                const resp = new Response(JSON.stringify(payload), {
                    status: 200,
                    statusText: "OK"
                });
                resolve(resp);
            });
        });

    const coursesSpy = jest.spyOn(canvas, "courses")
        .mockImplementation(() => {
            return new Promise<any[]>((resolve, reject) => {
                resolve([{
                    "id": 123,
                    "name": "Course #1"
                }]);
            });
        })

    const userSpy = jest.spyOn(canvas, "user_id")
        .mockImplementation(() => {
            return new Promise<number>((resolve, reject) => {
                resolve(123);
            });
        });

    canvas.download_assignments().then(assignments => {
        const c1Assignments = assignments.get("Course #1");
        expect(c1Assignments[0].assignment.id).toEqual(6264328);
        expect(c1Assignments[1].assignment.id).toEqual(6264329);
        expect(c1Assignments[2].assignment.id).toEqual(6273862);
        expect(requestSpy).toBeCalledTimes(3);
        expect(coursesSpy).toBeCalledTimes(1);
        expect(userSpy).toBeCalledTimes(1);
        requestSpy.mockRestore();
        done();
    });
});
