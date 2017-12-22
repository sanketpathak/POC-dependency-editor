import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'dependency-editor',
    styleUrls: ['./dependency-editor.component.less'],
    templateUrl: './dependency-editor.component.html'
})
export class DependencyComponent {

    public selectedDependencies: any;

    public handlePackageSelection(event: any): void {
        if (!event.preventDefault) {
            this.selectedDependencies = event;
            console.log(this.selectedDependencies);
        }
    }

}
