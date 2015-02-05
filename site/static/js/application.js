$(function() {
  function uploadFile(file) {
    $('.btn-upload').hide();

    $info = $('.input-info');
    $info.show();

    var formData = new FormData();
    formData.append('image', file, file.name);

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', function(evt){
          if (evt.lengthComputable) {  
            var percent = Math.round(evt.loaded / evt.total * 100);
            $info.css('background-size', '' + percent + '% 100%');
          }
        }, false);

        return xhr;
      },
      success: function(data, textStatus, jqXHR) {
        if (data.success) {
          $info.val(data.url);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('ERRORS: ' + textStatus, errorThrown);
      }
    });
  }

  function getPastedImage(event, callback) {
    var items = event.originalEvent.clipboardData.items;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      if (/image\/.*/i.test(item.type)) {
        var file = item.getAsFile();
        file.name = item.type.replace(/image\//i, 'paste.');
        return callback(file);
      }
    }

    return null;
  }

  function previewImage(image) {
    $('.container.active').removeClass('active');
    $('.container-preview').addClass('active');
    
    var $container = $('.container-preview');

    var url = URL.createObjectURL(image);
    var img = new Image();

    img.onload = function() {
      var width  = $container.innerWidth();
      var height = $container.innerHeight();

      if (this.width > width || this.height > height) {
        $container.css('background-size', 'contain');
      } else {
        $container.css('background-size', 'auto');
      }

      $container.css('background-image', 'url(' + url + ')');
    };

    img.src = url;
  }

  $('body').on('paste', function(event) {
    getPastedImage(event, function(image) {
      previewImage(image);
      uploadFile(image);
    });
  });
});