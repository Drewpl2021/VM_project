import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosParticipadosComponent } from './eventos-participados.component';

describe('EventosParticipadosComponent', () => {
  let component: EventosParticipadosComponent;
  let fixture: ComponentFixture<EventosParticipadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventosParticipadosComponent]
    });
    fixture = TestBed.createComponent(EventosParticipadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
