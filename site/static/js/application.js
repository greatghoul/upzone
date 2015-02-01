$(function() {
  function uploadFile(file) {
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
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('ERRORS: ' + textStatus, errorThrown);
      }
    });
  }

  $('body').on('paste', function(event) {
      var items = event.originalEvent.clipboardData.items;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (/image\/.*/i.test(item.type)) {
          var file = item.getAsFile();
          file.name = item.type.replace(/image\//i, 'paste.');
          uploadFile(file);
          break;
        }
      }
  });
});