import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Likes } from '../models/likes';
@Injectable()
export class LikesService {
    public url: string;
    public likes;
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;

    }

    
    //Guardar follow en la BD
    addLike(token, publication_id): Observable<any> {
        let params = JSON.stringify(publication_id);
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'like', params, { headers: headers });


    }

    //Eliminar like en la BD
    deleteLike(token,id): Observable<any> {
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);


        return this._http.delete(this.url + 'like/' + id, { headers: headers });
    }
    
     //Obtener los likes de un usuario
     
     getLikes(token,id_pub): Observable<any> {
        let params = JSON.stringify(id_pub);
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        
        
        return this._http.get(this.url+'likes/'+params, { headers: headers });
    }

    //Obtener mis publicaciones gustadas
    getUserLikes(token,id_user,page=1): Observable<any> {
       
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url+ 'publications-liked/'+id_user+'/'+page, { headers: headers });
    }
     //Obtener mis publicaciones gustadas
     getUsersLiked(token,publication_id): Observable<any> {
       
        let headers = new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url+ 'usersLiked/'+publication_id, { headers: headers });
    }
    
}