define([
    "app",
    "views/toolbar",
    "views/uploader",
    "views/uploader_list",
    "views/facets_form",
    "views/edit_form",
    "helpers/switch_skins_confirm"
], function (app, toolbar, uploaderView, uploaderListView, facetsFormView, editFormView, switchSkinConfirm) {
    var tabbarId = "tabbar", uploaderViewId = "uploaderView", editViewId = "editView", 
        toggleSkinAdminId = 'toggle_skin_admin_id',
        toggleSkinWidth = 200,
        toggleSkinLabelWidth = 100,
        ui = {
        rows: [
            {
                borderless: true,
                view: "tabbar",
                id: tabbarId,
                value: "uploaderView",
                multiview: true,
                options: [
                    {value: 'Upload', id: uploaderViewId},
                    {value: 'Edit', id: editViewId}
                ],
                on: {
                    onAfterTabClick: function (id) {
                        if(id === editViewId) {
                            app.callEvent("editForm:loadDataForFilters", []);
                        } else {
                            app.callEvent("editForm:clearForm", []);
                        }
                    }
                }
            },
            {
                cols: [
                    {
                        width: toggleSkinWidth,
                        id: toggleSkinAdminId,
                        css: 'toggle-skin-button',
                        view: 'select',
                        label: 'Switch skin',
                        labelWidth: toggleSkinLabelWidth,
                        options: app.config.skinsList,
                        value: app.config.currentSkin,
                        on: {
                            onChange: function(skin){
                                switchSkinConfirm(this, skin);
                            }
                        }
                    },
                    {}
                ]
            },
            {
                cells: [
                    {
                        id: uploaderViewId,
                        rows: [
                            uploaderView,
                            uploaderListView,
                            facetsFormView
                        ]
                    },
                    {
                        id: editViewId,
                        rows: [
                            editFormView
                        ]
                    }
                ]
            }
        ]
    };

    app.attachEvent("adminMode:fileUploader:changeFormView", function () {
        $$(uploaderView.getId()).hide();
        $$(uploaderListView.getId()).hide();
        $$(facetsFormView.getId()).show();
        facetsFormView.reloadSelectsData();
    });

    app.attachEvent("adminMode:doOnEditPageLoaded", function() {
        $$(uploaderViewId).hideProgress();
    });

    app.attachEvent("adminMode:doProgress", function (type) {
        if(type === "edit") {
            webix.extend($$(editViewId), webix.ProgressBar);
            $$(editViewId).showProgress({
                type: "icon"
            });
        } else {
            $$(uploaderViewId).showProgress({
                type: "icon"
            });
        }
    });



    app.attachEvent("adminMode:onLoaded", function (type, showMsg) {
        if(type === "edit") {
            $$(editViewId).hideProgress()
        } else {
            $$(uploaderView.getId()).show();
            $$(uploaderListView.getId()).show();
            $$(facetsFormView.getId()).hide();
            $$(uploaderViewId).hideProgress();
        }
        if(showMsg) {
            webix.message("Filters were saved");
        }
    });

    return {
        $ui: ui,
        $oninit: function () {
            webix.extend($$(uploaderViewId), webix.ProgressBar);
        }
    };
});