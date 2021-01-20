import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
    public url: string;
    constructor() {
        this.url = GLOBAL.url;
    }


    //Petición clásica AYAX para almacenar la url de nuestro archivo en la BD.

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
        return new Promise(function (resolve, reject) {
            //Simular formulario
            var formData: any = new FormData();
            //Permitir realizar peticiones AYAX
            var xhr = new XMLHttpRequest();

            //Recorrer array de archivos para bindear con nuestra petición y añadir al formulario
            for (var i = 0; i < files.length; i++) {
                formData.append(name, files[i], files[i].name);
            }

            //Peticion AYAX
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        //Enviar respuesta correctamente
                        resolve(JSON.parse(xhr.response));
                    } else {
                        //Rechazar petición AYAX
                        reject(xhr.response);
                    }
                }
            }
            //Abrir petición con el método y la URL
            xhr.open('POST',url,true);
            xhr.setRequestHeader('Authorization',token);
            xhr.send(formData);
        });
    }
}