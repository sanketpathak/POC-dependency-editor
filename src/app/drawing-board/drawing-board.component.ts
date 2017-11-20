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
                        name: 'sq',
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
                name: 'sq-1',
                type: 'indicator',
                shape: 'square'
            },
            'arrow': {
                x1: 50,
                y1: 10,
                x2: 70,
                y2: 10,
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
        let g = this.svg
            .append('g')
            .classed('dragging', true);

        g   .append('rect')
            .attr('name', config.name)
            .attr('class', 'rectangle')
            .attr('width', width)
            .attr('height', height)
            .attr('id', 'arrow')
            .attr('fill', '#fff')
            .attr('stroke', config.options.stroke)
            .on('click', () => {
                if (config.type === 'indicator') {
                    this.handleCallback('click', config, config.name);
                }
            })
            .on('dblclick', function () {
                event.preventDefault();
                g   .append('text')
                    .attr('x', d3.event.x)
                    .attr('y', height / 2)
                    .attr('contentEditable', true)
                    .attr('dy', '.35em')
                    .text('Text here')
                    .on('keyup', function() { this.text = d3.select(this).text(); });
            })
            .call(d3 .drag()
                .on('start', function() {
                    console.log('start');
                })
                .on('drag', function(d) {
                    console.log(d3.event.x);
                    this.setAttribute('x', d3.event.x);
                    this.setAttribute('y', d3.event.y);
                    g.select('text').attr('x', d3.event.x + width / 2);
                    g.select('text').attr('y', d3.event.y + height / 2);
                })
            );
    }

    private arrow(x1: number, y1: number, x2: number, y2: number, direction?: string, config?: any): void {
        this.svg.append('line')
             .attr('x1', x1)
             .attr('y1', y1)
             .attr('x2', x2)
             .attr('y2', y2)
             .attr('stroke', config.options.stroke)
             .attr('stroke-width', 2)
             .attr('marker-end', 'url(#arrow)')
             .on('click', () => {
                if (config.type === 'indicator') {
                    this.handleCallback('click', config, config.name);
                }
            })
            .call(d3 .drag()
                .on('start', function() {
                    console.log('start');
                })
                .on('drag', function(d) {
                    console.log(d3.event.x);
                    const currentX = d3.event.x;
                    const currentY = d3.event.y;

                    this.setAttribute('x1', currentX);
                    this.setAttribute('x2', currentX + (x2 - x1));

                    this.setAttribute('y1', currentY);
                    this.setAttribute('y2', currentY + (y2 - y1));
                })
            );
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

