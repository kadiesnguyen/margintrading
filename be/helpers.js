const fs     = require('fs');
const conf   = require('./config.js');
const path   = require('path');

let getConfig = function(config){
	let text = fs.readFileSync(path.resolve(__dirname, './config/' + config + '.json'), 'utf8');
	try{
		text = JSON.parse(text);
		return text;
	}catch (e){
		return null;
	}
}

let getConfigData = function(config){
	let text = fs.readFileSync(path.resolve(__dirname, './config/' + config), 'utf8');
	return text;
}

let setConfig = function(config, data){
	fs.writeFileSync(path.resolve(__dirname, './config/' + config + '.json'), JSON.stringify(data), function(err){});
	data = null;
}

let setConfigData = function(config, data){
	fs.writeFileSync(path.resolve(__dirname, './config/' + config), data, function(err){});
	data = null;
}

let phoneCrack = function(phone) {
	let data = phone.match(/^[\+]?(?:[(][0-9]{1,3}[)]|(?:84|0))/im);
	if (data) {
		return {
			region: data[0],
			phone:  phone.slice(data[0].length, phone.length),
		};
	}
	return data;
}

module.exports = {
    getConfig,
    setConfig,
	setConfigData,
	getConfigData,
	phoneCrack: phoneCrack
}