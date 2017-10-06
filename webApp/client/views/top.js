define([
	"app",
	"views/toolbar"
], function (app, toolbar) {
	var ui = {
		rows: [
			{
				$subview: true
			}
		]
	};

	if(!app.config.userMode) {
		ui.rows.unshift({
			body: toolbar, minWidth: 300
		});
	}

	return {
		$ui: ui
	};
});