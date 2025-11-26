import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonRow, IonCol, IonGrid, IonImg, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Character } from 'src/app/models/character.model';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonRow, IonCol, IonGrid, IonImg, IonButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, CommonModule, IonCardHeader, IonCardTitle]
})
export class Tab2Page implements OnInit {
  favoriteCharacters: Character[] = [];
  
  @ViewChild(IonContent) content!: IonContent;

  constructor(private router: Router, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.loadFavorites();
  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    // Cargar favoritos del localStorage
    const storedFavorites = localStorage.getItem('favoriteCharacters');
    if (storedFavorites) {
      this.favoriteCharacters = JSON.parse(storedFavorites);
    } else {
      this.favoriteCharacters = [];
    }
  }

  removeFavorite(characterId: number) {
    this.favoriteCharacters = this.favoriteCharacters.filter(char => char.id !== characterId);
    localStorage.setItem('favoriteCharacters', JSON.stringify(this.favoriteCharacters));
  }

  countByAffiliation(affiliation: string): number {
    return this.favoriteCharacters.filter(char => char.afiliation === affiliation).length;
  }

  getFavorites(event?: any) {
    setTimeout(() => {
      event?.target.complete();
    }, 2000);
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
