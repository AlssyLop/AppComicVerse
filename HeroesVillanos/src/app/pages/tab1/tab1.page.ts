import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared-module';
import { FormsModule } from '@angular/forms';
import {Characters} from '../../core/services/characters';
import MainPowers from '../../../assets/data/main-power.json';
import { Character } from 'src/app/models/character.model';
import { Powerstats } from 'src/app/models/powerstats.model';
import {
  IonSelectOption,
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
  IonAccordionGroup,
  LoadingController, 
  IonAccordion, 
  IonButtons, IonLabel, IonItem, IonAlert, IonChip, IonSelect, IonIcon
} from '@ionic/angular/standalone';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonIcon, IonSelectOption, IonSelect, IonHeader, IonChip, IonToolbar, IonSearchbar, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardContent, IonCol, IonGrid, IonImg, IonRow, SharedModule, FormsModule ],
})

export class Tab1Page {
  selectedUniverse: string []= [];
  universeList: string[] = [];
  selectedAffiliation: string = '';
  affiliationList: string[] = [];
  selectedPower: string = '';
  mainPowerList: string[] = [];
  charactersArray: Character[] = [];
  dataArray: Character[] = [];
  filterCharacters: Character[] = [];
  auxCharacters: Character[] = [];
  maxNumberOfCharactersToDisplay: number = 20;
  loadedCharacters: number = 0;
  orderRatingAsc:boolean = true;

  @ViewChild(IonContent) content!: IonContent;

  constructor(private characters: Characters, private loadingCtrl: LoadingController, private router: Router) {
    
  }

  async ngOnInit() {
    await this.prepareCharacterDisplayData();
    this.generarRangoAleatorioSinRepeticion();
    await this.getCharacters();
  }

  private async prepareCharacterDisplayData(): Promise<void> {
    for (const char of await this.characters.getCharacters()){
      const afiliation = {"-": "Neutral", "neutral": "Neutral", "good": "Hero", "bad": "Villain"};
      
      const powerstats: Powerstats = {
        intelligence: char.powerstats.intelligence,
        strength: char.powerstats.strength,
        speed: char.powerstats.speed,
        durability: char.powerstats.durability,
        power: char.powerstats.power,
        combat: char.powerstats.combat,
      };

      const mainPower: [string, string] = this.selectMainPower(powerstats);

      const character: Character = {
        name: char.name,
        mainPower: mainPower[1],
        ratingPower: mainPower[0],
        id: char.id,
        afiliation: afiliation[char.biography.alignment as keyof typeof afiliation],
        universe: char.biography.publisher || 'Other',
        appearance: char.appearance.race,
        weight: char.appearance.weight[1] || '',
        height: char.appearance.height[1] || '',
        groupAffiliation: char.connections.groupAffiliation || '',
        images: char.images.lg
      };
      this.dataArray.push(character);
    }
  }

  private selectMainPower(powerstats: Powerstats): [string, string] {
     
    let aux: number = 0, ratingPower: number = 0, powerstat: string = "", topTwoPowers: string[] = [];
    const entries = Object.entries(powerstats);

    for (const [powerkey, value] of entries){
      ratingPower += value;
      if (value > aux){
        aux = value;
        powerstat = powerkey;
      }
    }

    entries.sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([key, value]) => {
      topTwoPowers.push(key);
      ratingPower += value;
    });
    
    ratingPower /= 6;
    const powerKey = topTwoPowers.sort().join('_');
    const mainpower = (MainPowers as any)[powerKey] || powerstat;

