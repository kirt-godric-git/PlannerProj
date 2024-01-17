import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Router, RouterLink } from '@angular/router';
import { Itask } from '../interfaces/itask';
import { addIcons } from 'ionicons';
import { addCircle, closeCircleOutline, createOutline } from 'ionicons/icons';
import { Inote } from '../interfaces/inote';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class Tab4Page implements OnInit {
  tasks!: Itask[];              // all achievement tasks
  notes = [
    'This is note 1 to this task.', 'This is note 2 to this task.', 'This is note 3 to this task.'
  ];
  notes2: Inote[] = [];

  constructor(private taskService: TaskService, private router:Router) { 
    console.log("Tab4Page constructor()");
    addIcons({ createOutline, closeCircleOutline, addCircle });
  }

  ngOnInit() {
  }

  ionViewWillEnter() 
  {
    console.log("tab4 ionViewWillEnter()");
    this.resetTaskList();
  }

  resetTaskList() 
  {
    console.log("resetTaskList() ");
    console.log("this.router.url = "+ this.router.url);

    // this.taskService.getTasks().subscribe((results) => {
    this.taskService.getAchievedTasks().subscribe((results) => {
      console.log(results);
      this.tasks = results;
      console.log("this.tasks = ", this.tasks);
      let myNotes: Inote[] = [];

      console.log("this.tasks.length = "+ this.tasks.length);
      // for (let i = 0; i < this.tasks.length; i++) 
      // {
      //   console.log("notes = ", this.tasks[i].Notes);
      //   if (this.tasks[i].Notes != undefined) 
      //   {
      //     for (let i2 = 0; i2 < this.tasks[i].Notes.length; i2++) {
      //       console.log("note = ", this.tasks[i].Notes[i2]);
      //       myNotes.push(this.tasks[i].Notes[i2]);
      //     }
      //   }
      // }
      this.notes2 = myNotes;
      console.log("myNotes = ", myNotes);
    });
  }


}
