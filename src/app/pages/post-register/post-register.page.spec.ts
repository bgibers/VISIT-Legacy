import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRegisterPage } from './post-register.page';

describe('PostRegisterPage', () => {
  let component: PostRegisterPage;
  let fixture: ComponentFixture<PostRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
