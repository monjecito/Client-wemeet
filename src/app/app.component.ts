import { Component,OnInit,DoCheck} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})
export class AppComponent implements OnInit,DoCheck{
  public title : string;
  public identity;
  public url:string;

  constructor(private _userService:UserService,private _route:ActivatedRoute,private _router:Router){
    this.title='WE-MEET'
    this.url=GLOBAL.url;
  }
  //Obtener token al cargar la página
  ngOnInit(){
    this.identity=this._userService.getIdentity();

    console.log(this.identity);
  }

  //Cada vez que sucede un cambio se actualizan los datos
  ngDoCheck(){
    this.identity=this._userService.getIdentity();
  }

  //Eliminar información usuario y redirección a página Home
  logout(){
    localStorage.clear();
    this.identity=null;               
    this._router.navigate(['/']);
  }
}
