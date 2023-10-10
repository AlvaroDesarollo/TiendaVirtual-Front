import { NgModule } from '@angular/core';
import { MonedaPipe } from './moneda.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [MonedaPipe, SafePipe],
  exports: [SafePipe],
})
export class PipesModule {}
