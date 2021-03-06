/*
	compatible: 14.9.2016
*/

class Layer{
	constructor(title, layerType = ""){
		this._objects 	= {};
		this._visible 	= true;
		this._title 	= title;
		this._paint 	= null;
		this._locked 	= false;
		this._drawPaint	= true;
		this._opacity	= 1;
		this._raster	= false;
		this._canvas	= null;
		this._forRemove = [];
		this._layerType = layerType;
	}

	setForRemove(el){
		this._forRemove[this._forRemove.length] = el;
	}

	removeElements(){
		each(this._forRemove, e => Project.scene.remove(e));
		this._forRemove = [];
	}

	isEmpty(){
		if(this._paint && !this._paint.isEmpty()){
			return false;
		}
		for(let i in this._objects){
			if(this._objects.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	}

	cleanUp(){
		this.forEach(e => callIfFunc(e.cleanUp));
		this._objects = {};
		Paints.cleanUp(this._title);
		Events.layerCleanUp(this._title);
		Logger.log(getMessage(MSG_OBJECT_CLEANED, this.constructor.name), LOGGER_OBJECT_CLEANED);
	}

	rename(title){
		Events.layerRename(this._title, title);
		this._title = title;
	}
	onResize(){
        this.forEach(e => e.onResize());
        this.paint.onScreenResize();
	}
	makeRaster(){
		this._raster = true;
		//TODO pri rastrovaní vrstvy nakresliť všetko do canvasu
	}

	getObject(id){
		return this._objects[id];
	}

	draw(ctx = context){
		if(!this.visible){
			return;
		}

		this.forEach(e => e.visible && e.draw(ctx));

		if(this._drawPaint){
			this.paint.draw(ctx);
		}
	}

	add(element){
		this._objects[element.id] = element;
	}

	remove(element){
		delete this._objects[element.id];
	}

	forEach(func){
		each(this._objects, func);
	}
	
	get locked(){return this._locked /*&& this._layerType === ""*/;}
	get taskLayer(){return this._layerType === LAYER_TASK;}
	get guiLayer(){return this._layerType === LAYER_GUI;}
	get userLayer(){return this._layerType === LAYER_USER;}
	get drawPaint(){return this._drawPaint;}
	get layerType(){return this._layerType;}
	get visible(){return this._visible;}
	get objects(){return this._objects;}
	get raster(){return this._raster;}
	get title(){return this._title;}
	get paint(){
		if(isNull(this._paint)){
			this._paint = new Paint();
		}
		return this._paint;
	}
	
	set drawPaint(val){this._drawPaint = val;}
	set visible(val){this._visible = val;}
	set objects(val){this._objects = val;}
	set title(val){this._title = val;}
	set locked(val){
		this._locked = val === true;
	}
}