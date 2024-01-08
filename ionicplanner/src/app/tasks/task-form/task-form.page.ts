import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { IonList } from '@ionic/angular/standalone';
import { dateLessThan, isDateRangeValid } from 'src/app/custom-validation';


@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CommonModule, FormsModule, ReactiveFormsModule,
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class TaskFormPage implements OnInit {
  
  statusList = [{id:"not_done", value:"Not Done"}, {id:"done", value:"Done"}];
  taskForm: FormGroup;
  isEditMode: boolean = false;
  editedTaskId: number = 0;
  formTitle = '';
  
  constructor(private formBuilder: FormBuilder, private taskService: TaskService, private route: ActivatedRoute,
              private router:Router) 
  { 
    console.log("TaskFormPage.constructor() called.");
    console.log("this.router.url = "+ this.router.url);   // e.g. /tabs/create-todo or /tabs/create-goal
    if (this.router.url.includes("todo")) {
      this.formTitle = "TODO Action"
    } else {
      this.formTitle = "Goal Action"
    }

    this.taskForm = formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      date_of_start: ['', [Validators.required, isDateRangeValid]],
      date_of_end: ['', [Validators.required, isDateRangeValid]],
      status: ['', [Validators.required]],
      task_type: ['', []],
    },
    { 
      validator: dateLessThan('date_of_start', 'date_of_end')
    }
    );

    // When editing mode...
    const taskId = this.route.snapshot.paramMap.get('task_id');
    console.log("taskId = "+taskId);

    if (taskId) {
      this.isEditMode = true;
      this.editedTaskId = parseInt(taskId); // convert taskId to integer

      this.taskService.getTask(this.editedTaskId).subscribe(result => {
        // ****** This "this.taskForm.patchValue(result);" is causing on task_date to have error. ******
        // Error is: The specified value "2023-11-06T00:00:00.000Z" does not conform to the required format, "yyyy-MM-dd".
        //this.taskForm.patchValue(result);  // populate web form with database data
        
        // ****** Alternative to "this.taskForm.patchValue(result);" to handle error on date format conformation ******
        let itaskObj = result;

        this.taskForm.get('name')?.setValue(result.name);
        this.taskForm.get('description')?.setValue(result.description);
        this.taskForm.get('status')?.setValue(result.status);
        this.taskForm.get('task_type')?.setValue(result.status);

        //this.taskForm.get('date_of_start')?.setValue(result.task_date.toISOString().split('T')[0]);    // ERROR TypeError: result.date_of_start.toISOString is not a function
        //this.taskForm.get('date_of_end')?.setValue(result.task_date.toISOString().split('T')[0]);    // ERROR TypeError: result.date_of_end.toISOString is not a function

        // Handle null values on dates here since date values are not required...
        if (itaskObj.date_of_start != null || itaskObj.date_of_start != undefined) {
          let tempStartDate = itaskObj.date_of_start;    // 2023-11-05T04:00:00.000Z  <= Complete ISO-8601 date
          let tempStartDate2 = new Date(tempStartDate);   // Sun Nov 05 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
          this.taskForm.get('date_of_start')?.setValue(tempStartDate2.toISOString().split('T')[0]);  // OK            
        } else {
          this.taskForm.get('date_of_start')?.setValue(null);
        }

        if (itaskObj.date_of_end != null || itaskObj.date_of_end != undefined) {
          let tempEndDate = itaskObj.date_of_end;    // 2023-11-05T04:00:00.000Z  <= Complete ISO-8601 date
          let tempEndDate2 = new Date(tempEndDate);   // Sun Nov 05 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
            this.taskForm.get('date_of_end')?.setValue(tempEndDate2.toISOString().split('T')[0]);  // OK            
        } else {
          this.taskForm.get('date_of_end')?.setValue(null);
        }
      });
    } 
  }

  ngOnInit() {
  }


  onSubmit() {
    console.log('Hello Task Form');
    console.log(this.taskForm.value);  // 

    if(this.isEditMode) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  createTask() {
    console.log('createTask()');
    this.taskForm.get('task_type')?.setValue("W");
    const formData = this.taskForm.value;      // retrieve data from your task HTML form
    console.log("formData ==> ", formData);
    console.log("formData.task_type ==> ", formData.task_type);

    // Call your TasksService that call HTTP POST call to the actual backend
    this.taskService.createTask(formData).subscribe((result) => {
      console.log("result = "+ result);
      alert('Task was created successfully');
      this.taskForm.reset(); // Clear web form data
    });
  }

  updateTask() {
    console.log('updateTask()');
    this.taskForm.get('task_type')?.setValue("W");
    const formData = this.taskForm.value;      // retrieve data from your task HTML form
    console.log("formData ==> ", formData);
    console.log("formData.task_type ==> ", formData.task_type);

    // Call your TasksService that call HTTP POST call to the actual backend
    this.taskService.updateTask(this.editedTaskId, formData).subscribe((result) => {
      console.log("result = "+ result);
      alert('Task was updated successfully');
      //this.studentForm.reset(); // Clear web form data
    });
  }

  deleteTask() {
    console.log('deleteTask()');
    // this.editedTaskId = parseInt(taskId); // convert taskId to integer
    this.taskService.deleteTask(this.editedTaskId).subscribe(result => {
      this.taskForm.patchValue(result);  // populate web form with database data
    })
  }

   // ****** Getter method for your Forms Control *********
   get nameFormControl() {
    return this.taskForm.get('name')!;  // use this if you intend to use in your HTML {{ nameFormControl.touched }}   
  }
  get descriptionFormControl() {
    return this.taskForm.get('description')!;  // use this if you intend to use in your HTML {{ descriptionFormControl.touched }}   
  }
  get dateOfStartFormControl() {
    return this.taskForm.get('date_of_start')!;  // use this if you intend to use in your HTML {{ dateOfStartFormControl.touched }}   
  }
  get dateOfEndFormControl() {
    return this.taskForm.get('date_of_end')!;  // use this if you intend to use in your HTML {{ dateOfEndFormControl.touched }}   
  }
  get statusFormControl() {
    return this.taskForm.get('status')!;  // use this if you intend to use in your HTML {{ statusFormControl.touched }}   
  }

}
