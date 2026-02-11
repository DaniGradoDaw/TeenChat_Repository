import { ComponentFixture, TestBed } from '@angular/core/testing';

import { tab3Page } from './tab3.page';

describe('Tab3Page', () => {
  let component: tab3Page;
  let fixture: ComponentFixture<tab3Page>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
