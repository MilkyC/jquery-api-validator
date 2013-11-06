jquery-api-validator
====================

This project was born after our designer built several slick looking enrollment flows for our site that were single-page multi-slide-in-step forms.  This presented some issues to us because it wasn't as simple as just posting a form to get our data to the backend. So, we developed a framework that harvests inputs by step and posts them via ajax to a page of your choice from which you can save to session, a database, etc.

**Basic Usage**

	var api_validator = new APIValidator({
		"fields_to_harvest" : { 
			"step1":{"inputs":["first_name", "last_name", "email", "phone"], "select":["state"]}, 
		}
		});
	api_validator.setCurrentPage("step1);
	api_validator.submitCurrentStep(function(results){
		//handle our business
		//move onto the next page?
	});

**Dynamic Input Harvesting**
	If you have a dynamic amount of inputs to harvest at a given time with similar variable names, example: sibling\_first\_name1, sibling\_first\_name2. Then you can substitute the number at the end with a "*" and the validator will harvest all applicable fields it can find. Example:

		var api_validator = new APIValidator({
			"fields_to_harvest" : { 
				{"inputs":["sibling_first_name*", "sibling_last_name*"], "info":{"multi":true}}
			}
		});