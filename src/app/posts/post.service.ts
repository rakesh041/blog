import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl+'/posts';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts:Post[], postCount:number}>();

  constructor(private http: HttpClient, private router:Router){}

  getPosts(postPerPage:number, currentPage:number) {
    const queryParam = `?pageSize=${postPerPage}&page=${currentPage}`;
    return this.http.get<{message:string, posts:any, maxPosts:number}>(BACKEND_URL+queryParam)
    .pipe(map((postData)=>{
      return { 
        posts: postData.posts.map(post=>{
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      }
    })
    )
    .subscribe((transformPostData)=>{
      this.posts = transformPostData.posts;
      this.postUpdated.next({posts:[...this.posts], postCount:transformPostData.maxPosts});
    })
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable()
  }

  getPost(postId) {
    return this.http.get<{_id:string, title:string, content:string, imagePath: string, creator:string}>(BACKEND_URL+postId)  
  }

  addPost(id:string, title:string, content:string, image: File){
    let postData;
    if(typeof image == 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: id,
        title: title,
        content:content,
        creator: null
      }
    }
    this.http.post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData)=>{
      //     const post: Post = {
      //       id: responseData.post.id,
      //       title: title,
      //       content: content,
      //       imagePath: responseData.post.imagePath
      //     }
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }

  updatePost(id:string, title:string, content:string, image:File | string){
    let postData;
    if(typeof image == 'object'){
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: id,
        title: title,
        content:content,
        creator: null
      }
    }

    this.http
    .put(BACKEND_URL+ id, postData)
    .subscribe((responseData)=>{
      console.log(responseData);
      // const post: Post = {
      //   id: id,
      //   title: title,
      //   content: content,
      //   imagePath: "responseData.imagePath"
      // }
      // const updatePost = [...this.posts];
      // const oldPostIndex = updatePost.findIndex(p=>p.id == id);
      // updatePost[oldPostIndex] = post;
      // this.posts = updatePost;
      // this.postUpdated.next([...this.posts]);
      // post.id = responseData.postId;
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId) { 
    return this.http.delete<{message:string}>(BACKEND_URL+postId);
    // .subscribe(()=>{
    //   const updatedPosts = this.posts.filter(post=>{
    //     return post.id !== postId
    //   })
    //   this.posts = updatedPosts;
    //   this.postUpdated.next([...this.posts]);
    // })
  }
}
