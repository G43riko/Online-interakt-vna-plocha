class Paint extends Entity{
	constructor(){
		super("Paint", new GVector2f(), new GVector2f());
		this._points 		= [Paint.defArray()];
		this._count 		= 0;
		this._canvas 		= document.createElement("canvas");
		this._canvas.width 	= canvas.width;
		this._canvas.height	= canvas.height;
		this._context 		= this._canvas.getContext('2d');
		this._action		= PAINT_ACTION_BRUSH;
		this._editBackup	= [];
	}

	static defArray(){
		return {
			color: null,
			action: null,
			size: null,
			points: []
		}
	}

	animate(speed = 20, limit = this._points.length - 1){
		var points 	= this._points,
			i 		= 0,
			ii 		= 0,
			inst 	= this;
		this.cleanUp();

		var interval = setInterval(function(){
			if(i >= limit || i >= points.length - 1){
				clearInterval(interval);
				return;
			}
			inst.addPoint(points[i]["points"][ii], points[i]["color"]);
			if(ii++ == points[i]["points"].length - 1){
				inst.breakLine();
				i++;
				ii = 0;
			}
			draw();
		}, speed);
	}

	redraw(points, limit = points.length - 1){
		this.cleanUp();
		var res = [];
		points.forEach(function(e, i){
			if(i > limit || isNull(e["color"]))
				return;
			res.push(e);


			if(Creator.brushColor !== e["color"])
				Creator.set("brushColor", e["color"]);
			if(Creator.brushSize !== e["size"])
				Creator.set("brushSize", e["size"]);
			if(Creator.brushType !== e["type"])
				Creator.set("brushType", e["type"]);

			e["points"].forEach(function(ee, ii, arr){
				if(ii)
					this._drawLine(ee, arr[ii - 1], this._actColor)
			}, this);
		}, this);
		this._points = res;
		if(points[points.length - 1]["points"].length)
			this.breakLine();
		draw();
	}

	undo(){
		if(isNull(this._points[this._points.length - 1]["color"]))
			this._points.pop();

		this._editBackup.push(this._points.pop());

		this.redraw(this._points);
	}

	redo(){
		if(this._editBackup.length == 0)
			return false;

		if(isNull(this._points[this._points.length - 1]["color"]))
			this._points.pop();
		this._points.push(this._editBackup.pop());
		this.redraw(this._points); // toto nemusí prepisovať celé
	}


	/**
	 * Pridá nový pod do malby podla aktualne nakresleneho štetca
	 *
	 * @param point
	 */
	addPoint(point){
		var lastArr = this._points[this._points.length - 1],
			arr = lastArr["points"];

		this._editBackup = [];
		this._count++;

		if(isNull(lastArr["color"])){ //TODO toto nižšie sa bude asi stále prepisovať
			lastArr["color"] = Creator.brushColor;
			lastArr["action"] = Paints.action;
			lastArr["type"] = Creator.brushType;
			lastArr["size"] = Creator.brushSize;
		}

		if(arr.length)
			this._drawLine(arr[arr.length - 1], point);
		arr.push(point);
	}

	fromObject(content){
		each(content, ee => each(ee["points"], (e, i , arr) => arr[i] = new GVector2f(e._x, e._y)));

		each(content, ee => {
			each(ee["points"], (e, i , arr) => {
				arr[i] = new GVector2f(e._x, e._y);
			})
		});
		this.redraw(content);
	}

	toObject(){
		return this._points;
	}

	_drawLine(pointA, pointB){
		if(this._action == PAINT_ACTION_LINE){
			this._context.lineCap 		= LINE_CAP_ROUND;
			this._context.lineWidth 	= this.borderWidth;
			this._context.strokeStyle	= Creator.brushColor;
			this._context.beginPath();
			this._context.moveTo(pointA.x, pointA.y);
			this._context.lineTo(pointB.x, pointB.y);
			this._context.stroke();
		}
		else if(this._action == PAINT_ACTION_BRUSH){
			var dist 	= pointA.dist(pointB),
				angle 	= Math.atan2(pointA.x - pointB.x, pointA.y - pointB.y);
			for (var i = 0; i < dist; i++)
				this._context.drawImage(Paints.selectedBrush,
					pointB.x + (Math.sin(angle) * i) - (Creator.brushSize >> 1),
					pointB.y + (Math.cos(angle) * i) - (Creator.brushSize >> 1),
					Creator.brushSize,
					Creator.brushSize);
		}
	}

	cleanUp(){
		this._points = [Paint.defArray()];
		this._points[this._actColor] = [[]];
		this._count = 0;
		this._context.clearRect(0, 0, canvas.width, canvas.height);
	}

	breakLine(){
		if(this._points[this._points.length - 1].points.length < 2)
			this._points[this._points.length - 1] = Paint.defArray();
		else
			this._points.push(Paint.defArray());
	}

	draw() {
		if (!this.visible)
			return;
		context.drawImage(this._canvas, 0, 0);
	};
}