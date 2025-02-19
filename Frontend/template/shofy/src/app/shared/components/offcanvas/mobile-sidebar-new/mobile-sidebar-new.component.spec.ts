import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSidebarNewComponent } from './mobile-sidebar-new.component';

describe('MobileSidebarNewComponent', () => {
  let component: MobileSidebarNewComponent;
  let fixture: ComponentFixture<MobileSidebarNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileSidebarNewComponent]
    });
    fixture = TestBed.createComponent(MobileSidebarNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
