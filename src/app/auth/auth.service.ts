import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl+'/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token:string;
  private tokenTimer:any;
  isAuthenticate: boolean = false;
  userId: string;
  authStatusListner = new Subject<boolean>();
  constructor(private http:HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticate;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  createUser(email: string, password:string){
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post(BACKEND_URL + '/signup',authData)
    .subscribe(responseData=>{
      this.router.navigate(['/']);
    }, error=>{
      this.authStatusListner.next(false);
    })
  }

  login(email: string, password:string){
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{token:string, expiresIn:number, userId:string}>(BACKEND_URL + '/login',authData)
    .subscribe(responseData=>{
      const token = responseData.token;
      this.token = token;
      if(token){
        const expiresInDuration = responseData.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticate = true;
        this.userId = responseData.userId;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate,this.userId);
        this.router.navigate(['/']);
      }
    })
  }

  logOut(){
    this.token = null;
    this.isAuthenticate = false;
    this.userId = null;
    this.authStatusListner.next(false);
    this.clearAuthData();
    this.router.navigate(['auth/login']);
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser(){ //automatically user login after token expire unexpectedley and call in app component
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresInDifference = authInformation.expirationDate.getTime() -  now.getTime();
    if(expiresInDifference > 0){
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresInDifference/1000);
      this.isAuthenticate = true;
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(() => {
      this.logOut() 
    }, duration * 1000);
  }
  
  private saveAuthData(token:string, expirationDate:Date, userId:string){
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiration =  localStorage.getItem('expiration');
    const userId =  localStorage.getItem('userId');
    if(!token || !expiration || !userId){
      return;
    }

    return { 
      token: token,
      userId:userId,
      expirationDate: new Date(expiration)
    }
  }
}
