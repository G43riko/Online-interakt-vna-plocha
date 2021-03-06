class Line extends Entity{
	constructor(points, width, fillColor, targetA = null, targetB = null) {
		super(OBJECT_LINE, new GVector2f(), new GVector2f(), {
			fillColor: fillColor,
			borderWidth: width,
			fontColor: null,
			points: points,
			lineCap: LINE_CAP_BUTT,
			joinType: LINE_JOIN_MITER,
			lineStyle: LINE_STYLE_NORMAL,
			lineType: JOIN_LINEAR,
			movingPoint: -1,
			editable: true, // či je možné pridávať a mazať body
			movable: true //či je možné presúvať body

		});
		//this._points 			= points;
		//this.movingPoint		= -1;
		/*
		this._lineCap			= LINE_CAP_BUTT;
		this._joinType			= LINE_JOIN_MITER;
		this._lineStyle			= LINE_STYLE_NORMAL;
		this._lineType			= JOIN_LINEAR;
		*/
		this._arrow 			= new Image();
		this._arrow.src 		= "img/arrow.png";
		this._arrowEndType		= Creator.arrowEnd;
		this._arrowStartType	= Creator.arrowStart;
		this._centerTexts		= [];
		//this._editable		= true; // či je možné pridávať a mazať body
        //this._movable			= true; //či je možné presúvať body
		this.targetA 			= targetA;
		this.targetB 			= targetB;

		this._startText = null;
		/*
		this._startText = {
			text: "startText",
			dist: 70,
			angle: Math.PI / 2
		};
		*/
		this._text_A = "";
		this._text_B = "";

		if(points.length < 2){
			Logger.warn(getMessage(MSG_LINE_WITH_TOO_LESS_POINTS));
			Scene.remove(this);
		}
		Entity.findMinAndMax(this._points, this.position, this.size);
	}

	setCenterText(text, index = 0){
		if(!text){
			return;
		}
		this._centerTexts[index] = text;
	}

	removeCenterText(index = 0){
		delete this._centerTexts[i];
	}

	setStartText(text, dist = 0, angle = 0, ctx = context){
		if(arguments.length === 0 || !isString(text) || text.length === 0){
			this._startText = null;
			return;
		}
		let fontSize = 10;
		this._startText = {
			text: text,
			dist: dist,
			fontSize: fontSize,
			angle: angle,
			textWidth : CanvasHandler.calcTextWidth(ctx, text, fontSize + "pt Comic Sans MS")
		};

		if(this._startText.dist === 0){
			this._startText.dist = this._startText.textWidth;
		}
	}

	connectBTo(obj, selector){
        obj.setConnector(selector);
        this.targetB = obj;
        obj.unsetConnector();
	}

    connectATo(obj, selector){
        obj.setConnector(selector);
        this.targetA = obj;
        obj.unsetConnector();
    }

	doubleClickIn(x, y){
		if(!this.clickInBoundingBox(x, y)){
			return false;
		}

		if(!this._editable){
			return false;
		}

		this._points.forEach(function(e, i){
			if(new GVector2f(x, y).dist(e) < SELECTOR_SIZE){
				this._points.splice(i, 1);
				Entity.findMinAndMax(this._points, this.position, this.size);
			}
		}, this);

		//TODO determineClick ak niečo vráti tak sa vytvorí text

		if(this._points.length < 2){
			Scene.remove(this);
		}

		return true;
	}

	_clickIn(x, y){
		this.movingPoint = -1;

		//zistí či bolo kliknuté na začiatočný text
		if(this._startText !== null){
            let final = this._points[this._points.length - 1].getClone();
			//var final = G.last(this._points).getClone();
            let semiFinal = this._points[this._points.length - 2].getClone();
            let vector = semiFinal.sub(final).normalize();
            let angle = this._startText.angle;
            let newVector = new GVector2f(vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
				vector.x * Math.sin(angle) + vector.y * Math.cos(angle));
            let position = final.add(newVector.mul(this._startText.dist));
			if(position.dist(new GVector2f(x, y)) < this._startText.textWidth){
				console.log("aaaaaaaaaanooooooooo");
			}
		}

		//zistí či bolo klinutí na bod
		this._points.forEach(function(e,i, points){
			if(this.movingPoint >= 0){
				return true;
			}
			if(this._movable && new GVector2f(x, y).dist(e) < SELECTOR_SIZE){
				this.movingPoint = i;
			}
			else if(this._editable && i + 1 < points.length &&
				new GVector2f(x, y).dist((e.x + (points[i + 1].x) >> 1),
					(e.y + (points[i + 1].y) >> 1)) < SELECTOR_SIZE){
				this.movingPoint = parseFloat(i) + 0.5;
			}
		}, this);
		if(this.movingPoint >= 0){
			return this.movingPoint >= 0;
		}

		//zistí či bolo kliknuté na
		for(let i=1 ; i<this._points.length ; i++){
			if(Line.determineClick(this._points[i-1], this._points[i], x, y, 10)){
				return true;
			}
		}
		return false;
	}

	setTarget(val){
		if(this.movingPoint === 0){
			this.targetA = val;
		}
		else if(this.movingPoint == this.points.length - 1){
			this.targetB = val;
		}
	}

	static determineClick(p1, p2, x, y, maxDist){
		if(x < Math.min(p1.x, p2.x) || x > Math.max(p1.x, p2.x) || y < Math.min(p1.y, p2.y) || y > Math.max(p1.y, p2.y)){
			return false;
		}

        let dist = p1.dist(p2),
			log = Math.ceil(Math.log2(dist)),
			min,
			max,
			center,
			i;
		if(p1.x < p2.x){
			min = p1.getClone();
			max = p2.getClone();
		}
		else{
			min = p2.getClone();
			max = p1.getClone();
		}
		center = min.getClone().add(max).br(1);
		for(i=0 ; i<log ; i++){
			if(x > center.x){
				min = center;
			}
			else{
				max = center;
			}
			center = min.add(max).br(1);

			if(Math.abs(y - center.y) < maxDist){
				return true;
			}
		}
		return false;
	}

	updateCreatingPosition(pos){
		this._points[this._points.length - 1].set(pos);
		//G.last(this._points).set(pos);
		Entity.findMinAndMax(this._points, this.position, this.size);
	}

    _draw(ctx = context){
        let obj, size = this._points.length;

		if(this._targetA){
			obj = Project.scene.getObject(this._targetLayerA, this._targetA);
			if(obj){
				this._points[0].set(obj.getConnectorPosition(this._targetConnectionA));
			}
			else{
				this.targetA = obj;
			}
		}

		if(this._targetB){
			obj = Project.scene.getObject(this._targetLayerB, this._targetB);
			if(obj){
				this._points[size - 1].set(obj.getConnectorPosition(this._targetConnectionB));
			}
			else{
				this.targetB = obj;
			}
		}
		if(this._targetA || this._targetB){
			Entity.findMinAndMax(this._points, this.position, this.size);
		}

		if(isNumber(this._radius) && this._radius > 1){
			this._radius += "";
		}
		doLine({
			shadow: this.moving && !this.locked,
			lineCap: this._lineCap,
			joinType: this._joinType,
			lineStyle: this._lineStyle,
			points: this._points,
			borderWidth: this.borderWidth,
			borderColor: this.fillColor,
			radius: this.radius,
			lineDash: this._lineStyle == LINE_STYLE_STRIPPED ? [15, 5] : [],
			ctx: ctx
		});

		Arrow.drawArrow(ctx, this._points[1], this._points[0], this, this._arrowEndType);
		Arrow.drawArrow(ctx, this._points[size - 2], this._points[size - 1], this, this._arrowStartType);

        let point, offset;

		//text_B
		if(isString(this._text_B) && this._text_B.length > 0){
			let first = this._points[0].getClone();
			let second = this._points[1].getClone();
			offset = CanvasHandler.calcTextWidth(ctx, this._text_B, "10pt Comic Sans MS");
			point = first.add(second.sub(first).normalize().mul((offset >> 1) + 10));
			doRect({
				position: point,
				fillColor: "white",
				width: offset,
				height: 10,
				center: true,
				ctx: ctx
			});
			ctx.fillStyle = "black";
			ctx.textAlign = FONT_HALIGN_CENTER;
			ctx.textBaseline = FONT_VALIGN_MIDDLE;
			ctx.fillText(this._text_B, point.x, point.y);
        }
		if(false && isObject(this._startText) && this._startText !== null){
            let final = this._points[this._points.length - 1].getClone();
			//var final = G.last(this._points).getClone();
            let semiFinal = this._points[this._points.length - 2].getClone();
            let vector = semiFinal.sub(final).normalize();
            let angle = this._startText.angle;
            let newVector = new GVector2f(vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
										  vector.x * Math.sin(angle) + vector.y * Math.cos(angle));
            let position = final.add(newVector.mul(this._startText.dist));
			doRect({
				position: position,
				fillColor: "white",
				width: this._startText.textWidth,
				height: this._startText.fontSize,
				center: true,
				ctx: ctx
			});
			ctx.fillStyle = "black";
			ctx.textAlign = FONT_HALIGN_CENTER;
			ctx.textBaseline = FONT_VALIGN_MIDDLE;
			ctx.fillText(this._startText.text, position.x, position.y);
		}

		/*
		if(isObject(this._startText)){
			var final = this._points[this._points.length - 1].getClone();
			var semiFinal = this._points[this._points.length - 2].getClone();
			var vector = semiFinal.sub(final).normalize();
			var angle = this._startText.angle;
			var newVector = new GVector2f(vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
										  vector.x * Math.sin(angle) + vector.y * Math.cos(angle));
			var textWidth = CanvasHandler.calcTextWidth(ctx, this._startText.text, "10pt Comic Sans MS");
			var position = final.add(newVector.mul(this._startText.dist));
			doRect({
				position: position,
				fillColor: "white",
				width: textWidth,
				height: 10,
				center: true,
				ctx: ctx
			});
			ctx.fillStyle = "black";
			ctx.textAlign = FONT_HALIGN_CENTER;
			ctx.textBaseline = FONT_VALIGN_MIDDLE;
			ctx.fillText(this._startText.text, position.x, position.y);
		}
		*/

		//text_A
        if(isString(this._text_A) && this._text_A.length > 0) {
            let last = this._points[this._points.length - 1].getClone();
            let subLast = this._points[this._points.length - 2].getClone();
            offset = CanvasHandler.calcTextWidth(ctx, this._text_A, "10pt Comic Sans MS");
            point = last.add(subLast.sub(last).normalize().mul((offset >> 1) + 10));
            doRect({
                position: point,
                fillColor: "white",
                width: offset,
                height: 10,
                center: true,
                ctx: ctx
            });
            ctx.fillStyle = "black";
            ctx.textAlign = FONT_HALIGN_CENTER;
            ctx.textBaseline = FONT_VALIGN_MIDDLE;
            ctx.fillText(this._text_A, point.x, point.y);
        }

		context.lineWidth = DEFAULT_BORDER_WIDTH << 1;
		if(this.selected) {
            drawBorder(ctx, this, {});
            drawSelectArc(ctx, this._points[0].x, this._points[0].y);
        }

		for(let i=1 ; i<size ; i++){
			let center = {};

			if(isString(this._centerTexts[i - 1])){
				center.x = (this._points[i].x + this._points[i - 1].x) >> 1;
				center.y = (this._points[i].y + this._points[i - 1].y) >> 1;
				doText({
					textHalign: FONT_HALIGN_CENTER,
					textValign: FONT_VALIGN_MIDDLE,
					fontSize: 10,
					fontColor: this._fontColor || this._fillColor,
					text: this._centerTexts[i - 1],
					background: "#FFFFFF",
					x: center.x,
					y: center.y,
					ctx: ctx
				});
			}
            if(this.selected) {
                drawSelectArc(ctx, this._points[i].x, this._points[i].y);
                if (this._editable) {
                    drawSelectArc(ctx,
                        center.x || (this._points[i].x + this._points[i - 1].x) >> 1,
                        center.y || (this._points[i].y + this._points[i - 1].y) >> 1);
                }
            }
		}
	}

	//GETTERS

    get points(){return this._points;}
    get movable(){return this._movable;}
    get editable(){return this._editable;}
    get positionA(){return this._points[0];}
    get positionB(){return this._points[this._points.length - 1];}

	//SETTERS

    set lineCap(val){this._lineCap = val;}
    set lineType(val){this._lineType = val;}
    set joinType(val){this._joinType = val;}
    set movable(value){this._movable = value;}
    set lineStyle(val){this._lineStyle = val;}
    set editable(value){this._editable = value;}
    set arrowEndType(val){this._arrowEndType = val;}
    set arrowStartType(val){this._arrowStartType = val;}

    set textA(value){
        if(isString(value) || isNumber(value)){
            this._text_A = value;
        }
    }

    set  textB(value){
        if(isString(value) || isNumber(value)){
            this._text_B = value;
        }
    }
    set targetB(val){
        let object = val ? val.id : "";
        if(this._targetB == object){
            return;
        }
        this._targetB			= object;
        this._targetLayerB		= val ? val.layer : "";
        this._targetConnectionB	= val ? val.selectedConnector : "";
    }

    set targetA(val){
        let object = val ? val.id : "";
        if(this._targetA == object){
            return;
        }
        this._targetA			= object;
        this._targetLayerA		= val ? val.layer : "";
        this._targetConnectionA	= val ? val.selectedConnector : "";
    }
}