    return [ratingPower.toFixed(2), mainpower];
  }

  async getCharacters(event?: InfiniteScrollCustomEvent){
    if (this.filterCharacters.length != 0){
      console.log("Filtering");
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
    if (this.selectedUniverse.length === 0 || this.selectedUniverse[0] === '' || this.selectedUniverse[0] === undefined){
      this.generarRangoAleatorioSinRepeticion();
    };
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);

    if (searchTerm && searchTerm.length > 0) {
      // Filtrar personajes por nombre
      let filteredCharacters: Character[] = this.filterCharacters;
      if (this.filterCharacters.length != 0 && this.selectedUniverse[0] != undefined){
        filteredCharacters = filteredCharacters.filter(character =>{
          return character.name.toLowerCase().includes(searchTerm);
        });
      }else{
        filteredCharacters =  this.auxCharacters
        filteredCharacters = this.auxCharacters.filter(character =>{
        return character.name.toLowerCase().includes(searchTerm);
        });
      }
      
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
      
      this.auxCharacters =  filteredCharacters;
      this.charactersArray = [...filteredCharacters.slice(0, 20)];
      this.content.scrollToTop(500);
    };
    this.filterCharacters = [];
    const range: Character[] = this.auxCharacters;
    this.charactersArray = [...range.slice(0, 20)];
    
  }

  private generarRangoAleatorioSinRepeticion() {

    // Barajar el array (Algoritmo de Fisher-Yates shuffle)
    for (let i = this.dataArray.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [this.dataArray[i], this.dataArray[j]] = [this.dataArray[j], this.dataArray[i]];
    }
    this.auxCharacters = this.dataArray;
  }



  filterByUniverse(event: Event) {
    this.filterCharacters = [];
    const text:string = JSON.stringify((event.target as HTMLIonSelectElement).value);
    this.selectedUniverse = text.replace(/"/g, '').replace("[", "").replace("]", "").split(',');
    let range : Character[] = []
    this.generarRangoAleatorioSinRepeticion();
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    if (this.selectedUniverse.length > 0 && this.selectedUniverse[0] != ''){
      for (const universe of this.selectedUniverse){
        
        this.filterCharacters.push(...this.auxCharacters.filter((character: Character) =>{
          return character.universe.includes(universe);
        }));
      }
      range = this.filterCharacters;
    }else{
      this.filterCharacters = []
      range = this.auxCharacters;
    }
    console.log(this.filterCharacters,  this.selectedUniverse);
    this.content.scrollToTop(500);
    this.charactersArray = [];
    this.charactersArray = [...range.slice(0, 20)];
    
  }


  filterByAffiliation() {
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    const filteredCharacters = this.auxCharacters.filter(character =>{
      return character.afiliation.includes(this.selectedAffiliation);
    });
    this.filterCharacters =  filteredCharacters;
    this.charactersArray = [...filteredCharacters.slice(0, 20)];
  }

  filterByMainPower() {
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    const filteredCharacters = this.auxCharacters.filter(character =>{
      return character.mainPower.includes(this.selectedPower);
    });
    this.filterCharacters =  filteredCharacters;
    this.charactersArray = [...filteredCharacters.slice(0, 20)];
  }








  orderByRating() {
    let sortedCharacters:Character[] = [];
    if (this.filterCharacters.length != 0){
       sortedCharacters = this.filterCharacters = this.filterCharacters.sort((a, b) => {
        if (this.orderRatingAsc) {
          return +a.ratingPower - +b.ratingPower;
        } else {
          return +b.ratingPower - +a.ratingPower;
        }
      }); 
    }else{
      sortedCharacters = this.auxCharacters = this.auxCharacters.sort((a, b) => {
        if (this.orderRatingAsc) {
          return +a.ratingPower - +b.ratingPower;
        } else {
          return +b.ratingPower - +a.ratingPower;
        }
      });
    }
    this.orderRatingAsc = !this.orderRatingAsc;
    this.content.scrollToTop(500);
    this.charactersArray = [...sortedCharacters.slice(0, 20)];
    console.log(this.charactersArray);
  }

  clearFilters(){
    this.selectedUniverse = [];
    this.selectedAffiliation = '';
    this.selectedPower = '';
    this.filterCharacters = [];
    this.generarRangoAleatorioSinRepeticion();
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    this.content.scrollToTop(500);
    this.charactersArray = [...this.auxCharacters.slice(0, 20)];
  }

  universesList(): string[] {
    for (const character of this.auxCharacters) {
      if (!this.universeList.includes(character.universe)) {
        this.universeList.push(character.universe);
      }
    }
    return this.universeList;
  }

  affiliationsList(): string[] {
    for (const character of this.auxCharacters) {
      if (!this.affiliationList.includes(character.afiliation)) {
        this.affiliationList.push(character.afiliation);
      }
    }
    return this.affiliationList;
  }

  mainPowersList(): string[] {
    for (const character of this.auxCharacters) {
      if (!this.mainPowerList.includes(character.mainPower)) {
        this.mainPowerList.push(character.mainPower);
      }
    }
    return this.mainPowerList;
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