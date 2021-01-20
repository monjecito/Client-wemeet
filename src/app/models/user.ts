export class User{
    constructor(
        public _id:string,
        public name: string,
        public surname: String,
        public nick: string,                   //CREACION DE UNA ENTIDAD DE USUARIO
        public email: string,
        public password: string,
        public role: string,
        public image: string

    ){}
}