import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class Characters {
  /**
   * Servicio para obtener los personajes de la API externa.
   */
  private templateUrl:string = '';
  constructor(private api:Api){}

  async getCharacters(){
    this.templateUrl = `${environment.baseUrl}${environment.characters}`;
     return this.api.getApiCall(this.templateUrl);
  }

  async getDetails(id:string){
    this.templateUrl = `${environment.baseUrl}${environment.id}${id}.json`;
    return await this.api.getApiCall(this.templateUrl);
  }
  
}


