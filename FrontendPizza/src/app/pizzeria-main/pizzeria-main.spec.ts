import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PizzeriaMain } from './pizzeria-main';

describe('PizzeriaMain', () => {
  let component: PizzeriaMain;
  let fixture: ComponentFixture<PizzeriaMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzeriaMain],
    }).compileComponents();

    fixture = TestBed.createComponent(PizzeriaMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
