import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { isDateRangeValid, dateLessThan } from 'src/app/custom-validation';
import { Inote } from 'src/app/interfaces/inote';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.page.html',
  styleUrls: ['./note-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class NoteFormPage implements OnInit {

  noteForm: FormGroup;
  isEditMode: boolean = false;
  editedTaskId: number = 0;
  formTitle = '';

  constructor(private formBuilder: FormBuilder, private taskService: TaskService, private route: ActivatedRoute,
    private router:Router) 
  { 
    console.log("NoteFormPage.constructor() called.");
    console.log("this.router.url = "+ this.router.url);   // e.g. /tabs/create-todo or /tabs/create-goal
    // if (this.router.url.includes("todo")) {
    //   this.formTitle = "TODO Action"
    // } else {
    //   this.formTitle = "Goal Action"
    // }

    this.noteForm = formBuilder.group({
      name: ['', [Validators.required]],
      header: ['', []],
      details: ['', []],
      importance: ['', []],
      task_id: ['', []],
    });

    const taskId = this.route.snapshot.paramMap.get('task_id');
    console.log("taskId = "+taskId);
    if (taskId) {
      this.editedTaskId = parseInt(taskId); // convert taskId to integer
      this.noteForm.get('task_id')?.setValue(this.editedTaskId);
    }

  }

  ngOnInit() {
  }

  // ****** Getter method for your Forms Control *********
  get nameFormControl() {
    return this.noteForm.get('name')!;  // use this if you intend to use in your HTML {{ nameFormControl.touched }}   
  }
  get headerFormControl() {
    return this.noteForm.get('header')!;  // use this if you intend to use in your HTML {{ headerFormControl.touched }}   
  }
  get importanceFormControl() {
    return this.noteForm.get('importance')!;  // use this if you intend to use in your HTML {{ headerFormControl.touched }}   
  }
  
  /**
   * HTML call back method to reset the Task.importance to 'Y' or 'N'.
   * @param myEvent  - CustomEvent
   * @param noteItem - Inote object
   */
  // checkboxClick(myEvent: any, noteItem: Inote)
  // checkboxClick(myEvent: any, noteItem: FormGroup)
  checkboxClick(myEvent: any)
  {
    console.log("typeof myEvent ==>" + (typeof myEvent));
    console.log("myEvent instanceof CustomEvent ==>" + (myEvent instanceof CustomEvent));
    console.log("myEvent.target.checked ==>" +myEvent.target.checked);

    console.log("this.noteForm.get('importance')?.value() ==>" ,this.noteForm.get('importance')?.value);

    if (myEvent.target.checked) {
      

      //noteItem.importance = 'Y';
    } else {
      //noteItem.importance = 'N';
    }
  }

  onSubmit() {
    console.log('Hello Note Form');
    console.log(this.noteForm.value);  // 

    // if(this.isEditMode) {
    //   this.updateNote();
    // } else {
    //   this.createNote();
    // }
    this.createNote();
  }

  createNote() {
    console.log('createNote()');
    const formData = this.noteForm.value;      // retrieve data from your task HTML form
    console.log("formData ==> ", formData);
    console.log("formData.task_type ==> ", formData.task_type);

    // Call your NoteService that call HTTP POST call to the actual backend
    this.taskService.createNote(formData).subscribe((result) => {
      console.log("result = "+ result);
      alert('Note was created successfully');
      this.noteForm.reset(); // Clear web form data
    });

    this.noteForm.reset(); // Clear web form data
  }
}
