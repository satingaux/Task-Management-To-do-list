import { SnackbarService } from './../snackbar.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent  implements OnInit{

  constructor(private breakpointObserver: BreakpointObserver,
              private formBuilder: FormBuilder,
              public afAuth: AngularFireAuth,
              private router: Router,
              public snackbarService: SnackbarService,
              private afs: AngularFirestore ) { }
  isExpanded = true;
  startDate = new Date();

  authState = {};

  data = [];
  dataStatus = {
    INPROGRESS: 0,
    COMPLETED: 0,
    OUTOFSCHEDULE: 0,
    TOTALTASKS: 0,
  };

  form: FormGroup;
  titleControl = new FormControl(null, Validators.required);
  subtitleControl = new FormControl(null, Validators.max(10));
  descriptionControl = new FormControl(null, Validators.required);
  dateControl = new FormControl(null,  Validators.required);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit()  {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      if ( this.authState === null ) {  this.router.navigateByUrl('/login'); }
      this.afs.collection(this.currentUser.email).valueChanges().subscribe((resp) => {
        this.data = resp;
        this.dataStatus = {
          INPROGRESS: 0,
          COMPLETED: 0,
          OUTOFSCHEDULE: 0,
          TOTALTASKS: 0,
        };
        this.data.forEach(element => {
          this.dataStatus.TOTALTASKS++;
          this.dataStatus[element.properties.STATUS]++;
        });
      });
    });

    this.form = this.formBuilder.group({
      TITLE: this.titleControl,
      SUBTITLE: this.subtitleControl,
      DESC: this.descriptionControl,
      DATE: this.dateControl,
      properties: {
        STATUS: 'INPROGRESS',
        isSTARRED: false,
      }
    });
  }

  createTask()  {
    console.log(this.form.getRawValue());
    this.afs.collection(this.currentUser.email).add(this.form.getRawValue()).then((docRef) => {
      this.afs.collection(this.currentUser.email).doc(docRef.id).update({
        docId: docRef.id,
        time_stamp: new Date(),
      });
    }).then(()=>{
      this.snackbarService.openSnackBar('Task created successfully.', 'close');
    });
    this.form.reset();
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
