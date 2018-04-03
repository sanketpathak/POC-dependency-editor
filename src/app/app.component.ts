import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.less'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  githubUrl = 'https://github.com/sara-02/testquickstart1';
  boosterInfo = { 'mission': {
                      'id': 'rest-http'
                    },
                    'runtime': {
                      'id': 'vert.x',
                      'name': 'Eclipse Vert.x',
                      'version': 'redhat'
                    }
                  };
}
