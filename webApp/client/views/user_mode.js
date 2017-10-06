define([
    "views/images_dataview",
    "views/filter_form",
    "views/filter_button"
], function (imagesView, filterFormView, filterButtonView) {
    var filterCellId = "filter_cell",
        dataViewCellId = "dataview_cell",
        ui =
        {
            cols: [
                {
                    minWidth: 200, id: filterCellId, maxWidth: 400, rows: [
                    {body: filterFormView},
                    {body: filterButtonView}
                ]
                },
                {body: imagesView, minWidth: 500, id: dataViewCellId}
            ]
        };

    return {
        $ui: ui
    }
});