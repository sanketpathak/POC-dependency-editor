import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Raphael from 'raphael';

import * as joint from 'jointjs/dist/joint.js';
import * as $ from 'jquery';

@Component ({
    selector: 'drawing-board',
    styleUrls: ['./drawing-board.component.less'],
    templateUrl: './drawing-board.component.html'
})

export class DrawingBoardComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private positionMap: any = {};
    private objectMap: any = {};

    private svg: any;
    private board: Raphael;

    private increment = 1;

    // @ViewChild('canvasElement') canvasEl: ElementRef;
    @ViewChild('boardContainer') boardContainer: ElementRef;
    constructor() {}

    ngAfterViewInit(): void {
        // this.canvas = <HTMLCanvasElement> document.getElementById('c');
        // this.canvas.width = this.canvas.offsetWidth;
        // this.canvas.height = this.canvas.offsetHeight;
        // this.handleEvent();
        // if (this.canvas.getContext) {
        //     this.context = this.canvas.getContext('2d');
        //     this.initBoard();
        // }

        // this.board = new Raphael(this.boardContainer.nativeElement, 1000, 500);
        const graph = new joint.dia.Graph;
        this.board = new joint.dia.Paper({
            width: 400,
            height: 400,
            gridSize: 1,
            interactive: false
        });
           
        this.initBoard();
    }

    private handleCallback(eventType: string, config: any, identifier: string): void {
        if (eventType === 'click') {
            switch (config.shape) {
                case 'square':
                    const c: any = {
                        x1: 50,
                        y1: 50,
                        width: 100,
                        height: 100,
                        options: {
                            stroke: '#000'
                        },
                        name: 'sq-' + this.increment ++,
                        type: 'element',
                        shape: 'square'
                    };
                    this.drawShape(c);
                    break;
                case 'arrow':
                    const a: any = {
                        x1: 50,
                        y1: 50,
                        x2: 100,
                        y2: 50,
                        options: {
                            stroke: '#000'
                        },
                        name: 'ar',
                        type: 'element',
                        shape: 'arrow'
                    };
                    this.drawShape(a);
                    break;
            }
        }
    }

    private initBoard(): void {
        const config: any = {
            'square': {
                x1: 10,
                y1: 10,
                width: 20,
                height: 20,
                options: {
                    stroke: '#000'
                },
                name: 'sq-ind',
                type: 'indicator',
                shape: 'square'
            },
            'arrow': {
                x1: 50,
                y1: 10,
                x2: 70,
                y2: 10,
                direction: 'right',
                name: 'ar-ind',
                type: 'indicator',
                options: {
                    stroke: '#000',
                    fill: '#000'
                },
                shape: 'arrow'
            }
        };
        this.drawShape(config['square']);
        // this.drawShape(config['arrow']);
    }

    private square(x1: number, y1: number, width: number, height: number, config?: any): void {
        let rect = this.board.rect(x1, y1, width, height);
        rect.attr({
            'fill': '#fff',
            'stroke': '#000',
            'class': config.name
        });
        rect.id = config.name;
        if (config.type === 'indicator') {
            rect.click((event) => {
                console.log(event);
                this.handleCallback('click', config, config.name);
            });
        } else {
            rect.drag(function(dx, dy) {
                // Move
                console.log('Move', dx, dy);
                this.attr({x: this.ox + dx, y: this.oy + dy});
            }, function() {
                // Start
                console.log('Start', this);
                this.ox = this.attr('x');
                this.oy = this.attr('y');
            }, function() {
                // Up
                console.log('Up', this);
            });
            this.objectMap[config.name] = rect;
            if (Object.keys(this.objectMap).length > 1) {
                this.join('sq-1', 'sq-2');
            }
        }
    }

    private arrow(x1: number, y1: number, x2: number, y2: number, direction?: string, config?: any): void {
        
    }

    private join(from: string, to: string): void {
        const first = this.objectMap[from];
        const second = this.objectMap[to];

        if (first && second) {
            const link1 = new joint.dia.Link({
                source: first,
                target: second,
                attrs:  {
                    '.connection': { 'stroke-width': 2 },
                    '.marker-source': { d: 'M 0 0 a 5 5 0 1 0 0 1', 'stroke-width': 0, fill: '#232E78' },
                    '.marker-target': { d: 'M 10 -5 10 5 0 0 z', 'stroke-width': 0, fill: '#232E78' }
                }
            });
        }
    }

    drawShape(config: any): void {
        let flag = true;
        switch (config.shape) {
            case 'square':
                this.square(config.x1, config.y1, config.width, config.height, config);
                break;
            case 'arrow':
                this.arrow(config.x1, config.y1, config.x2, config.y2, config.direction, config);
                break;
            default:
                flag = false;
                break;
        }
        if (flag) {
            this.positionMap[config.name] = config;
            this.positionMap[config.name]['position'] = {
                x1: config.x1,
                y1: config.y1,
                x2: config.x2 ? config.x2 : config.x1 + config.width,
                y2: config.y2 ? config.y2 : config.y1 + config.height
            };
        }
    }
}

