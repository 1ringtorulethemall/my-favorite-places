import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

//import { Observable } from 'rxjs/Observable';
//import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  //user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    //this.user = afAuth.authState;
}

  loginWithEmailAndPassword(email: string, password: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then((val: any) => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  signupWithEmailAndPassword(email: string, password: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then((value: any) => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
        .then((data: any) => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  resetPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email)
        .then((data: any) => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

}
