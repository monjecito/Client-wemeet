import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import {Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import {FollowService} from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService,FollowService]
})
export class UsersComponent implements OnInit {
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

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _followService:FollowService
  ) {
    this.title = 'GENTE';
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
      console.log(params.page);
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

      //Devolver listado de usuarios
      this.getUsers(page);
    });
  }

  //Peticion al servicio de angular y al servicio de nuestra API
  getUsers(page) {
    this._userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          this.status = 'Error';

        } else {
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.users_following;

          console.log(this.follows);

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
