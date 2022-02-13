$(document).ready(() => {
  let amenityDict = {};
  $('input:checkbox').change(() => {
    let amenityString = '';
    if ($(this).is(':checked')) {
      $('li > input:checkbox:checked').map(function () {
        amenityDict[$(this).attr('data-id')] = ' ' + $(this).attr('data-name');
      }).get();
      Object.values(amenityDict).forEach((amenity) => {
        amenityString += amenity;
        amenityString += ' ';
      });
      $('div.amenities > h4').text(amenityString);
    } else {
      amenityDict = {};
      $('li > input:checkbox:checked').map(function () {
        amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }).get();
      Object.values(amenityDict).forEach((amenity, i) => {
        amenityString += amenity;
        if (i !== Object.values(amenityDict).length - 1) {
          amenityString += ', ';
        }
      });
      $('div.amenities > h4').text(amenityString);
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: (status) => {
      if (status.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  let userNames = [];

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/users/',
    success: (users) => {
      $.each(users, function (i, user) {
        userNames[user['id']] = user['first_name'] + ' ' + user['last_name'];
      });
    }
  });

  function placeFilter (amenityIds) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({'amenities': amenityIds}),
      contentType: 'application/json',
      dataType: 'json',
      success: function (places) {
        $('SECTION.places').empty();
        $('SECTION.places').append('<h1>Places</h1>');
        $.each(places, function (i, place) {
          $('SECTION.places').append('<article></article>');
          $('SECTION.places > article:last')
            .append('<div class="title"></div>')
            .append('<div class="information"></div>')
            .append('<div class="user"></div>')
            .append('<div class="description"></div>');
          $('DIV.title:last')
            .append('<h2>' + place.name + '</h2>')
            .append('<div class="price_by_night">$' + place.price_by_night + '</div>');
          $('DIV.information:last')
            .append('<div class="max_guest"></div>')
            .append('<div class="number_rooms"></div>')
            .append('<div class="number_bathrooms"></div>');
          $('DIV.user:last')
            .append('<strong>Owner:</strong> ' + userNames[place.user_id]);
          $('DIV.max_guest:last')
            .append('<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests');
          $('DIV.number_rooms:last')
            .append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms');
          $('DIV.number_bathrooms:last')
            .append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom');
          $('SECTION.places > article:last > div.description').append('<div class="description">' + place.description + '</div>');
        });
      }
    });
  };

  placeFilter(Object.keys(amenityDict));

  $('button').click(() => {
    placeFilter(Object.keys(amenityDict));
  });
});
