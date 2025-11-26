import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText, IonRange } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText, IonRange, FormsModule, CommonModule],
})
export class Tab3Page {
  darkMode: boolean = false;
  selectedLanguage: string = 'en';
  fontSize: number = 16;

  constructor() {
    this.loadSettings();
    this.applyFontSize();
  }

  loadSettings() {
    const settings = localStorage.getItem('appSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.darkMode = parsed.darkMode || false;
      this.selectedLanguage = parsed.language || 'en';
      this.fontSize = parsed.fontSize || 16;
    }
  }

  saveSettings() {
    const settings = {
      darkMode: this.darkMode,
      language: this.selectedLanguage,
      fontSize: this.fontSize
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  onDarkModeChange() {
    this.saveSettings();
  }

  onLanguageChange() {
    this.saveSettings();
  }

  onFontSizeChange() {
    this.applyFontSize();
    this.saveSettings();
  }

  applyFontSize() {
    try {
      document.documentElement.style.setProperty('--app-font-size', `${this.fontSize}px`);
    } catch (e) {
      console.warn('Could not apply font size', e);
    }
  }

  clearFavorites() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      localStorage.removeItem('favoriteCharacters');
      alert('Favoritos eliminados');
    }
  }
}
