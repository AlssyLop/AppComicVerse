import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(){}

  
  async getApiCall(templateUrl:string){
    try{
      // Using the proxy path instead of direct API call
      const response = await fetch(templateUrl);
      if(!response.ok){
        throw new Error('Petición fallida: ' + templateUrl);
      }
      return await response.json();
    }catch(error){
      console.log("Error obteniendo la informacion de " + templateUrl, error);
    }    
  }
}