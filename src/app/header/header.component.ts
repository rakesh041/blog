import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authStatusListnerSubs:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated=>{
      this.isUserAuthenticated = isAuthenticated;
    })
  }
  
  onLogout(){
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.authStatusListnerSubs.unsubscribe()
  }

}
