import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { enterAndLeaveFromLeft, growInShrinkOut, fadeInThenOut, swingInAndOut, fadeInAndOut, enterAndLeaveFromRight, bounceInAndOut } from '../triggers';
import { trigger, transition, useAnimation } from '@angular/animations';
import { useSlideFadeInAnimation, slideFadeOut } from '../animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    // The following are pre-built triggers - Use these to add animations with the least work
    growInShrinkOut, fadeInThenOut, swingInAndOut, fadeInAndOut,
    enterAndLeaveFromLeft, enterAndLeaveFromRight, bounceInAndOut,

    // The following is a custom trigger using animations from the package
    // Use this approach if you need to customize the animation or use your own states
    trigger('enterFromLeftLeaveToRight', [
      // this transition uses a function that returns an animation with custom parameters
      transition(':enter', useSlideFadeInAnimation('300ms', '20px')),
      // This transition uses useAnimation and passes the parameters directly - accomplishing the same thing as the above function
      transition(':leave', useAnimation(slideFadeOut, {params: {time: '2000ms', endPos: '100px'}})),
    ]),
  ],
})
export class DashboardComponent implements OnInit {

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) { }
  curDate = new Date();
  data;
  authState = {};
  filteredData = [];
  ngOnInit(): void {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      this.fetchFirestore();
    });
  }

  fetchFirestore()  {
    this.afs.collection(this.currentUser.email).valueChanges().subscribe((resp) => {
      this.data = resp;
      this.filteredData = resp;
    });
  }

  changeStatus(item, el)  {
    this.afs.collection(this.currentUser.email).doc(item.docId).update({
      properties: {
        STATUS: el,
        isSTARRED: item.properties.isSTARRED,
      }
    });
    item.STATUS = el;
  }

  addToStarred(item)  {
    this.afs.collection(this.currentUser.email).doc(item.docId).update({
      properties: {
        STATUS: item.properties.STATUS,
        isSTARRED: !item.properties.isSTARRED,
      }
    });
  }

  changeLabel(el) {
    this.filteredData = [];
    if (el === 'TOTALTASKS') {
      this.data.forEach(element => {
        if (element.properties.STATUS !== 'DELETED')  {
          console.table(element);
          this.filteredData.push(element);
        }
      });
    }
    else  {
      this.data.forEach(element => {
        if (element.properties.STATUS === el)  {
          console.table(element);
          this.filteredData.push(element);
        }
      });
    }
  }

  // Returns true if user is logged in
  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.isAuthenticated ? this.authState : null;
  }

}
