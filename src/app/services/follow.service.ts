import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;

    }
    //Guardar follow en la BD
    addFollow(token, follow): Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'follow', params, { headers: headers });


    }

    //Eliminar follow en la BD
    deleteFollow(token, id): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);


        return this._http.delete(this.url + 'follow/' + id, { headers: headers });
    }

    //Obtener los seguimientos de un usuario
    getFollowing(token, userId = null, page = 1): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        var url = this.url + 'following';
        if (userId != null) {
            url = this.url + 'following/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    }

    //Obtener los seguidores que tiene un usuario
    getFollowed(token, userId = null, page = 1): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        var url = this.url + 'followed';
        if (userId != null) {
            url = this.url + 'followed/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    }

    //Devolver mis seguidores
    getMyFollows(token): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-my-follows/' + true, { headers: headers });
    }

}