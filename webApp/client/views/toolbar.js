define(["app"], function (app) {
    var ui = {
        view: "toolbar",
        cols: [
            {
                view: "segmented",
                value: (window.location.hash.indexOf("user_mode") > -1 ? "user_mode" : "admin_mode"),
                options: [
                    {id: "user_mode", value: "User Mode"},
                    {id: "admin_mode", value: "Admin Mode"}
                ],
                on: {
                    onAfterTabClick: function (id) {
                        app.show("/top/" + id)
                    }
                }
            }
        ]
    };
    return {
        $ui: ui
    };

});
