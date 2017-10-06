define([
    "app",
    "libs/socket.io-client/dist/socket.io.min",
    "models/admin_form"
], function (app, socketIO, Form) {
    var socketStream = window.ss,
        socketConnect = socketIO.connect('/backend'),
        uploadStream;

    var getFileStatus = function (file) {
        var messages = {
            server: "Done",
            error: "Error",
            client: "Ready",
            transfer: file.percent + "%"
        };

        return messages[file.status];
    };

    var uploadFile = function (file) {
        var size = 0,
            uploadStream = socketStream.createStream(),
            blobStream = socketStream.createBlobReadStream(file.file);

        socketConnect.on('message', function (data) {
            app.callEvent("uploaderList:loadingActions", [{title: data}]);
        });
        socketConnect.on('data', function (data) {
            Form.setItemsData(data);
            app.callEvent("adminMode:fileUploader:changeFormView", []);
        });
        socketConnect.on('error', function (err) {
            socketConnect.disconnect();
            webix.message("File was not uploaded");
            console.error(err);
        });

        file.status = 'transfer';
        socketStream(socketConnect).emit('file', uploadStream, {name: file.name});

        blobStream.on('data', function (chunk) {
            var percent;
            size += chunk.length;
            percent = Math.floor(size / file.size * 100);

            if (percent !== 100) {
                file.percent = percent;
            }
            else {
                file.percent = 0;
                file.status = 'server';
            }
            app.callEvent("uploader:progressChange", [file]);
        });

        blobStream.pipe(uploadStream);
    };

    return {
        getFileStatus: getFileStatus,
        uploadFile: uploadFile
    }
});