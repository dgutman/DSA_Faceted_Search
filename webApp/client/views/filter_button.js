define([
    "models/images"
], function (Images) {
    var buttonId = "filterButton",
        templateId = "button_template",
        visible = true,
        ui = {
        id: buttonId,
        cols: [
            {
                view: 'template',
                align: 'center',
                css: "button-text",
                id: templateId,
                template: "<div class='found-button'>Found #count# results!</div>",
                data: {
                    count: 0
                }
            },
            {
                view: "icon",
                css: "button-icon",
                icon: "ban",
                align: "right",
                on: {
                    onItemClick: function () {
                        $$(buttonId).hide();
                        $$(buttonId).destructor();
                        visible = false
                    }
                }
            }
        ],
        height: 50
    };

    Images.attachEvent("changeButtonAfterImageLoaded", function() {
        $$(templateId).define("data", {count: this.getImagesCount()});
        $$(templateId).render();
        $$(templateId).hideProgress();
    });

    Images.attachEvent("imagesFiltered", function() {
        if(visible) {
            $$(templateId).define("data", {count: this.getImagesCount()});
            $$(templateId).render();
        }
    });

    return {
        $ui: ui,
        $oninit: function() {
            webix.extend($$(templateId), webix.ProgressBar);
            $$(templateId).showProgress({
                type:"icon"
            });
            visible = true;
        }
    }
});