
$(document).ready(function() {
  $('#search-form').submit(function(event) {
    var input = $('#jobsInput').val().trim()
    //var regex = new RegExp(/^[a-zA-Z\s]+$/);
    if (checkJobTitle(input)) {
      $('#error').hide();
      $('#jobsInput').focus();
    } else {
      event.preventDefault();
      $('#error').show();
      if (input) $('#error').html('Only Support alphanumeric characters!');
      else $('#error').html('Empty string was recieved!');
      $('#jobsInput').focus();
    }
  })
});