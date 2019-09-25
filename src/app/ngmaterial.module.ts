import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatCardModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  imports: [MatButtonModule, MatToolbarModule, MatTableModule,
    MatCardModule, MatPaginatorModule, MatSortModule,
    MatProgressSpinnerModule, BrowserAnimationsModule, CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatTabsModule, MatChipsModule, MatIconModule, MatListModule,
    MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatSnackBarModule],
  exports: [MatButtonModule, MatToolbarModule, MatTableModule,
    MatCardModule, MatPaginatorModule, MatSortModule,
    MatProgressSpinnerModule, BrowserAnimationsModule, CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatTabsModule, MatChipsModule, MatIconModule, MatListModule,
    MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatSnackBarModule]
})
export class MaterialAppModule {
}
