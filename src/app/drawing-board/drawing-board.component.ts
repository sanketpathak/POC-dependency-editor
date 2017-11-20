import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component ({
    selector: 'drawing-board',
    styleUrls: ['./drawing-board.component.less'],
    templateUrl: './drawing-board.component.html'
})

export class DrawingBoardComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private positionMap: any = {};

    private svg: any;

    // @ViewChild('canvasElement') canvasEl: ElementRef;
    @ViewChild('svgElement') svgEl: ElementRef;
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

        this.svg = d3.select('#svg');
        console.log(this.svg);
        this.initBoard();
    }

    private handleCallback(eventType: string, config: any, identifier: string): void {

    }

    private checkWhich(event: MouseEvent): Function {
        return () => {
            const x: number = event.offsetX;
            const y: number = event.offsetY;

            for (const i in this.positionMap) {
                if (this.positionMap.hasOwnProperty(i)) {
                    const element: any = this.positionMap[i];
                    const position: any = element['position'];
                    
                    if (x >= position['x1'] && x <= position['x2']) {
                        if (y >= position['y1'] && y <= position['y2']) {
                            console.log('Yes');
                            console.log(event);
                            console.log(element);
                            this.handleCallback('click', element, i);
                        }
                    }
                }
            }
        };
    }

    private handleEvent(): void {
        if (this.canvas) {
            this.canvas.addEventListener('click', (event) => {
                this.checkWhich(event)();
            });
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
                name: 'sq-1',
                type: 'indicator',
                shape: 'square'
            },
            'arrow': {
                x1: 50,
                y1: 20,
                x2: 70,
                y2: 20,
                direction: 'right',
                name: 'ar-1',
                type: 'indicator',
                options: {
                    stroke: '#000',
                    fill: '#000'
                },
                shape: 'arrow'
            }
        };
        this.drawShape(config['square']);
        this.drawShape(config['arrow']);
    }

    private square(x1: number, y1: number, width: number, height: number, config?: any): void {
        this.context.fillStyle = config.fill || null;
        this.context.strokeStyle = config.stroke || null;
        // this.context.lineWidth = 10;
        if (config.fill) {
            this.context.fillRect(x1, y1, width, height);
        } else if (config.stroke) {
            this.context.strokeRect(x1, y1, width, height);
        }
    }

    private arrow(x1: number, y1: number, x2: number, y2: number, direction?: string, options?: any): void {
        // if (!direction) direction = 'right';

        const ctx: CanvasRenderingContext2D = this.context;

        const lineLength: number = x2 - x1;
        const arrowRadius: number = Math.ceil(lineLength / 10);

        ctx.beginPath();
        ctx.strokeStyle = options.stroke || '#000';
        ctx.fillStyle = options.fill || '#000';

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // ctx.lineTo(x2 - arrowRadius, y2 - arrowRadius);
        // ctx.arcTo(x2, y2, x2 - arrowRadius, x2 + arrowRadius, arrowRadius + 10);

        // ctx.lineTo(x2, y2);

        ctx.stroke();
        ctx.fill();
    }

    drawShape(config: any): void {
        let flag = true;
        switch (config.shape) {
            case 'square':
                this.square(config.x1, config.y1, config.width, config.height, config.options);
                break;
            case 'arrow':
                this.arrow(config.x1, config.y1, config.x2, config.y2, config.direction, config.options);
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

