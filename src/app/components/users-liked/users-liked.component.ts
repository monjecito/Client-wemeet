import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import {Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import {FollowService} from '../../services/follow.service';
import {LikesService} from '../../services/likes.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'users-liked',
  templateUrl: './users-liked.component.html',
  styleUrls: ['./users-liked.component.css'],
  providers: [UserService,FollowService,LikesService]
})
export class UsersLikedComponent implements OnInit {
  public title: string;
  public url;
  public identity;
  public token;
  public page;
  public next_page;
  public prev_page;
  public total;
  public pages;
  public follows;
  public users: User[];
  public status;
  public itemsPerPage=4;
  public todosloslikes;
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _followService:FollowService,
    private _likesService:LikesService
  ) { 
    this.title = 'Usuarios que le gustan esta publicación';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.actualPage();
  }
  //Obtener la página actual en la que nos encontremos
actualPage() {
  this._route.params.subscribe(params => {
    let publi = params['id'];                   //Obtener parámetro desde la URL
    

    //Devolver listado de usuarios
    this.getPublicationsLiked(publi,false);
  });
}
  getPublicationsLiked(pub_id,adding=false) {
    this._likesService.getUsersLiked(this.token,pub_id).subscribe(
      response => {
        if (response.users) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;
          this.todosloslikes=response.todosloslikes;
          this.users=response.users;
          this.follows=response.follows;
          console.log(this.users);
          console.log(this.follows);
          if (!adding) {
            this.users = response.users;
            this.todosloslikes=response.likes;
            this.follows=response.follows;
          } else {
            this.users=response.users;
            this.todosloslikes=response.likes;
            this.follows=response.follows;
          }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (!errorMessage) {
          this.status = 'error';
        }
      }
    );
  }


  public followUserOver;

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave(user_id) {
    this.followUserOver = 0;
  }
  
  //Seguir un usuario
  followUser(followed){
    var follow=new Follow('',this.identity._id,followed);

    this._followService.addFollow(this.token,follow).subscribe(
      response=>{
        if(!response.follow){
          this.status='error';
        }else{
          this.status='success';
          this.follows.push(followed);
        }
      },
        error => {
          var errorMessage = error;
          console.log(errorMessage);
  
          if (errorMessage != null) {
            this.status = 'error';
          }
      }

    );
  }

  //En caso de encontrar el id del usuario seguido en el array eliminará dicha posición 
  unfollowUser(followed){
    this._followService.deleteFollow(this.token,followed).subscribe(

      response=>{
        var search=this.follows.indexOf(followed);
        if(search!=1){
          this.follows.splice(search,1);
        }
      },
      error=>{
        var errorMessage = error;
          console.log(errorMessage);
  
          if (errorMessage != null) {
            this.status = 'error';
          }
      }
    );
  }
}
