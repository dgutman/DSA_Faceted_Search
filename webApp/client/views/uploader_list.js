define([
    "app"
], function (app) {

    var loaderId = "loader_list_view", ui = {
        view: "list",
        template: '#title#',
        id: loaderId,
        data: [],
        autoheight: true
    };

    app.attachEvent("uploaderList:loadingActions", function(data) {
        $$(loaderId).add(data);
    });

    app.attachEvent("uploaderList:clearAfterSave", function() {
        $$(loaderId).clearAll();
    });

    var getId = function() {
        return loaderId;
    };


    return {
        $ui: ui,
        getId: getId
    }
});