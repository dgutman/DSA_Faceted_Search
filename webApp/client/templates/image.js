define([], function() {
   return {
       getTemplate: function(data) {
            var template;
            if(!data.filename && !data.filesrc){
                template = '<p class="template-image-name">no image</p><img class="template-image">';
            } else {
                var src = data.filename ? "/api/images/" + data.filename : data.filesrc;
                template =  '<p class="template-image-name">'+ data.data.name +'</p>' +
                       '<img src="' + src + '" class="template-image">';
            }
            return template;
       }
   }
});