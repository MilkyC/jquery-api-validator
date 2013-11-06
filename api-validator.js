
function APIValidator(options){
	this.current_page = 1;
	this.options = {
		"endpoint":"endpoint-ajax",
		"fields_to_harvest": {}
	};
	this.additional_data = {};

	if(options.endpoint){
		this.options.endpoint = options.endpoint;
	}
	if(options.fields_to_harvest){
		this.options.fields_to_harvest = options.fields_to_harvest;
	}
}


APIValidator.prototype.submitCurrentStep = function(callback){
	if(this.current_page){
		this.submitStep(this.current_page, function(results){
			callback(results);
		});
	}
};

APIValidator.prototype.setCurrentPage =function(current_page){
	this.current_page = current_page;
};
APIValidator.prototype.addData = function(data){
	for(var key in data){
		this.additional_data[key] = data[key];
	}
};

APIValidator.prototype.submitStep = function(current_page, callback){
	var data = {};
	var fields_to_harvest = this.options.fields_to_harvest;

	if(fields_to_harvest[current_page].info && fields_to_harvest[current_page].info.type == "multi"){
		var res = APIValidator.harvestInputs(fields_to_harvest, current_page, 1);
		//console.log(['res', res]);
		var count = 2;
		while(APIValidator.getSize(res) > 0 && count < 10){
			for(var key in res){
				data[key] = res[key];
			}
			res = APIValidator.harvestInputs(fields_to_harvest, current_page, count);
			count = count + 1;
		}
	}else{

		res = APIValidator.harvestInputs(fields_to_harvest, current_page, 0);
		for(var key in res){
			data[key] = res[key];
		}
	 }


	

	//console.log(["APIValidator.prototype.submitStep submitting data", data]);

	for(var key in this.additional_data){
		data[key] = this.additional_data[key];
	}
	this.makeRequest(current_page, data, function(results){
		callback(results);
	});
};

APIValidator.handlePrefix = function(field, prefix){
	var regex = /\*/;
	field =  field.replace(regex, prefix);
	return field;
};

APIValidator.harvestInputs = function(fields_to_harvest, current_page, prefix){
	
	var supported_inputs = ["select", "radio", "inputs", "textarea", "check"];

	//console.log(["fields_to_harvest[current_page]", fields_to_harvest[current_page]]);
	var data = {};
	if(fields_to_harvest[current_page]['inputs']){
	//grab the inputs
		for(var i=0; i < fields_to_harvest[current_page]['inputs'].length; i++){
			
			var field = fields_to_harvest[current_page]['inputs'][i];
			if(prefix != 0){
			   field =  APIValidator.handlePrefix(field, prefix);
			}
			//console.log(["harvesting", field, "val", jQuery('input[name=' + field + ']').val()]);
			var val = jQuery('input[name=' + field + ']').val();
			if(val){ 
				data[field] = val;
			}
		}
	}
	//grab selects
	if(fields_to_harvest[current_page]['select']){
		for(var i=0; i < fields_to_harvest[current_page]['select'].length; i++){
			// //console.log(["trying to harvest: ",fields_to_harvest[current_page]['select'][i]], jQuery('#' + fields_to_harvest[current_page]['select'][i]).val());
			
			var field = fields_to_harvest[current_page]['select'][i];
			if(prefix != 0){
				field =  APIValidator.handlePrefix(field, prefix);
			}

			var val = jQuery('#' + field).val();
			if(val){ 
				data[field] = val;
			}

		}
	}
	//grab radios
	if(fields_to_harvest[current_page]['radio']){
		for(var i=0; i < fields_to_harvest[current_page]['radio'].length; i++){
			var field = fields_to_harvest[current_page]['radio'][i];
			if(prefix != 0){
				field =  APIValidator.handlePrefix(field, prefix);
			}

			var val = jQuery('input[name=' + field + ']:checked').val();
			if(val){ 
				data[field] = val;
			}
		}
	}

	//grab checkboxes
	if(fields_to_harvest[current_page]['check']){
		for(var i=0; i < fields_to_harvest[current_page]['check'].length; i++){
			var field = fields_to_harvest[current_page]['check'][i];
			
			if(prefix != 0){
				field =  APIValidator.handlePrefix(field, prefix);
			}
			//console.log([field, jQuery('#'+ field ).prop('checked')]);
			var val = jQuery('#'+ field ).prop('checked');
			if(val){ 
				data[field] = val;
			}
			//data[fields_to_harvest[current_page]['check'][i]] = jQuery('input[name=' + fields_to_harvest[current_page]['radio'][i] + ']:checked').val();
		}
	}
	//grab the textareas
	if(fields_to_harvest[current_page]['textarea']){
		for(var i=0; i < fields_to_harvest[current_page]['textarea'].length; i++){
			var field = fields_to_harvest[current_page]['textarea'][i];
			
			if(prefix != 0){
				field =  APIValidator.handlePrefix(field, prefix);
			}
			//console.log([field, jQuery('textarea#'+field).val()]);
			var val = jQuery('textarea#'+field).val();
			if(val){ 
				data[field] = val;
			}
		}
	}

	//handle custom functions here... implement this later
	
	////console.log(["data", data]);
	return data;

};


APIValidator.getSize = function(obj) {

    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    ////console.log(['getSize', obj, 'size', size]);
    return size;
};

APIValidator.prototype.makeRequest = function(current_page, data, callback){
	data['submitted'] = true;
	jQuery.ajax({
		type: 'POST',
		url: this.options.endpoint + "?step=" + current_page,
		data: data,
		success: function(response_data){
			var data = JSON.parse(response_data);
			//console.log(["APIValidator.prototype.makeRequest:request data", data]);
			if(data.result && data.result == "success"){
				console.log("success!");

			}else if(data.result && data.result == "fail"){
				console.log("fail!");
			}else{
				console.log("nothing!");
			}
			callback(data);
		}.bind(this)
	});
};






