import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {

    public url: string;
    public identity;
    public token;
    public stats;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    //Registrar usuario enviando por post el objeto usuario hacia nuestra API.
    register(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, { headers: headers });
    }

    //Validar usuario comprobando si el token generado corresponde con alguno almacenado en la BD.
    signup(user, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = gettoken;
        }
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, { headers: headers });
    }
    //OTTENER OBJETO DEL USUARIO
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity
        } else {
            this.identity = null;
        }

        return this.identity;

    }

    //OBTENER TOKEN
    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }


    getStats() {
        let stats = JSON.parse(localStorage.getItem('stats'));

        if (stats != undefined) {
            this.stats = stats;
            console.log(stats);
        } else {
            this.stats = null;
        }

        return this.stats;
    }

    //Le pasaremos el token para identificar el usuario identificado y posteriormente obtener sus estadísticas
    getCounters(userId = null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        if (userId != null) {
            return this._http.get(this.url + 'counters/' + userId, { headers: headers });
        } else {
            return this._http.get(this.url + 'counters', { headers: headers });
        }
    }
    //Decodificar el token para localizar al usuario para su posterior actualización de datos en la BD

    updateUser(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this._http.put(this.url + 'update-user/' + user._id, params, { headers: headers });

    }

    //Devolver todos los usuarios de una manera paginada
    getUsers(page=null):Observable<any>{
        let headers=new HttpHeaders()
        .set('Content-type','application-json')
        .set('Authorization',this.getToken());

        return this._http.get(this.url+'users/'+page,{headers:headers});
    }


    //Devolver un usuario en concreto
    getUser(id):Observable<any>{
        let headers=new HttpHeaders()
        .set('Content-type','application-json')
        .set('Authorization',this.getToken());

        return this._http.get(this.url+'user/'+id,{headers:headers});
    }

}