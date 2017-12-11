import { Component } from '@angular/core';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.less'],
  providers: [AppService],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app works!';

  public read: any;

  constructor(private appService: AppService) {
    this.appService.readConfiguration().subscribe((result) => {
      this.read = result;
    });
  }
}
