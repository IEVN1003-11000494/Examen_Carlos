import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturaDatos } from './captura-datos';

describe('CapturaDatos', () => {
  let component: CapturaDatos;
  let fixture: ComponentFixture<CapturaDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturaDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturaDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
