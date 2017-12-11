import { Component, AfterViewInit, ViewChild, SimpleChanges, Input, ElementRef, EventEmitter, Output, OnChanges } from '@angular/core';

import * as joint from 'jointjs';

@Component ({
    selector: 'drawing-board',
    styleUrls: ['./drawing-board.component.less'],
    templateUrl: './drawing-board.component.html'
})

export class DrawingBoardComponent implements AfterViewInit, OnChanges {

    @Input() read;
    @Input() service;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    @Output() dblclick = new EventEmitter<string>();
    @Output() link = new EventEmitter<any>();

    private positionMap: any = {};
    private objectMap: any = {};
    private links: any = {};

    private svg: any;
    private board: any;

    private increment = 1;
    private containers = 0;

    private containerIconMap = {};

    public IMAGES_URL = {
        openshift: 'https://cdn.iconscout.com/public/images/icon/free/png-128/openshift-company-brand-logo-34e2356e162dd5df-128x128.png',
        aws: 'http://icons.iconarchive.com/icons/uiconstock/socialmedia/128/AWS-icon.png'
    };

    // @ViewChild('canvasElement') canvasEl: ElementRef;
    @ViewChild('boardContainer') boardContainer: ElementRef;

    private graph: joint.dia.Graph;
    private paper: joint.dia.Paper;
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
        this.appInit();
    }

    private appInit(): void {
        this.graph = new joint.dia.Graph;
        const arrowheadShape = 'M 10 0 L 0 5 L 10 10 z';
        this.paper = new joint.dia.Paper({
            el: this.boardContainer.nativeElement,
            width: 500,
            height: 500,
            gridSize: 1,
            model: this.graph,
            defaultLink: new joint.shapes.devs.Link({
                attrs: {
                    '.marker-target': {
                        d: arrowheadShape
                    }
                }
            })
        });

        /** Trial */

        this.graph.on('change:source change:target', (link) => {
            const sourcePort = link.get('source').port;
            const sourceId = link.get('source').id;
            const targetPort = link.get('target').port;
            const targetId = link.get('target').id;
            if (sourceId && targetId) {
                // event.stopPropagation();
                console.log(sourceId, targetId);
                this.links[sourceId] = targetId;
                this.link.emit(this.links);
            }
        });

        this.paper.on('cell:pointerdown', (event) => {
            if (event && event.model && event.model.id) {
                const config: any = this.objectMap[event.model.id];
                if (config) {
                    if (config.type === 'indicator') {
                        this.handleCallback('click', config, config.name);
                    }
                }
            }
        });
        this.paper.on('cell:pointerdblclick', (event) => {
            if (event && event.model && event.model.id) {
                const config: any = this.objectMap[event.model.id];
                if (config) {
                    if (config.type === 'element') {
                        config['modelId'] = event.model.id;
                        config['service'] = event.model.attributes.attrs.text.text;
                        
                        this.handleCallback('dblclick', config, config.name);
                    }
                }
            }
        });
        /** Trial */

        this.initBoard();

        if (this.read) {
            this.handleReadMode();
        }
    }

    private handleReadMode(): void {
        let square = [
            {
                x1: 50,
                y1: 50,
                width: 100,
                height: 100,
                options: {
                    stroke: '#000'
                },
                name: 'sq-' + this.increment ++,
                type: 'element',
                shape: 'square',
                read: {
                    config: {
                        links: ''
                    }
                }
            }, {
                x1: 50,
                y1: 50,
                width: 100,
                height: 100,
                options: {
                    stroke: '#000'
                },
                name: 'sq-' + this.increment ++,
                type: 'element',
                shape: 'square',
                read: {
                    config: {
                        links: ''
                    }
                }
            }
        ];

        const containersCount: number = this.read.containers.length;

        for (let i = 0; i < containersCount; ++ i) {
            ((counter) => {
                square[i].x1 = square[0].x1 + (i * square[0].width + (75 * i));
                square[i]['read'] = this.read.containers[i];
                this.drawShape(square[i]);
            })(i);
        }

        console.log(square);
        // Link arrows

        let idMap: any = {};

        let connections: any = {};
        idMap = {};
        for (let i in this.objectMap) {
            if (this.objectMap.hasOwnProperty(i)) {
                const name: string = this.objectMap[i].name;
                
                for (let j in square) {
                    if (square[j].name === name) {
                        let read: any = square[j].read;
                        idMap[read.id] = {};
                        console.log(read.id);
                        idMap[read.id]['linkId'] = read.config.links;
                        idMap[read.id]['id'] = read.id;
                        idMap[read.id]['vendorId'] = i;
                    }
                }
            }
        }

        for (let id in idMap) {
            if (idMap.hasOwnProperty(id)) {
                let curr = idMap[id];
                connections[curr.vendorId] = idMap[curr.linkId] ? idMap[curr.linkId].vendorId : null;
                if (curr.vendorId && connections[curr.vendorId]) {
                    let link = new joint.shapes.devs.Link({
                        source: {
                            id: curr.vendorId,
                            port: 'out'
                        },
                        target: {
                            id: connections[curr.vendorId],
                            port: 'in'
                        }
                    });
                    this.graph.addCell(link);
                }
            }
        }
        console.log(connections);




        // let link = new joint.shapes.devs.Link({
        //     source: {
        //     id: srcModel.id,
        //     port: 'out'
        //     },
        //     target: {
        //     id: dstModel.id,
        //     port: 'in'
        //     }
        // });
        // this.graph.addCell(link);

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
        } else if (eventType === 'dblclick') {
            console.log(config.modelId);
            this.dblclick.emit(config);
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
        if (config.type === 'indicator') {
            if (config.shape === 'square') {
                const rect = new joint.shapes.basic.Rect({
                    position: { x: 10, y: 10 },
                    size: { width: 30, height: 30 },
                    attrs: { rect: { fill: '#fff', stroke: '#000' } }
                });
                this.objectMap[rect.id] = {
                    type: config.type,
                    name: config.name,
                    shape: config.shape,
                    config: config
                };
                this.graph.addCell(rect);
            }
        } else {
            const square = new joint.shapes.devs.Model({
                position: { x: x1, y: y1 },
                size: { width: width, height: height },
                inPorts: ['1'],
                outPorts: ['2'],
                ports: {
                    groups: {
                        'in': {
                            attrs: {
                                '.port-body': {
                                    fill: '#5f56f1',
                                    r: 5,
                                }
                            }
                        },
                        'out': {
                            attrs: {
                                '.port-body': {
                                    fill: '#5f56f1',
                                    r: 5,
                                }
                            }
                        }
                    }
                },
                attrs: {
                    rect: { fill: '#fff' },
                    text: { text: config.read && config.read.name || ('Service' + ++ this.containers) }
                }
            });
            // let notification = new joint.shapes.basic.Rect({
            //     position: { x: x1 + width - 10, y: y1 },
            //     size: { width: 20, height: 20 },
            //     attrs: { text: { text: '', fill: '#fff' }, rect: { fill: 'ORANGE' } }
            // });
            // notification = null;

            // Set the increment based on the existing containers

            if (config.read && config.read.name) {
                const num = Number(config.read.name.split('Service')[1].trim() || '0');
                this.containers = num;
            }
            
            console.log('$$$');
            console.log(config);
            let arr: Array<any> = [square];
            if (config.read && config.read.notification && config.read.notification.value) {
                let notification = new joint.shapes.basic.Rect({
                    position: { x: x1 + width - 10, y: y1 },
                    size: { width: 20, height: 20 },
                    attrs: { text: { text: `${config.read.notification.value}`, fill: '#fff' }, rect: { fill: 'ORANGE' } }
                });
                // square.embed(notification);
                arr.push(notification);
            }

            if (config.read && config.read.config && config.read.config.dataset && config.read.config.dataset.sentence) {
                let imageUrl: string = this.IMAGES_URL.openshift;
                
                if (config.read.config.dataset.sentence.indexOf('aws') !== -1) {
                    imageUrl = this.IMAGES_URL.aws;
                }
                const params = {
                    x: x1 + ((width / 2) - 20),
                    y: y1 + ((height / 2) - 20),
                    width: 40,
                    height: 40,
                    modelId: config['modelId'] || square.id
                };
                const image = this.createImage(imageUrl, params, true);
                arr.push(image);
            }
            this.graph.addCell(arr);

            // square.embed(notification);
            this.objectMap[square.id] = {
                type: config.type,
                name: config.name,
                shape: config.shape,
                config: config
            };
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

    private addImage(modelId: string, name: string): void {
        let element = this.getElement(modelId);
        if (element) {
            const {width, height} = element.attributes.size;
            const {x: xPos, y: yPos} = element.attributes.position;
            let imageUrl: string = this.IMAGES_URL.openshift;
            if (name === 'aws') {
                imageUrl = this.IMAGES_URL.aws;
            }
            const config = {
                x: xPos + ((width / 2) - 20),
                y: yPos + ((height / 2) - 20),
                width: 40,
                height: 40,
                modelId: modelId
            };
            this.createImage(imageUrl, config);
        }
        console.log(element);
    }

    private deleteElement (modelId: string): void {
        let element = this.getElement(modelId);
        if (element) {
            element.remove();
        }
    }

    private createImage(url: string, config: any, needsReturn?: boolean): any {
        if (config.modelId) {
            if (this.containerIconMap[config.modelId]) {
                this.deleteElement(this.containerIconMap[config.modelId]);
            }
        }
        const image = new joint.shapes.basic.Image({
            position : {
                x: config.x,
                y: config.y
            },
            size : {
                width : config.width,
                height : config.height
            },
            attrs : {
                image : {
                    'xlink:href' : url,
                    width : config.width,
                    height : config.height
                }
            }
        });
        this.containerIconMap[config.modelId] = image.id;
        if (needsReturn) {
            return image;
        } else {
            this.graph.addCell(image);
            return;
        }
    }

    private getElement(modelId: string): any {
        const elements = this.graph.getCells();
        for (let e of elements) {
            if (e.id === modelId) {
                return e;
            }
        }
    }

    private updateLabel(modelId: string, text: string): void {
        let element = this.getElement(modelId);
        if (element) {
            element.attr('text/text', text);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        
        if (changes['read'] && changes['read'].currentValue) {
            this.appInit();
        }
        if (changes['service'] && changes['service'].currentValue) {
            if (this.service.name) {
                this.addImage(this.service.modelId, this.service.name);
            }
            if (this.service.containerName) {
                this.updateLabel(this.service.modelId, this.service.containerName);
            }
        }
    }
}

