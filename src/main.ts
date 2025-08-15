import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewFlatComponent } from './app/features/flats/new-flat/new-flat.component';

bootstrapApplication(NewFlatComponent, {
  providers: [importProvidersFrom(CommonModule, FormsModule)]
});
