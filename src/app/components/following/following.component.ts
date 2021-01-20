import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import {Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import {FollowService} from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
  providers: [UserService,FollowService]
})
export class FollowingComponent implements OnInit {
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
  public following;
  public users: User[];
  public status;
  public userPageId;
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _followService:FollowService
  ) {
    this.title = 'Usuarios seguidos por';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();


  }

  ngOnInit(): void {
    console.log('Componente usuarios funcionando');

    this.actualPage();
  }

  //Obtener la página actual en la que nos encontremos
  actualPage() {
    this._route.params.subscribe(params => {
      let user_id=params['id'];
      this.userPageId=user_id;

      let page = +params['page'];                   //Obtener parámetro desde la URL
      this.page = page;

      if(!params['page']){
        page=1;

      }
      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

     this.getUser(user_id,page);
    });
  }

  //Peticion al servicio de angular y al servicio de nuestra API
  getFollows(user_id,page) {
    this._followService.getFollowing(this.token,user_id,page).subscribe(
      response => {
        if (!response.follows) {
          this.status = 'Error';

        } else {
          console.log(response);
        
          this.total = response.total;
          this.following = response.follows;
          this.pages = response.pages;
          this.follows = response.users_following;


          if (page > response.pages) {
            this.router.navigate(['/gente', 1]);
          }
          
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
          this.follows.splice(search);
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
  public user:User;


  //Obtener el objeto del usuario en el que nos encontremos
  getUser(user_id,page){
    this._userService.getUser(user_id).subscribe(
      response=>{
        if(response.user){
          this.user=response.user;
           //Devolver listado de usuarios
      this.getFollows(user_id,page);
        }else{
          this.router.navigate(['/home']);

        }
        

      },
      error=>{
        console.log(<any>error);
      }
    )
  }
}
