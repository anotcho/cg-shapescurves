class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        var pt0 = {x: 200, y:200};
		var pt1 = {x: 600, y:400};
		var color = [255,0,0,255];
		
		this.drawRectangle(pt0, pt1, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
		var cent = {x: 400, y:300};
		var rad = 200;
		var color = [255,0,0,255];
		
		this.drawCircle(cent, rad, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
		var pt0 = {x: 200, y:200};
		var pt1 = {x: 300, y:500};
		var pt2 = {x: 650, y:400};
		var pt3 = {x: 600, y:200};
		var color = [255,0,0,255];
		
		this.drawBezierCurve(pt0,pt1,pt2,pt3,color,framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {		
		this.drawLine({x: 100, y: 200}, {x: 100, y: 400}, [255,0,0,255],framebuffer);
		this.drawLine({x: 200, y: 200}, {x: 100, y: 400}, [255,0,0,255],framebuffer);
		this.drawLine({x: 200, y: 200}, {x: 200, y: 400}, [255,0,0,255],framebuffer);
		
		this.drawCircle({x: 285, y: 250}, 50, [200,150,0,255],framebuffer);
		
		this.drawLine({x: 400, y: 200}, {x: 400, y: 400}, [0,255,0,255],framebuffer);
		this.drawLine({x: 350, y: 300}, {x: 450, y: 300}, [0,255,0,255],framebuffer);
		
		this.drawBezierCurve({x: 465, y: 250}, {x: 460, y: 310}, {x: 565, y: 310}, {x: 565, y: 290}, [0,0,255,255],framebuffer);
		this.drawBezierCurve({x: 465, y: 250}, {x: 460, y: 190}, {x: 565, y: 190}, {x: 565, y: 210}, [0,0,255,255],framebuffer);
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        var xhold = right_top.x - left_bottom.x;
		var yhold = right_top.y - left_bottom.y;
		
		this.drawLine(left_bottom, {x:(left_bottom.x + xhold), y: left_bottom.y}, color, framebuffer);
		this.drawLine(left_bottom, {x: left_bottom.x, y: (left_bottom.y + yhold)}, color, framebuffer); 
		this.drawLine(right_top, {x:(right_top.x - xhold), y: right_top.y}, color, framebuffer); 
		this.drawLine(right_top, {x: right_top.x, y: (right_top.y - yhold)}, color, framebuffer); 
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
		var i;
		var n = this.num_curve_sections;
		//var n = 4;
		var deg = (360/n) * (Math.PI/180);
		var x;
		var y;
		var x1;
		var y1;
        for(i = 0; i < n; i++)
		{
			x = Math.ceil(center.x + radius * Math.cos(deg * i));
			y = Math.ceil(center.y + radius * Math.sin(deg * i));
			x1 = Math.ceil(center.x + radius * Math.cos(deg * (i+1)));
			y1 = Math.ceil(center.y + radius * Math.sin(deg * (i+1)));
			this.drawLine({x: x, y: y}, {x: x1, y: y1}, color, framebuffer);
		}
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        var i;
		var n = this.num_curve_sections;
		var hold = 1/n;
		var t;
		var t2;
		var x;
		var y;
		var x1;
		var y1;
        for(i = 0; i < n; i++)
		{
			t = hold * i;
			t2 = hold * (i+1);
			x = Math.ceil( Math.pow((1-t),3)*pt0.x + 3 * Math.pow((1-t),2) * t * pt1.x + 3 * (1-t) * Math.pow(t,2) * pt2.x + Math.pow(t,3) * pt3.x);
			y = Math.ceil( Math.pow((1-t),3)*pt0.y + 3 * Math.pow((1-t),2) * t * pt1.y + 3 * (1-t) * Math.pow(t,2) * pt2.y + Math.pow(t,3) * pt3.y);
			x1 = Math.ceil( Math.pow((1-t2),3)*pt0.x + 3 * Math.pow((1-t2),2) * t2 * pt1.x + 3 * (1-t2) * Math.pow(t2,2) * pt2.x + Math.pow(t2,3) * pt3.x);
			y1 = Math.ceil( Math.pow((1-t2),3)*pt0.y + 3 * Math.pow((1-t2),2) * t2 * pt1.y + 3 * (1-t2) * Math.pow(t2,2) * pt2.y + Math.pow(t2,3) * pt3.y);
			this.drawLine({x: x, y: y}, {x: x1, y: y1}, color, framebuffer);
		}
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
		var x0 = pt0.x;
		var y0 = pt0.y;
		var x1 = pt1.x;
		var y1 = pt1.y;
		
        if (Math.abs(y1-y0) <= Math.abs(x1-x0))
		{
			if(x0<x1)
			{
				this.drawLineLow(x0,y0,x1,y1,color,framebuffer);
			}
			else
			{
				this.drawLineLow(x1,y1,x0,y0,color,framebuffer);
			}
		}
		else
		{
			if(y0<y1)
			{
				this.drawLineHigh(x0,y0,x1,y1,color,framebuffer);
			}
			else
			{
				this.drawLineHigh(x1,y1,x0,y0,color,framebuffer);
			}
		}
    }
	
	drawLineLow(x0, y0, x1, y1, color, framebuffer)
	{
		var A = y1 - y0;
		var B = -(x1 - x0);
		var dy = 1;
		if(A < 0)
		{
			dy = -1;
			A *= -1;
		}
		var D = 2*A + B;
		var D0 = 2*A;
		var D1 = 2*A + 2*B;
		var x = x0;
		var y = y0;
		
		while(x < x1)
		{
			this.setFramebufferColor(framebuffer, this.pixelIndex(x, y, framebuffer), color);
			if(D <= 0)
			{
				D = D + D0;
			}
			else
			{
				D = D + D1;
				y += dy;
			}
			x = x + 1;
			//setFramebufferColor(framebuffer, pixelIndex(x, y, framebuffer), color);
		}
	}

	drawLineHigh(x0, y0, x1, y1, color, framebuffer)
	{
		var A = x1 - x0;
		var B = -(y1 - y0);
		var dy = 1;
		if(A < 0)
		{
			dy = -1;
			A *= -1;
		}
		var D = 2*A + B;
		var D0 = 2*A;
		var D1 = 2*A + 2*B;
		var x = x0;
		var y = y0;
		while(y < y1)
		{
			this.setFramebufferColor(framebuffer, this.pixelIndex(x, y, framebuffer), color);
			if(D <= 0)
			{
				D = D + D0;
			}
			else
			{
				D = D + D1;
				x += dy;
			}
			y = y + 1;
			//setFramebufferColor(framebuffer, pixelIndex(x, y, framebuffer), color);
		}
	}
	
	setFramebufferColor(framebuffer, px, color)
	{
		framebuffer.data[px+0] = color[0];
		framebuffer.data[px+1] = color[1];
		framebuffer.data[px+2] = color[2];
		framebuffer.data[px+3] = color[3];
	}
	
	pixelIndex(x, y, framebuffer)
	{
		return 4 * y * framebuffer.width + 4 * x;
	}
};
