import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses().filter((course) => course.category === "BEGINNER"))
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(
      of(setupCourses().filter((course) => course.category === "ADVANCED"))
    );
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });

  // it("should display advanced courses when tab clicked", (done: DoneFn) => {
  //   coursesService.findAllCourses.and.returnValue(of(setupCourses()));
  //   fixture.detectChanges();
  //   const tabs = el.queryAll(By.css(".mat-tab-label"));
  //   // console.log(tabs.length);
  //   click(tabs[1]);
  //   fixture.detectChanges();

  //   setTimeout(() => {
  //     fixture.detectChanges();
  //     const cardTitles = el.queryAll(By.css(".mat-card-title"));
  //     expect(cardTitles.length).toBeGreaterThan(
  //       0,
  //       "Could not find card titles"
  //     );
  //     expect(cardTitles[0].nativeElement.textContent).toContain(
  //       "Angular Security Course"
  //     );
  //     done();
  //   }, 800);
  // });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // console.log(tabs.length);
    click(tabs[1]);
    fixture.detectChanges();
    // tick(16); // material tab is calling request animation frame internally which is called every 16ms
    flush();
    fixture.detectChanges();
    const cardTitles = el.queryAll(By.css(".mat-card-title"));
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));

  it("should display advanced courses when tab clicked", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const cardTitles = el.queryAll(By.css(".mat-card-title"));
      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });
  }));
});
