import { Component, OnInit,Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import {LikesService} from '../../services/likes.service';
import * as $ from 'jquery';
import { Likes } from 'src/app/models/likes';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
  providers: [UserService, PublicationService,LikesService]
})
export class LikesComponent implements OnInit {
  public identity;
  public token;
  public title: string;
  public url: string;
  public status: string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public todosloslikes;
  public mislikes;
  public user;
  public id;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _likesService:LikesService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Publicaciones gustadas por :';
    this.url = GLOBAL.url;
    this.page = 1;
   }

  ngOnInit(): void {
    console.log('Componente de publicaciones funcionando');
    this.loadPage();
  
  }
  loadPage() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getPublicationsLiked(id,1,false);
      this.user=this.getUser(id);
    });
  }
  getPublicationsLiked(user,page, adding = false) {
    this._likesService.getUserLikes(this.token,user, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;
          this.todosloslikes=response.likes;
          this.mislikes=response.mylikes;
          if (!adding) {
            this.publications = response.publications;
            this.todosloslikes=response.likes;
          } else {
            var arrayA = this.publications;
            var arrayB = response.publications;               //Añadir elementos al array de publicaciones para mostrar más
            this.publications = arrayA.concat(arrayB);
            this.todosloslikes=response.likes;
            
           $("html,body").animate({scrollTop:$('html').prop("scrollHeight")},800);
          }


          console.log(this.publications);

          if (page > this.pages) {
            //this._router.navigate(['/home']);
          }

        } else {
          this.status = 'error';
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
 
  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          console.log(this.user);
    
      error => {
        console.log(<any>error);
        this._router.navigate(['/likes', this.identity._id]);
      }
    }
  });
}

  public noMore = false;

  public likePublicationOver;
  
  mouseEnter(publication_id) {
    this.likePublicationOver = publication_id;
  }
  mouseLeave(user_id) {
    this.likePublicationOver = 0;
  }

  likePublication(publication_id){
    var like=new Likes('',this.identity._id,publication_id);

    this._likesService.addLike(this.token,like).subscribe(
      response=>{
        if(!response.like){
          this.status='error';
        }else{
          this.status='success';
          this.todosloslikes.push(publication_id);
          console.log(this.todosloslikes);
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

   //En caso de encontrar el id de la publicación se eliminará dicho Me Gusta
   unLikePublication(publication_id){
    this._likesService.deleteLike(this.token,publication_id).subscribe(
      response=>{
        var search=this.todosloslikes.indexOf(publication_id);
        if(search!=1){
          this.todosloslikes.splice(search,1);
          console.log(this.todosloslikes);
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
