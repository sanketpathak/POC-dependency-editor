import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.less'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  githubUrl = 'https://github.com/sara-02/testquickstart1'; // 'https://github.com/openshiftio-vertx-boosters/vertx-crud-booster-redhat'
  boosterInfo = {};
}
