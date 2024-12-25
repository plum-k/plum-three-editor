import * as THREE from "three";

interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export default class TextSprite extends THREE.Object3D {
    texture: THREE.Texture;
    material: THREE.SpriteMaterial;
    sprite: THREE.Sprite;
    borderThickness: number = 4;
    fontface: string = 'Arial';
    fontsize: number = 28;
    borderColor: Color = {r: 0, g: 0, b: 0, a: 1.0};
    backgroundColor: Color = {r: 255, g: 255, b: 255, a: 1.0};
    textColor: Color = {r: 255, g: 255, b: 255, a: 1.0};
    text: string = '';

    constructor(text: string) {
        super();

        const texture = new THREE.Texture();
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        this.material = new THREE.SpriteMaterial({
            map: texture,
            depthTest: false,
            depthWrite: false
        });

        this.texture = texture;
        this.sprite = new THREE.Sprite(this.material);
        this.add(this.sprite);

        this.setText(text);
    }

    public setText(text: string): void {
        if (this.text !== text) {
            this.text = text;
            this.update();
        }
    }

    public setTextColor(color: Color): void {
        this.textColor = color;
        this.update();
    }

    public setBorderColor(color: Color): void {
        this.borderColor = color;
        this.update();
    }

    public setBackgroundColor(color: Color): void {
        this.backgroundColor = color;
        this.update();
    }

    update(): void {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        context.font = 'Bold ' + this.fontsize + 'px ' + this.fontface;

        // get size data (height depends only on font size)
        const metrics = context.measureText(this.text);
        const textWidth = metrics.width;
        const margin = 5;
        const spriteWidth = 2 * margin + textWidth + 2 * this.borderThickness;
        const spriteHeight = this.fontsize * 1.4 + 2 * this.borderThickness;

        context.canvas.width = spriteWidth;
        context.canvas.height = spriteHeight;
        context.font = 'Bold ' + this.fontsize + 'px ' + this.fontface;

        // background color
        context.fillStyle = `rgba(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b}, ${this.backgroundColor.a})`;
        // border color
        context.strokeStyle = `rgba(${this.borderColor.r}, ${this.borderColor.g}, ${this.borderColor.b}, ${this.borderColor.a})`;

        context.lineWidth = this.borderThickness;
        this.roundRect(context, this.borderThickness / 2, this.borderThickness / 2,
            textWidth + this.borderThickness + 2 * margin, this.fontsize * 1.4 + this.borderThickness, 6);

        // text color
        context.strokeStyle = 'rgba(0, 0, 0, 1.0)';
        context.strokeText(this.text, this.borderThickness + margin, this.fontsize + this.borderThickness);

        context.fillStyle = `rgba(${this.textColor.r}, ${this.textColor.g}, ${this.textColor.b}, ${this.textColor.a})`;
        context.fillText(this.text, this.borderThickness + margin, this.fontsize + this.borderThickness);

        const texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        this.sprite.material.map = texture;
        this.texture = texture;

        this.sprite.scale.set(spriteWidth * 0.01, spriteHeight * 0.01, 1.0);
    }

    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}