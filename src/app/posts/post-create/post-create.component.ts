import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle:string = '';
  enteredContent:string = '';
  post: Post;
  form: FormGroup;
  imagePreview: string;
  private mode:string = "create";
  private postId: string;
  @Output() postCreated  = new EventEmitter<Post>();

  constructor(public postService: PostService, public route: ActivatedRoute){
    this.postService = postService;
  }

  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'content': new FormControl(null, {validators:[Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required]}),
    })
    this.route.paramMap.subscribe((paramMaps:ParamMap)=>{
      if(paramMaps.has('postId')){
        this.mode = "edit";
        this.postId = paramMaps.get('postId');
        this.postService.getPost(this.postId)
        .subscribe((responseData)=>{
          this.post = {
            id: responseData._id, 
            title: responseData.title, 
            content: responseData.content, 
            imagePath: responseData.imagePath, 
            creator: null
          };
          this.form.setValue({
            'title': this.post.title,
            'content':this.post.content,
            'image': this.post.imagePath
          })
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }
  
  onSavePost(){
    if(this.form.invalid){
      return;
    }
    if(this.mode == 'create'){
      this.postService.addPost(null, this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId,this.form.value.title, this.form.value.content, this.form.value.image)
    }
    this.form.reset()
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
