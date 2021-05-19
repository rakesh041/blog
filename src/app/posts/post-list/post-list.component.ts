import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostService } from '../post.service'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isUserAuthenticated = false;
  isLoading:boolean = false;
  userId:string;
  totalPosts:number = 0;
  postPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOption: any = [1,2,5];
  private postSub: Subscription;
  private authStatusListnerSubs: Subscription;
  constructor(public postService: PostService,private authService:AuthService){
    this.postService = postService;
  }

  ngOnInit(){
    this.postService.getPosts(this.postPerPage,this.currentPage);
    this.isLoading = true;
    this.postSub = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts:Post[], postCount:number})=>{
      this.totalPosts = postData.postCount;
      this.isLoading = false;
      this.posts = postData.posts;
      this.userId = this.authService.getUserId();
    })
    this.isUserAuthenticated = this.authService.getIsAuth()
    this.authStatusListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated=>{
      this.isUserAuthenticated = isAuthenticated;
    })
  }

  onChangePage(pageData:PageEvent){
    this.isLoading = true;
    this.postPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postService.getPosts(this.postPerPage,this.currentPage);
  }

  onDelete(postId:string){
    this.isLoading = true;
    this.postService.deletePost(postId)
    .subscribe(()=>{
      this.postService.getPosts(this.postPerPage, this.currentPage);
    },()=>{
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusListnerSubs.unsubscribe();
  }

}
