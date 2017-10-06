define([
    "app",
    "models/edit_form"
], function(app, EditForm) {
    var uploadFormId = "edit_upload_form_id",
        selectTypeId = "edit_select_type",
        selectFacetId = "edit_select_facet",
        toInterfaceBtnId = "edit_send_to_interface",
        previewFormId = "edit_preview_form_id",
        scrollViewId = webix.uid(),

        ui = {
            view: "scrollview",
            id: scrollViewId,
            scroll: "y",
            body: {
                rows: [
                    {
                        view: "form",
                        id: uploadFormId,
                        elements: [
                            {
                                view: "select",
                                id: selectFacetId,
                                label: "Facet",
                                options: []
                            },
                            {
                                view: "select",
                                id: selectTypeId,
                                label: "Type",
                                options: []
                            },
                            {
                                view: "button",
                                value: "Add",
                                type: "form",
                                click: function () {
                                    var type = $$(selectTypeId).getValue(),
                                        facet = $$(selectFacetId).getValue(), view, canBeAdded = false;
                                    if (type && facet) {
                                        canBeAdded = EditForm.checkAbilityToAdd(facet, type);
                                        if (canBeAdded) {
                                            view = EditForm.addItem(facet, type);
                                            $$(previewFormId).show();
                                            $$(previewFormId).addView(view);
                                            updateFormSize();
                                            reloadSelectsData();
                                        } else {
                                            webix.message("Facet can't be added for selected type");
                                        }
                                    } else if (!type) {
                                        webix.message('Please, select Type before adding');
                                    } else if (!facet) {
                                        webix.message('Please, select Facet before adding');
                                    } else {
                                        webix.message('No More Attributes To Add');
                                    }
                                }
                            },
                            {
                                id: previewFormId,
                                view: "form",
                                hidden: true,
                                elements: []
                            },
                            {
                                id: toInterfaceBtnId,
                                value: "Save changes",
                                view: "button",
                                click: function () {
                                    EditForm.saveItems();
                                }
                            }
                        ]
                    }
                ]
            },
            height: NaN
        };

    var getId = function () {
        return uploadFormId;
    };
    
    app.attachEvent("editForm:dataLoaded", function(views) {
        var t = $$(previewFormId).getChildViews(), i;
        if(t) {
            for(i = 0; i < t.length; i++) {
                $$(previewFormId).removeView(t[i]);
                i--;
            }
        }
        if(views && views.length) {
            $$(previewFormId).show();
            for(i = 0; i < views.length; i++) {
                $$(previewFormId).addView(views[i]);
            }
        }
        $$(scrollViewId).resize();
        $$(previewFormId).resize();
        reloadSelectsData();
    });
    
    app.attachEvent("editForm:clearForm", function() {
        var t = $$(previewFormId).getChildViews(), i;
        if(t) {
            for(i = 0; i < t.length; i++) {
                $$(previewFormId).removeView(t[i]);
                i--;
            }
        }
    });

    var reloadSelectsData = function (reloadOnlyLabels) {
        if(!reloadOnlyLabels) {
            $$(selectTypeId).define("options", EditForm.getItemTypes());
            $$(selectTypeId).render();
        }
        $$(selectFacetId).define("options", EditForm.getLabels());
        $$(selectFacetId).render();

    };


    var updateFormSize = function () {
        $$(scrollViewId).resize();
        $$(previewFormId).render();
    };

    var itemRemoved = function (id) {
        var t = EditForm.getCountOfAddedItems();
        $$(previewFormId).removeView(id);
        updateFormSize();
        if(!t) {
            $$(previewFormId).hide();
        }

    };
    app.attachEvent("editForm:modifyView", function(data) {
        var view, canBeAdded = false;
            canBeAdded = EditForm.checkAbilityToAdd(data.facet, data.newType);
        if (canBeAdded) {
            view = EditForm.addItem(data.facet, data.newType);
            $$(previewFormId).show();
            webix.ui(view, $$(previewFormId), $$(data.formId));
        } else {
            $$(data.comboId).blockEvent();
            $$(data.comboId).setValue(data.oldType);
            $$(data.comboId).unblockEvent();
            webix.message("Facet can't be changed to selected type");
        }
    });
    app.attachEvent("editForm:reloadOptions", reloadSelectsData);
    app.attachEvent("editForm:doAfterItemRemoved", itemRemoved);




    return {
        $ui: ui,    
        getId: getId,
        reloadSelectsData: reloadSelectsData
    }
});