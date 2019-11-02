import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLocationPage } from './selected-location.page';

describe('SelectedLocationPage', () => {
  let component: SelectedLocationPage;
  let fixture: ComponentFixture<SelectedLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
