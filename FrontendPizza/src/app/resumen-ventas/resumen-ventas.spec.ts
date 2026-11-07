import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenVentas } from './resumen-ventas';

describe('ResumenVentas', () => {
  let component: ResumenVentas;
  let fixture: ComponentFixture<ResumenVentas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenVentas],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenVentas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
