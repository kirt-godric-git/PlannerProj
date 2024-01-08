import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonCheckbox, IonCol, IonGrid, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonRow, AlertController, ToastController, IonAlert } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Itask } from '../interfaces/itask';
import { TaskService } from '../services/task.service';
import { addCircle, closeCircleOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,
    CommonModule, IonList, IonItem, IonCheckbox, IonButton, IonIcon, IonLabel, IonGrid, IonRow, IonCol,
    RouterLink, IonButtons, IonItemDivider, FormsModule, ReactiveFormsModule, IonAlert],
})
export class Tab3Page {
  
  tasks!: Itask[];              // all tasks
  notDoneTasks: Itask[] = [];   // not done tasks
  doneTasks: Itask[] = [];      // done tasks
  //router: Router = new Router;

  constructor(private taskService: TaskService, private alertController: AlertController, 
              private formBuilder: FormBuilder, private toastController: ToastController, 
              private router:Router) {
    addIcons({ createOutline, closeCircleOutline, addCircle });
    console.log("Tab2Page constructor()");

    // taskService.getTasks().subscribe((results) => {
    //   this.tasks = results;
    // });
  }

  ionViewWillEnter() 
  {
    console.log("tab2 ionViewWillEnter()");
    this.resetTaskList();
  }

  resetTaskList() 
  {
    console.log("resetTaskList() ");
    console.log("this.router.url = "+ this.router.url);

    // this.taskService.getTasks().subscribe((results) => {
    this.taskService.getMonthlyTasks().subscribe((results) => {
      this.tasks = results;
      this.notDoneTasks = new Array<Itask>();
      this.doneTasks = new Array<Itask>();

      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].status == 'not_done') {
          this.notDoneTasks.push(this.tasks[i]);
        } 
        else {
          this.doneTasks.push(this.tasks[i]);
        }
      }
    });
  }

  resetTaskStatus(myEvent: any, taskItem: Itask) 
  {
    if (myEvent.target.checked) {
      taskItem.status = 'done';
    } else {
      taskItem.status = 'not_done';
    }
  }

  /**
   * HTML call back method to reset the Task.status to 'done' or 'not done'.
   * @param myEvent  - CustomEvent
   * @param taskItem - Itask object
   * @param index - index number of the tasks array
   */
  checkboxClick1(myEvent: any, taskItem: Itask, index: number)
  {
    console.log("typeof myEvent ==>" + (typeof myEvent));
    console.log("myEvent instanceof CustomEvent ==>" + (myEvent instanceof CustomEvent));
    console.log("myEvent.target.checked ==>" +myEvent.target.checked);
    this.resetTaskStatus(myEvent, taskItem); 

    let taskForm: FormGroup;
    taskForm = this.formBuilder.group({
      name: ['', []],
      description: ['', []],
      date_of_start: ['', []],
      date_of_end: ['', []],
      status: ['', [Validators.required]],
      task_type: ['', []],
    });

    taskForm.get('name')?.setValue(taskItem.name);
    taskForm.get('description')?.setValue(taskItem.description);
    taskForm.get('status')?.setValue(taskItem.status);
    //taskForm.get('task_type')?.setValue(taskItem.status);
    taskForm.get('task_type')?.setValue("W");

    // Handle null values on dates here since date values are not required...
    if (taskItem.date_of_start != null || taskItem.date_of_start != undefined) {
      let tempStartDate = taskItem.date_of_start;    // 2023-11-05T04:00:00.000Z  <= Complete ISO-8601 date
      let tempStartDate2 = new Date(tempStartDate);   // Sun Nov 05 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
      taskForm.get('date_of_start')?.setValue(tempStartDate2.toISOString().split('T')[0]);  // OK            
    } else {
      taskForm.get('date_of_start')?.setValue(null);
    }

    if (taskItem.date_of_end != null || taskItem.date_of_end != undefined) {
      let tempEndDate = taskItem.date_of_end;    // 2023-11-05T04:00:00.000Z  <= Complete ISO-8601 date
      let tempEndDate2 = new Date(tempEndDate);   // Sun Nov 05 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
        taskForm.get('date_of_end')?.setValue(tempEndDate2.toISOString().split('T')[0]);  // OK            
    } else {
      taskForm.get('date_of_end')?.setValue(null);
    }

    const formData = taskForm.value;      // retrieve data from your task HTML form
    console.log(JSON.stringify(formData));
    let toastMsg = '';
    if (taskItem.status === 'done')
      toastMsg = `This task '${taskItem.name}' is done!`;
    else  
      toastMsg = `This task '${taskItem.name}' is NOT done!`;
    
    // Call your TasksService that call HTTP POST call to the actual backend
    this.taskService.updateTaskStatus(taskItem.id, formData).subscribe((result) => {
      console.log("result = "+ result);
      //alert(toastMsg);

      this.presentToast('middle', toastMsg);
      this.resetTaskList();
      //this.reloadPage();
    });
  }
  
  reloadPage() {
    window.location.reload()

    // ****** Not working....
    // console.log("this.router.url = "+ this.router.url);
    // this.router.navigateByUrl('/tabs/tab2', {skipLocationChange: true}).then(() => {
    //   this.router.navigate(["/tabs/tab2"]);
    // });
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', messageStr: string) {
    const toast = await this.toastController.create({
      message: messageStr,
      duration: 2500,
      position: position,
    });

    await toast.present();
  }

  /**
   * HTML call back method to reset the Task.status to 'done' or 'not done'.
   * @param myEvent  - CustomEvent
   * @param index - index number of the tasks array
   */
  checkboxClick2(myEvent: any, index: any) {
    console.log("index = "+index);
    let taskItem: Itask = this.tasks[index];
    this.resetTaskStatus(myEvent, taskItem); 
  }

  onDelete(taskId: number) {
    console.log("Deleting taskId = "+ taskId);

    // Get the array index of the task item
    const index = this.tasks.findIndex(mytask => {
      return mytask.id === taskId;
    }) 
    console.log("array index = "+ index);

    // Remove task object from array
    // The splice() method of Array instances changes the contents of an array 
    // by removing or replacing existing elements and/or adding new elements in place
    this.tasks.splice(index, 1); // splice(start, deleteCount)

    // Remove task from the database...
    this.taskService.deleteTask(taskId).subscribe(result => {
      alert('Task was deleted successfully'); // JavaScript alert();
      //this.presentAlert('Delete Success', 'Task was deleted successfully');
    });

    this.resetTaskList();
  }

  deleteTaskId = -1;
  alertButtons = [
    {
      text: 'Yes',
      handler: () => {
        console.log('yes delete id #'+this.deleteTaskId);
        this.onDelete(this.deleteTaskId);
      }
    },
    {
      text: 'No',
      handler: () => {
        console.log('no, dont delete id #'+this.deleteTaskId);
      }
    }
  ];

  async presentDeleteAlert(taskId: number) {
    this.deleteTaskId = taskId;

    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete this task?',
      //subHeader: 'Deletion Confirmation',
      message: "Once deleted, you won't able to undo this transaction.",
      buttons: this.alertButtons,
    });

    await alert.present();
  }


}
