import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Characters } from '../core/services/characters';



@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule, RouterModule
  ],
  providers:[Characters]
})
export class SharedModule { }
