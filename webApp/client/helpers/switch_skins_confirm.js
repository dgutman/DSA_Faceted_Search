define([
    "app"
    ], function(app){

    return function (selectView, skin){

        var toggleSkinUrlUser = '/api/skin/user/';
        var toggleSkinUrlAdmin = '/api/skin/admin/';

        var callback = function(result){
            if(result){
                var url = app.config.userMode ? toggleSkinUrlUser : toggleSkinUrlAdmin
                webix.ajax(url + skin, function(){
                    window.location.reload();
                });
            } else {
                selectView.blockEvent(); //another one confirm window will pop up because of onchange event 
                selectView.setValue(app.config.currentSkin);
                selectView.unblockEvent();
            }
        }

        webix.confirm({
            title: 'Switch skin?',
            text: 'Please, pay attention that by confirming skin change you will loose your filter settings. Do you want to confirm skin change?',
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    }
})