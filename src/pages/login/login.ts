import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, Alert, AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../shared/validators/email';

import { TabsPage } from '../tabs/tabs';

import { AuthProvider } from '../../shared/providers/auth';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [
    //App logo
    trigger('logoFly', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0, 80px,0)' }),
        style({ opacity: 0 }),
        animate('400ms ease-in-out')
      ])
    ]),
    // Form Items
    trigger('formItem1FadeIn', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms 500ms ease-in')
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate('300ms ease-in')
      ])
    ]),
    trigger('formItem2FadeIn', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('500ms 500ms ease-in')
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate('200ms 300ms ease-in')
      ])
    ]),
    trigger('formItem3FadeIn', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms 500ms ease-in')
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate('400ms 300ms ease-in')
      ])
    ]),
    trigger('formItem4FadeIn', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('800ms 500ms ease-in')
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate('600ms 300ms ease-in')
      ])
    ]),
    trigger('formItem5FadeIn', [
      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('900ms 500ms ease-in')
      ]),
      transition('in => out', [
        style({ opacity: 1 }),
        animate('800ms 300ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {

  //animations
  loginState = "in";
  signupState = "out";
  resetPasswordState = "out";

  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public resetPasswordForm: FormGroup;

  step: string = "login";
  //step : string="signup";
  //step : string="reset-pwd";

  loadingOptions: any = {
    spinner: 'dots',
    cssClass: 'transparent-loading',
    content: 'Connecting...' 
  }

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public authProvider: AuthProvider, formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });

    this.signupForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });

    this.resetPasswordForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ]
    });

  }

  goToSignup(): void {
    this.loginState = "out";
    this.resetPasswordState = "out"
    this.signupState = "in";
    this.loginForm.reset();
    this.resetPasswordForm.reset();
    setTimeout(() => {
      this.step = "signup";
    }, 800); // trigger animation duration
  }


  async login(): Promise<void> {
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create(this.loadingOptions);
      loading.present();

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        await this.authProvider.loginWithEmailAndPassword(email, password);
        await loading.dismiss();
        this.navCtrl.setRoot(TabsPage);

      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
    }

  }


  /* SIGNUP ***************************************************************/

  async signup(): Promise<void> {
    if (!this.signupForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.signupForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create(this.loadingOptions);
      loading.present();

      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;

      try {
        await this.authProvider.signupWithEmailAndPassword(
          email,
          password
        );
        await loading.dismiss();
        console.log("new user created")
        //this.createDefaultUserSettings();
        this.navCtrl.setRoot(TabsPage);

      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: "user creation error : " + error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
    }
  }

  goToLogin(): void {
    this.signupState = "out";
    this.resetPasswordState = "out"
    this.loginState = "in";
    this.signupForm.reset();
    this.resetPasswordForm.reset();
    setTimeout(() => {
      this.step = "login";
    }, 800); // trigger animation duration
  }

  /* TODO
    async createDefaultUserSettings(): Promise<void> {
      const loading: Loading = this.loadingCtrl.create(this.loadingOptions);
      loading.present();
      try {
        this.dataSettingsProvider.createDefaultUserSettings();
        await loading.dismiss();
        console.log("default user settings created")
        this.navCtrl.setRoot(TabsPage);

      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: "default user settings creation : " + error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
      }
      */


  /* PASSWORD REQUEST ************************************************/
  async resetPassword(): Promise<void> {
    if (!this.resetPasswordForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.resetPasswordForm.value}`
      );
    } else {
      const loading: Loading = this.loadingCtrl.create(this.loadingOptions);
      loading.present();

            const email = this.resetPasswordForm.value.email;

            try {
              await this.authProvider.resetPassword(email);
              await loading.dismiss();
              const alert: Alert = this.alertCtrl.create({
                message: 'Check your inbox for a password reset link',
                buttons: [
                  { text: 'Cancel', role: 'cancel' },
                  {
                    text: 'Ok',
                    handler: data => {
                      this.navCtrl.pop();
                    }
                  }
                ]
              });
              alert.present();
            } catch (error) {
              await loading.dismiss();
              const alert: Alert = this.alertCtrl.create({
                message: "resetPassword error : " +error.message,
                buttons: [{ text: 'Ok', role: 'cancel' }]
              });
              alert.present();
            }
    }
  }

  goToResetPassword(): void {
    this.signupState = "out";
    this.loginState = "out";
    this.resetPasswordState = "in";
    this.signupForm.reset();
    this.loginForm.reset();
    setTimeout(() => {
      this.step = "reset-pwd";
    }, 600); // trigger animation duration
  }

}
