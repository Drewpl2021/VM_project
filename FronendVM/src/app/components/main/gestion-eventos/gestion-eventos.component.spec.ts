import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEventosComponent } from './gestion-eventos.component';

describe('GestionEventosComponent', () => {
  let component: GestionEventosComponent;
  let fixture: ComponentFixture<GestionEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionEventosComponent]
    });
    fixture = TestBed.createComponent(GestionEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
