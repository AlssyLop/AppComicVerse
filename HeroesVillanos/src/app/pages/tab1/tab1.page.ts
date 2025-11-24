import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared-module';
import { FormsModule } from '@angular/forms';
import {Characters} from '../../core/services/characters';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonImg,
  IonRow, 
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonCardSubtitle,
  IonLoading,
  LoadingController
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonHeader, IonCardSubtitle, IonToolbar, IonTitle, IonSearchbar, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardContent, IonCardTitle, IonCol, IonGrid, IonImg, IonRow, SharedModule, FormsModule ],
})

export class Tab1Page {
  charactersArray: Character[] = [];
  dataArray: Character[] = [];
  filterCharacters: Character[] = [];
  auxCharacters: Character[] = [];
  maxNumberOfCharactersToDisplay: number = 20;
  loadedCharacters: number = 0;

  constructor(private characters: Characters, private loadingCtrl: LoadingController, private router: Router) {
    
  }

  async ngOnInit() {
    for (const char of await this.characters.getCharacters()){
      const afiliation = {"-": "neutral", "good": "Hero", "bad": "Villain"};
      const character: Character = {
        name: char.name,
        id: char.id,
        afiliation: afiliation[char.biography.alignment as keyof typeof afiliation],
        universe: char.biography.publisher,
        firstAppearance: char.biography.firstAppearance,
        appearance: char.appearance.race,
        images: char.images.lg
      };
      this.dataArray.push(character);
    }
    this.generarRangoAleatorioSinRepeticion();
    await this.getCharacters();
  }

  async getCharacters(event?: InfiniteScrollCustomEvent){
    if (this.filterCharacters.length != 0){
      this.auxCharacters = this.filterCharacters;
    }

    for (let index = this.loadedCharacters; index < this.maxNumberOfCharactersToDisplay; index++) {
      if (index >= this.auxCharacters.length) {
        event?.target.complete();
        break;
      }
      this.charactersArray.push(this.auxCharacters[index]);
    }
    this.loadedCharacters = this.maxNumberOfCharactersToDisplay;
    this.maxNumberOfCharactersToDisplay += 20;
    setTimeout(() => {
        event?.target.complete();
      }, 2000);
  }

  searchCharacters(event: any){
    this.auxCharacters = this.dataArray;
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);
    if (searchTerm && searchTerm.length > 0) {
      // Filtrar personajes por nombre
      const filteredCharacters = this.auxCharacters.filter(character =>{
        return character.name.toLowerCase().includes(searchTerm);
      });
      
      filteredCharacters.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        const startsWithA = nameA.startsWith(searchTerm);
        const startsWithB = nameB.startsWith(searchTerm);

        // Prioridad 1: Si A empieza con la query y B no, A va primero.
        if (startsWithA && !startsWithB) {
            return -1; // A antes que B
        }
        // Prioridad 2: Si B empieza con la query y A no, B va primero.
        if (!startsWithA && startsWithB) {
            return 1; // B antes que A
        }

        return nameA.localeCompare(nameB);
      });
      
      this.filterCharacters =  filteredCharacters;
      this.charactersArray = [...filteredCharacters.slice(0, 20)];
    } else {
      // Si no hay término de búsqueda, mostrar todos los personajes
      this.filterCharacters = [];
      const range: any[] = this.auxCharacters;
      this.charactersArray = [...range.slice(0, 20)];
    }
  }

  private generarRangoAleatorioSinRepeticion() {

    // Barajar el array (Algoritmo de Fisher-Yates shuffle)
    for (let i = this.dataArray.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [this.dataArray[i], this.dataArray[j]] = [this.dataArray[j], this.dataArray[i]];
    }
    this.auxCharacters = [...this.dataArray];
  }

  async showLoading(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 7000,
    });
    this.router.navigate(['/character-details', id]).then(() => {
      loading.dismiss();
    });

    await loading.present();
  }
}



interface Character{
  id: number,
  name: string,
  afiliation: string,
  universe:string,
  firstAppearance: string,
  appearance: string,
  images: string
}