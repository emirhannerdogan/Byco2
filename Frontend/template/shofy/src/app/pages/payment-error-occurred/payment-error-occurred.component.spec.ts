import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrorOccurredComponent } from './payment-error-occurred.component';

describe('PaymentErrorOccurredComponent', () => {
  let component: PaymentErrorOccurredComponent;
  let fixture: ComponentFixture<PaymentErrorOccurredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentErrorOccurredComponent]
    });
    fixture = TestBed.createComponent(PaymentErrorOccurredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
