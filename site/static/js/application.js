$(function() {
  function uploadFile(file) {
    $btn = $('.btn-upload').attr('disabled', 'disabled').text('正在上传 ...');
    $info = $('.input-info');

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
      success: function(data, textStatus, jqXHR) {
        $btn.hide();
        $info.show();
        if (data.success) {
          $info.val(data.url).focus().select();
        } else {
          $info.val('上传失败');
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $btn.hide();
        $info.show().val('上传失败');
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

  $('.input-info').on('click', function() {
    $(this).select();
  });
});