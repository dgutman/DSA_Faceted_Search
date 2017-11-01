define([
    "models/images",
    "views/filter_breadcrumbs",
    "helpers/switch_skins_confirm",
    "app"
], function (Images, breadcrumbs, switchSkinConfirm, app) {

    window.img = Images;
    var toolbarId = "filter_toolbar",
        toggleBtnId = "toggle_btn_id",
        toggleSkinId = 'toggle_skin_id',
        toggleSkinBlockWidth = 110,
        toggleSkinSelect = 100,
        toggleSkinButton = {
            width: toggleSkinBlockWidth,
            rows: [
                {
                    view: 'label',
                    css: 'toggle-skin-label',
                    label: 'Switch Skin',
                },
                {
                    width:toggleSkinSelect,
                    id: toggleSkinId,
                    css: 'toggle-skin-button',
                    view: 'select',
                    options: app.config.skinsList,
                    value: app.config.currentSkin,
                    on: {
                        onChange: function(skin){
                            switchSkinConfirm(this, skin);
                        }
                    }
                }
            ]
        },
        ui = {
            view: "toolbar",
            id: toolbarId,
            height: 96,
            cols:[
                {
                    minWidth: 250,
                    rows: [
                        {
                            height: 30,
                            cols: [
                                {
                                    view: "label",
                                    template: "<p class='images-header-p'>FILTER RESULTS</p>"
                                }
                            ]
                        },
                        {
                            height: 38,
                            cols: [
                                {
                                    view: "label",
                                    css: 'row-col-label',
                                    template: '<p class="no-margin">Rows/columns</p>',
                                    width: 130
                                },
                                {
                                    view: "toggle",
                                    css: "images-header-toogle",
                                    type: 'icon',
                                    offIcon: "toggle-off",
                                    onIcon: "toggle-on",
                                    id: toggleBtnId,
                                    width: 40,
                                    value: Images.getImagesViewState(),
                                    on: {
                                        onChange: function (state) {
                                            Images.changeImagesViewState(state)
                                        }
                                    }
                                }
                            ]
                        },
                    ]
                },
                breadcrumbs,
                toggleSkinButton
            ]
        };

    return {
        $ui: ui,
        $oninit: function() {
            $$(toggleBtnId).define("value", Images.getImagesViewState());
            $$(toggleBtnId).render();
        }
    }
});
