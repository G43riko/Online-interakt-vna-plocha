class LogManager {
	constructor(){
		LogManager.LOGS = "logs";
		LogManager.WARNS = "warns";
		LogManager.ERRORS = "errors";

		this._logs = [];
		this._data = {};
		this._data[LogManager.LOGS] = {};
		this._data[LogManager.WARNS] = {};
		this._data[LogManager.ERRORS] = {};


		this._show = {};
		this._show[LogManager.LOGS] = this._show[LogManager.WARNS] = this._show[LogManager.ERRORS] = true;
	};

	log(msg, type){
		this._logs.push([Date.now(), msg, type]);
	}

	set(val, type = false){
		if(type)
			this._show[type] = val;
		else
			this._show[LogManager.LOGS] = this._show[LogManager.WARNS] = this._show[LogManager.ERRORS] = val;

	};

	notif(msg){
		Alert.info(msg);
	}

	write(msg){
		this._data[LogManager.LOGS][Date.now()] = msg;
		if(this._show[LogManager.LOGS])
			console.log(msg);
	};

	error(msg){
		this._data[LogManager.ERRORS][Date.now()] = msg;
		if(this._show[LogManager.ERRORS])
			console.error(msg);
	};

	warn(msg){
		this._data[LogManager.WARNS][Date.now()] = msg;
		if(this._show[LogManager.WARNS])
			console.warn(msg);
	};

	get data(){
		return this_data;
	}
}