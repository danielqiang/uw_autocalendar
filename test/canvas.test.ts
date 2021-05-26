import Canvas, {
    CanvasAssignmentEvent, CanvasAssignmentWrapper,
    CanvasCalendarEvent, CanvasSAMLSession,
} from "../src/canvas";
import {HTTPMethod, Session} from "../src/session"
import {expect, jest} from "@jest/globals";
import 'isomorphic-fetch'
const { window } = global;

test("CanvasSAML Session Authentication Callback", () => {
    // Return an unauthorized response whenever the Session's request is hit.
    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>(resolve => {
                resolve(new Response(new Blob(), {
                    status: 401,
                    statusText: "Unauthorized"
                }));
            });
        });

    const canvasSession = new CanvasSAMLSession();

    const mockPromiseResponse = new Promise<Response>(resolve => {
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
    });
});

test("CanvasSAML Session Authenticated Request", () => {
    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>(resolve => {
                resolve(new Response(new Blob(), {
                    status: 200,
                    statusText: "OK"
                }));
            });
        });

    const canvasSession = new CanvasSAMLSession();
    canvasSession.get("https://canvas.uw.edu").then(resp => {
        expect(resp.status).toEqual(200);
        expect(resp.status).toEqual("OK");
        expect(requestSpy).toBeCalledTimes(1);
    });
});

test("CanvasSAML Session Window Opening", () => {

    const requestSpy = jest.spyOn(Session.prototype, "request")
        .mockImplementation((method: HTTPMethod, input: RequestInfo, init?: RequestInit) => {
            return new Promise<Response>(resolve => {
                resolve(new Response(new Blob(), {
                    status: 401,
                    statusText: "Unauthorized"
                }));
            });
        });

    const mockedOpen = jest.fn((url) => {
        return new Window();
    });
    const windowSpy = jest.spyOn(window, "open").mockImplementation(mockedOpen);
    //Object.defineProperty(window, 'open', mockedOpen);
    //window.open = mockedOpen;

    const canvasSession = new CanvasSAMLSession();
    const r1 = canvasSession.get("https://canvas.uw.edu");
    const r2 = canvasSession.get("https://canvas.uw.edu");

    expect(windowSpy).toBeCalledTimes(1);
    expect(mockedOpen).toBeCalledTimes(1);

    // afterAll(() => {
    //     window.open = open;
    // });
})



