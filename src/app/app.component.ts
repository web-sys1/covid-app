import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private dataService: DataService, private spinner: NgxSpinnerService) {
    this.spinner.show();
    this.dataService.$dataLoaded.subscribe(() => {
      this.spinner.hide();
    })
  }

  ngOnInit(): void {
    this.dataService.init();
  }

}
