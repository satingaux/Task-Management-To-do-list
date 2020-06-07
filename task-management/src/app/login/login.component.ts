import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authState = {};
  constructor(public afAuth: AngularFireAuth,
              private router: Router) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      if ( this.authState !== null ) {  this.router.navigateByUrl(''); }
    });
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(() =>  {
      // console.table(this.afAuth.authState);
      // this.router.navigateByUrl('');
    });
  }

  loginWithAnonymous()  {
    this.afAuth.signInWithEmailAndPassword('anonymous@gmail.com', '12345678').then((e) => {
      // console.log(e.user.email);
      // this.router.navigateByUrl('');
    })
  }

}
