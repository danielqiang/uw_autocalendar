import { Session } from "../src/session";
import {expect} from "@jest/globals";
import 'isomorphic-fetch';

/**
 * Test Session's functions.
 *
 * @group remote
 */
const session = new Session();
test("Test Session get valid URL", done => {
    session.get("https://www.google.com").then(resp => {
        expect(resp.status).toEqual(200);
        expect(resp.statusText).toEqual("OK");
        done();
    });
});

test("Test Session get invalid URL", done => {
    session.get("https://google.com/fakeurl").then(resp => {
        expect(resp.status).toEqual(404);
        expect(resp.statusText).toEqual("Not Found");
        done();
    });
});

test("Test Session post invalid URL", done => {
    session.post("https://google.com/fakeurl?fake=fakeData").then(resp => {
        expect(resp.status).toEqual(404);
        expect(resp.statusText).toEqual("Not Found");
        done();
    });
});

test("Test Session delete invalid URL", done => {
   session.delete("https://google.com/fakeurl?resourceToDelete=fakeResource").then(resp => {
       expect(resp.status).toEqual(404);
       expect(resp.statusText).toEqual("Not Found");
       done();
   });
});

