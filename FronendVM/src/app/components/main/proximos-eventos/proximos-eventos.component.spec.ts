import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximosEventosComponent } from './proximos-eventos.component';

describe('ProximosEventosComponent', () => {
  let component: ProximosEventosComponent;
  let fixture: ComponentFixture<ProximosEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProximosEventosComponent]
    });
    fixture = TestBed.createComponent(ProximosEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
