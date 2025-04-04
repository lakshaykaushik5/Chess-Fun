export interface SignUpSchema{
    name:string;
    email:string;
    password:string;
}

export interface LogInSchema{
    email:string;
    password:string
}

export interface ApiSchema{
    success:boolean;
    message:string;
    data?:any[];
}