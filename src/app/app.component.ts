import { Component } from '@angular/core';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-app';
  tiles: Tile[] = [
    {text: 'COVID-19', cols: 6, rows: 1},
    {text: 'Two', cols: 1, rows: 9},
    {text: 'Three', cols: 3, rows: 9},
    {text: 'Four', cols: 2, rows: 3},
    {text: 'Five', cols: 2, rows: 3},
    {text: 'Six', cols: 2, rows: 3},
  ];
}
