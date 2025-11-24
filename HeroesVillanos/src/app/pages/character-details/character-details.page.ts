import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Characters } from 'src/app/core/services/characters';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared-module';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.page.html',
  styleUrls: ['./character-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule]
})


export class CharacterDetailsPage implements OnInit {
  characterId: string = "";
  details: Details = {} as Details;
  public loaded: boolean = false;

  constructor(private characters: Characters, private route: ActivatedRoute) { 
    this.characterId = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    this.getDetails();
    this.cargarConRetraso();
  }


  async getDetails(){
    console.log('Getting details for character ID:', this.characterId);
    const detail = await this.characters.getDetails(this.characterId);
    this.details = {
      name: detail.name,
      aliases: detail.biography.aliases,
      firstAppearance: detail.biography.firstAppearance,
      placeOfBirth: detail.biography.placeOfBirth,
      fullName: detail.biography.fullName,
      occupation: detail.work.occupation,
      relatives: detail.connections.relatives,
      groupAffiliation: detail.connections.groupAffiliation,
      base: detail.work.base,
      image: detail.images.lg,
      intelligence: detail.powerstats.intelligence,
      strength: detail.powerstats.strength,
      speed: detail.powerstats.speed,
      durability: detail.powerstats.durability,
      power: detail.powerstats.power,
      combat: detail.powerstats.combat
    };

    for (const key in this.details) {
      if (this.details[key as keyof Details] === "-") {
        this.details[key as keyof Details] = "" as never;
      }
    }

    console.log('Details:', this.details);

  }

  cargarConRetraso() {
    console.log("Cargando...");
    setTimeout(() => {
      this.loaded = true;
    }, 1200); 
  }

}

interface Details {
  name:string;
  aliases: string[];
  firstAppearance: string;
  placeOfBirth: string;
  fullName: string;
  occupation: string;
  relatives: string;
  base: string;
  image: string;
  groupAffiliation: string;
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
  combat: string;
}

