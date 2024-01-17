import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteFormPage } from './note-form.page';

describe('NoteFormPage', () => {
  let component: NoteFormPage;
  let fixture: ComponentFixture<NoteFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoteFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
