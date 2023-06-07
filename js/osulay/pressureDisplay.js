

const updateSpeed = 2.5;
const lineWidth = 3;



class Line {
    constructor(center, y, width, color) {
        this.center = center;
        this.y = y;
        this.width = width;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.center - this.width / 2, this.y - lineWidth/2);
        ctx.lineTo(this.center + this.width / 2, this.y - lineWidth/2);
        ctx.strokeStyle = "#4fb069";
        ctx.lineWidth = lineWidth;
        ctx.stroke(); 
    }

    update() {
        this.y -= updateSpeed;
        if(this.y < 0) {
            lines.splice(lines.indexOf(this), 1);
        }
    }

}