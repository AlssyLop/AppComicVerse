import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared-module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Characters } from '../../core/services/characters';
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
  IonButton, IonLabel, IonItem, IonAlert, IonChip, IonSelect, IonIcon
} from '@ionic/angular/standalone';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss'],
  imports: [IonButton, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonIcon, IonSelectOption, IonSelect, IonHeader, IonChip, IonToolbar, IonSearchbar, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardContent, IonCol, IonGrid, IonImg, IonRow, SharedModule, FormsModule, CommonModule],
})

export class ExplorePage {
  selectedUniverse: string[] = [];
  universeList: string[] = [];
  selectedAffiliation: string[] = [];
  affiliationList: string[] = [];
  selectedPower: string[] = [];
  mainPowerList: string[] = [];
  charactersArray: Character[] = [];
  dataArray: Character[] = [];
  filterCharacters: Character[] = [];
  auxCharacters: Character[] = [];
  maxNumberOfCharactersToDisplay: number = 20;
  loadedCharacters: number = 0;
  orderRatingAsc: boolean = true;
  orderAlphaAsc: boolean = true;
  favoriteIds: Set<number> = new Set();
  private lastScrollTop: number = 0;
  private scrollThreshold: number = 50;

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonAccordionGroup) accordionGroup!: IonAccordionGroup;

  constructor(private characters: Characters, private loadingCtrl: LoadingController, private router: Router) {

  }

  async ngOnInit() {
    this.loadFavorites();
    await this.prepareCharacterDisplayData();
    this.generarRangoAleatorioSinRepeticion();
    await this.getCharacters();
    this.setupScrollListener();
  }

  ionViewWillEnter() {
    // Reload favorites when tab becomes active to sync with Tab2 changes
    this.loadFavorites();
  }

  private loadFavorites() {
    const storedFavorites = localStorage.getItem('favoriteCharacters');
    if (storedFavorites) {
      const favorites: Character[] = JSON.parse(storedFavorites);
      this.favoriteIds = new Set(favorites.map(char => char.id));
    } else {
      this.favoriteIds = new Set();
    }
  }

  private setupScrollListener() {
    this.content.ionScroll.subscribe((event: any) => {
      const scrollTop = event.detail.scrollTop;

      // Collapse accordion when scrolling down past threshold
      if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
        // Scrolling down - collapse accordion
        if (this.accordionGroup) {
          this.accordionGroup.value = undefined;
        }
      }

      this.lastScrollTop = scrollTop;
    });
  }

  private async prepareCharacterDisplayData(): Promise<void> {
    for (const char of await this.characters.getCharacters()) {
      const afiliation = { "-": "Neutral", "neutral": "Neutral", "good": "Hero", "bad": "Villain" };

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

    for (const [powerkey, value] of entries) {
      ratingPower += value;
      if (value > aux) {
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

  async getCharacters(event?: InfiniteScrollCustomEvent) {
    if (this.filterCharacters.length != 0) {
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

  searchCharacters(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;

    if (searchTerm && searchTerm.length > 0) {
      // Determine base array: use filtered results if filters are active, otherwise use all data
      const baseArray = this.filterCharacters.length > 0
        ? this.filterCharacters
        : this.dataArray;

      // Filter by search term
      let filteredCharacters = baseArray.filter(character =>
        character.name.toLowerCase().includes(searchTerm)
      );

      // Sort by relevance (names starting with search term first)
      filteredCharacters.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const startsWithA = nameA.startsWith(searchTerm);
        const startsWithB = nameB.startsWith(searchTerm);

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return nameA.localeCompare(nameB);
      });

      this.auxCharacters = filteredCharacters;
      this.charactersArray = [...filteredCharacters.slice(0, 20)];
    } else {
      // No search term: restore filtered results or all data
      if (this.filterCharacters.length > 0) {
        this.auxCharacters = this.filterCharacters;
        this.charactersArray = [...this.filterCharacters.slice(0, 20)];
      } else {
        this.generarRangoAleatorioSinRepeticion();
        this.charactersArray = [...this.auxCharacters.slice(0, 20)];
      }
    }

    this.content.scrollToTop(500);
  }

  private generarRangoAleatorioSinRepeticion() {

    // Barajar el array (Algoritmo de Fisher-Yates shuffle)
    for (let i = this.dataArray.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [this.dataArray[i], this.dataArray[j]] = [this.dataArray[j], this.dataArray[i]];
    }
    this.auxCharacters = this.dataArray;
  }

  /**
   * Centralized method to apply all active filters
   * Combines Universe, Affiliation, and Power filters with AND/OR logic
   */
  private applyAllFilters() {
    let result = [...this.dataArray]; // Start from complete dataset

    // Filter 1: Universe (OR logic - match any selected universe)
    if (this.selectedUniverse.length > 0 && this.selectedUniverse[0] !== '') {
      result = result.filter(char =>
        this.selectedUniverse.some(universe => char.universe.includes(universe))
      );
    }

    // Filter 2: Affiliation (OR logic - match any selected affiliation)
    if (this.selectedAffiliation.length > 0 && this.selectedAffiliation[0] !== '') {
      result = result.filter(char =>
        this.selectedAffiliation.some(affiliation => char.afiliation.includes(affiliation))
      );
    }

    // Filter 3: Power (OR logic - match any selected power)
    if (this.selectedPower.length > 0 && this.selectedPower[0] !== '') {
      result = result.filter(char =>
        this.selectedPower.some(power => char.mainPower.includes(power))
      );
    }

    // Update arrays
    this.filterCharacters = result;
    this.auxCharacters = result;
    this.maxNumberOfCharactersToDisplay = 40;
    this.loadedCharacters = 20;
    this.charactersArray = [...result.slice(0, 20)];
    this.content.scrollToTop(500);
  }

  filterByUniverse(event: Event) {
    const text: string = JSON.stringify((event.target as HTMLIonSelectElement).value);
    this.selectedUniverse = text.replace(/"/g, '').replace("[", "").replace("]", "").split(',');
    this.applyAllFilters();
  }

  filterByAffiliation(event: Event) {
    const text: string = JSON.stringify((event.target as HTMLIonSelectElement).value);
    this.selectedAffiliation = text.replace(/"/g, '').replace("[", "").replace("]", "").split(',');
    this.applyAllFilters();
  }

  filterByMainPower(event: Event) {
    const text: string = JSON.stringify((event.target as HTMLIonSelectElement).value);
    this.selectedPower = text.replace(/"/g, '').replace("[", "").replace("]", "").split(',');
    this.applyAllFilters();
  }








  orderByRating() {
    let sortedCharacters: Character[] = [];
    if (this.filterCharacters.length != 0) {
      sortedCharacters = this.filterCharacters = this.filterCharacters.sort((a, b) => {
        if (this.orderRatingAsc) {
          return +a.ratingPower - +b.ratingPower;
        } else {
          return +b.ratingPower - +a.ratingPower;
        }
      });
    } else {
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

  orderByAlphabet() {
    let sortedCharacters: Character[] = [];
    if (this.filterCharacters.length != 0) {
      sortedCharacters = this.filterCharacters = this.filterCharacters.sort((a, b) => {
        if (this.orderAlphaAsc) {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    } else {
      sortedCharacters = this.auxCharacters = this.auxCharacters.sort((a, b) => {
        if (this.orderAlphaAsc) {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    }
    this.orderAlphaAsc = !this.orderAlphaAsc;
    this.content.scrollToTop(500);
    this.charactersArray = [...sortedCharacters.slice(0, 20)];
    console.log(this.charactersArray);
  }

  toggleFavorite(character: Character, event: Event) {
    event.stopPropagation();

    if (this.favoriteIds.has(character.id)) {
      this.favoriteIds.delete(character.id);
    } else {
      this.favoriteIds.add(character.id);
    }

    // Obtener todos los personajes favoritos completos
    const allCharacters = [...this.dataArray, ...this.auxCharacters];
    const uniqueCharacters = Array.from(new Map(allCharacters.map(char => [char.id, char])).values());
    const favoriteCharacters = uniqueCharacters.filter(char => this.favoriteIds.has(char.id));

    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteCharacters));
  }

  isFavorite(characterId: number): boolean {
    return this.favoriteIds.has(characterId);
  }

  clearFilters() {
    this.selectedUniverse = [];
    this.selectedAffiliation = [];
    this.selectedPower = [];
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