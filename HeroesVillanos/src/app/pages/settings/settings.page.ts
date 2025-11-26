import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText, ToastController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonIcon, IonText, FormsModule, CommonModule],
})
export class SettingsPage implements OnInit {
  darkMode: boolean = false;
  selectedLanguage: string = 'en';
  appVersion: string = '1.0.0';
  appName: string = 'ComicVerse';

  constructor(private toastController: ToastController) { }

  ngOnInit() {
    this.loadSettings();
    this.applyDarkMode();
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

  applyDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  async onDarkModeChange() {
    this.saveSettings();
    this.applyDarkMode();

    const message = this.darkMode ? 'Dark mode enabled' : 'Light mode enabled';
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async onLanguageChange() {
    this.saveSettings();

    const languageName = this.selectedLanguage === 'en' ? 'English' : 'Español';
    const toast = await this.toastController.create({
      message: `Language changed to ${languageName}`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async clearFavorites() {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar todos los favoritos?');
    if (confirmed) {
      localStorage.removeItem('favoriteCharacters');

      const toast = await this.toastController.create({
        message: 'Favorites cleared successfully',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
    }
  }
}
