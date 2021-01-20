import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Publication } from '../models/publication';
import { stringify } from 'querystring';

@Injectable()
export class PublicationService {
    public url: string;
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    //Crear nuevas publicaciones
    addPublication(token, publication): Observable<any> {
        let params = JSON.stringify(publication);

        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'publication', params, { headers: headers });

    }

    //Mostrar las publicaciones de todos los usuarios a los que seguimos
    getPublications(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'publications/' + page, { headers: headers });


    }

    //Mostrar las publicaciones relativas al perfil de un solo usuario
    getPublicationsUser(token,user_id, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'publications-user/'+user_id +'/'+ page, { headers: headers });


    }

    //Eliminar la publicación escogida por su ID
    deletePublication(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.delete(this.url + 'publication/' + id, { headers: headers });
    }
}