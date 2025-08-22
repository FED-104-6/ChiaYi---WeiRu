import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFlatComponent } from './edit-flat.component';
import { FormsModule } from '@angular/forms'; // 🎯 新增 FormsModule

describe('EditFlatComponent', () => {
  let component: EditFlatComponent;
  let fixture: ComponentFixture<EditFlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditFlatComponent, // 獨立元件本身
        FormsModule         // 🎯 確保測試環境也匯入 FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditFlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});