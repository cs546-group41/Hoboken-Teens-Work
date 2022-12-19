function checkJobTitle(title) {
	if (!title) return false;
	if (typeof title !== "string") return false;
	title = title.trim();
	if (title.length === 0) return false
	if (title.match("/[^ws]/g") || title.includes("_")) return false;
	if (title.length < 3) return false;
	return true;
}

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
