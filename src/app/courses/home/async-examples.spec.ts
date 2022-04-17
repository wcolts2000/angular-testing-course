import { time } from "console";
import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  it("Asyncronous test example with Jasmine done()", (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      // console.log("running assertion for done() example");
      test = true;

      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("asyncronous test example - setTimeout()", fakeAsync(() => {
    let test = false;

    setTimeout(() => {});
    setTimeout(() => {
      // console.log("running assertion for setTimeout example");
      test = true;

      expect(test).toBeTruthy();
    }, 1000);

    // tick(1000);
    flush();
    expect(test).toBeTruthy();
  }));

  it("asyncronous tst example - plain Promise", fakeAsync(() => {
    let test = false;

    // console.log("Creating Promise");

    Promise.resolve()
      .then(() => {
        // console.log("Promise evaluated successfully");
        test = true;
        return Promise.resolve();
      })
      .then(() => {
        // console.log("Promise 2 evaluated successfully");
      });

    // console.log("Running test assertion");

    flushMicrotasks();

    expect(test).toBeTruthy();
  }));

  it("asyncronous test example - Promise + setTimeout()", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it("Asyncronous test example - Observables", fakeAsync(() => {
    let test = false;
    console.log("Creating new observable");

    const test$ = of(test);

    test$.pipe(delay(1000)).subscribe(() => {
      test = true;
    });
    tick(1000);
    expect(test).toBe(true);
  }));
});
