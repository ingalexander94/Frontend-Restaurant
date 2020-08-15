import { environment } from 'src/environments/environment.prod'

// Realizar peticiones al servidor backend sin un TOKEN
const fetchWithoutToken = async (endpoint:string, method: string = "GET", payload: any): Promise<any> => {
   if(method === "GET"){
    return await fetch(`${environment.url}/${endpoint}`);
   }
   return await fetch(`${environment.url}/${endpoint}`, {
    method,
    headers: {
        "Content-type": "application/json",
    },
    body: JSON.stringify(payload)
});
}

// Realizar peticiones al servidor backend con un TOKEN
const fetchWithToken = async (endpoint:string, method: string = "GET", payload: any = null): Promise<any> => {
    const token = localStorage.getItem("token") || "";
    if(method === "GET"){
     return await fetch(`${environment.url}/${endpoint}`, {
         headers: {
            "Content-Type": "application/json",
            "x-token" : token
         }
     });
    }
    return await fetch(`${environment.url}/${endpoint}`, {
     method,
     headers: {
         "Content-type": "application/json",
         "x-token" : token
     },
     body: JSON.stringify(payload)
 });
 }

export {
    fetchWithoutToken,
    fetchWithToken
}