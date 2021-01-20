import { Injectable } from '@angular/core'; //Exportar servicios
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Message } from '../models/message';

@Injectable()
export class MessageService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    //Enviar mensaje haciendo una petición POST con la ruta que hemos establecido en el API
    addMessage(token, message): Observable<any> {
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'message', params, { headers: headers });

    }
    //Recibir todos los mensajes listados mediante la petición GET a nuestra API
    getMyMessages(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'my-messages/' + page, { headers: headers });
    }

    //Listado de mensajes enviados por el usuario llamando con la petición GET la ruta establecida en nuestra API
    getEmmitMessages(token, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'messages/' + page, { headers: headers });
    }
}