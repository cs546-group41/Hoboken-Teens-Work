
$(document).ready(function() {
  $('#search-form').submit(function(event) {
    var input = $('#jobsInput').val().trim()
    var regex = new RegExp(/^[a-zA-Z\s]+$/);
    if (regex.test(input)) {
      $('#error').hide();
      $('#jobsInput').focus();
    } else {
      event.preventDefault();
      $('#error').show();
      $('#error').html('Only Support alphanumeric characters!');
      $('#jobsInput').focus();
    }
  })
});