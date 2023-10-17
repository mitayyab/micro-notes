import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiError } from '@api-lib/error/ApiError';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
   error: ApiError | null = null;

   constructor(
      private fb: FormBuilder,
      private http: HttpClient,
   ) {
      this.loginForm = this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required],
      });
   }

   ngOnInit(): void {}

   onSubmit(): void {
      if (this.loginForm.valid) {
         const { email, password } = this.loginForm.value;
         this.http
            .post('/api/session', { username: email, password })
            .pipe(
               catchError(e => {
                  this.error = e.error;

                  return throwError(() => e);
               }),
            )
            .subscribe(() => {});
      }
   }
}
