import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNavComponent } from './shared-nav.component';

describe('SharedNavComponent', () => {
  let component: SharedNavComponent;
  let fixture: ComponentFixture<SharedNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedNavComponent]
    });
    fixture = TestBed.createComponent(SharedNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
