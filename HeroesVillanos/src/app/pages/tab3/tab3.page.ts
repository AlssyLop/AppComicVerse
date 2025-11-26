import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText, FormsModule, CommonModule],
})
export class Tab3Page {
  darkMode: boolean = false;
  selectedLanguage: string = 'en';

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    const settings = localStorage.getItem('appSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.darkMode = parsed.darkMode || false;
      this.selectedLanguage = parsed.language || 'en';
    }
  }

  saveSettings() {
    const settings = {
      darkMode: this.darkMode,
      language: this.selectedLanguage
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  onDarkModeChange() {
    this.saveSettings();
  }

  onLanguageChange() {
    this.saveSettings();
  }

  clearFavorites() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      localStorage.removeItem('favoriteCharacters');
      alert('Favoritos eliminados');
    }
  }
}
