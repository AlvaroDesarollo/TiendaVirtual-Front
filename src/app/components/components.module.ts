import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';


import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { SafePipe } from '../pipes/safe.pipe';
import { AppModule } from '../app.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [HeaderComponent, ModalComponent],
  exports: [HeaderComponent, ModalComponent],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, PipesModule],
})
export class ComponentsModule {}
