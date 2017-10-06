define([
        "app",
        "models/filter"
    ], function(app, filtersCollection){

    var viewId = 'breadcrumbs-view';
    var keysDelimiter = '|';
    var crumbObjectEnding = keysDelimiter + 'crumb';

    //breadcrumbs' size parameters
    var additionalSpaceForCrumb = 50;
    var crossButtonWidth = 20;
    var spaceForBreadcrumbsDelimiter = 10; 

    //will contain breadcrumbs data
    var crumbsArr = {};

    var filtersConfig;

    var ui = {
        id: viewId,
        view: 'scrollview',
        css: 'breadcrumbs-view',
        scroll: 'x',
        body: {
            view: 'toolbar',
            cols: []
        },
        gravity: 2
    };

    app.attachEvent("filtersChanged", function(data){
        filtersChangedHandler(data);
    });

    app.attachEvent("filtersLoaded", function(){
        filtersConfig = filtersCollection.getFilters().serialize();
    });

    var getConfigForFilter = function(key){
        var config;
        for(var groupIndex = 0; groupIndex<filtersConfig.length; groupIndex++){
            for(var filterIndex = 0; filterIndex<filtersConfig[groupIndex].data.length; filterIndex++){
                if(filtersConfig[groupIndex].data[filterIndex].id === key){
                    config = filtersConfig[groupIndex].data[filterIndex];
                }
            }
        }
        return config;
    }

    var createCrumb = function(data){
        var ui = {
            id: data.key + crumbObjectEnding,
            view: 'segmented',
            value: 'shouldnotexist',
            width: 500,
            options: [
                {id: 'label', template: '#value'},
                {id: 'cross', value: 'X', width: 20}
            ],
            on: {
                onAfterTabClick: function(id){
                    if(id !== 'cross'){
                        this.setValue('shouldnotexits');
                        return;
                    }
                    crumbClickHandler(this, data);
                }
            }
        }

        var crumb = $$(viewId).getBody().addView(ui);
        return $$(crumb);
    }

    var crumbClickHandler = function(button, data){
        var key = data.key;
        switch(data.view){
            case 'toggle':
            case 'checkbox':
                var ids = [];
                for(var i = 0; i<crumbsArr[key].value.length; i++){
                    ids.push(key + keysDelimiter + crumbsArr[key].value[i]);
                }
                for(var i = 0; i<ids.length; i++){
                    $$(ids[i]).toggle();
                }
                break;
            case 'combo':
            case 'radio':
                $$(key).setValue('All');
                break;
            case 'multiSlider':
                $$(key+ keysDelimiter + 'start').setValue(crumbsArr[key].min);
                $$(key+ keysDelimiter + 'end').setValue(crumbsArr[key].max);
                break;
            case 'slider':
                $$(key).setValue(0);
        }
        button.setValue('shouldnotexits');
        button.hide();
        
    }

    var parseIntArray = function(data){
        var parsed = [];
        for(var i = 0; i<data.length; i++){
            parsed.push(parseInt(data[i]));
        }
        return parsed;
    }

    var filtersChangedHandler = function(data){
        var key = data.key;
        var show = false;
        var parsedKey = key.split(keysDelimiter);
        var name = parsedKey[parsedKey.length-1];
        var crumbData = crumbsArr[key];
        var crumbWebixObject;
        if(crumbData) crumbWebixObject = crumbData.object;
        switch(data.view){
            case 'toggle':
            case 'checkbox':
                if(data.remove){
                    var valueIndex = crumbsArr[key].value.indexOf(data.value);
                    if(valueIndex >= 0) crumbsArr[key].value.splice(valueIndex, 1);
                    if(crumbsArr[key].value.length !== 0) show = true;
                } else {
                    if(!crumbData){
                        crumbsArr[key] = {
                            value: [data.value],
                            object: createCrumb(data)
                        }
                        show = true;
                    } else {
                        crumbData.value.push(data.value);
                        show = true;
                    }
                }
                name += ': selected ' + crumbsArr[key].value.length + ' items';
                break;

            case 'combo':
            case 'radio':
                if(!crumbData){
                    crumbsArr[key] = {
                        value: data.value,
                        object: createCrumb(data)
                    }
                    show = true;
                } else if(data.value !== 'All'){
                    show = true;
                }
                name += ': ' + data.value;
                break;

            case 'multiSlider':
                if(!crumbData){
                    var config = getConfigForFilter(key);
                    var options = parseIntArray(config.options);
                    var min = Math.min.apply(Math, options);
                    var max = Math.max.apply(Math, options); 
                    crumbsArr[key] = {
                        min: min,
                        max: max,
                        value: {min: data.min, max: data.max},
                        object: createCrumb(data)
                    }
                    show = true;
                } else if(data.min !== crumbData.min || data.max !== crumbData.max) {
                    show = true;
                }
                name += ': from ' + data.min + ' to ' + data.max;
                break;

            case 'slider':
                if(!crumbData){
                    var config = getConfigForFilter(key);
                    crumbsArr[key] = {
                        value: data.value,
                        object: createCrumb(data),
                        minValue: config.options[0] - 1
                    }
                    show = true;
                } else {
                    show = true;
                }
                name += ': ' + data.value;
        }

        if(!crumbWebixObject){
            crumbWebixObject = crumbsArr[key].object;
        }

        //adjust button to text
        var textWidth = webix.html.getTextSize(name, 'webix_el_segmented').width;
        crumbWebixObject.config.options[0].value = name;
        crumbWebixObject.config.options[0].width = textWidth + additionalSpaceForCrumb;
        crumbWebixObject.define('width', textWidth + additionalSpaceForCrumb + crossButtonWidth + spaceForBreadcrumbsDelimiter);

        if(show){
             crumbWebixObject.show();
        } else {
             crumbWebixObject.hide();
        }
        crumbWebixObject.refresh();
    }

    return {
        $ui: ui
    }
});