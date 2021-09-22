import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GafeteComponent } from './gafete.component';

describe('GafeteComponent', () => {
  let component: GafeteComponent;
  let fixture: ComponentFixture<GafeteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GafeteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GafeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
