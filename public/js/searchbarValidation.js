$('#search-form').submit((event) => {
  
  if ($('#jobsInput').val().trim()) {
    $('#error').hide();
    $('#jobsInput').focus();
  } else {
    event.preventDefault();
    $('#error').show();
    $('#error').html('You must enter something in the searchbar to search');
    $('#jobsInput').focus();
  }
});