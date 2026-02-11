import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotpaswPage } from './forgotpasw.page';

describe('ForgotpaswPage', () => {
  let component: ForgotpaswPage;
  let fixture: ComponentFixture<ForgotpaswPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpaswPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
