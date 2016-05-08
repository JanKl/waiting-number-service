function nextCustomer(deskNumber) {
  $.ajax({
    url: '/waitingTicket/nextTicket',
    method: 'GET',
    dataType: 'json',
    success: function success(nextWaitingTicket) {
      assignCustomer(nextWaitingTicket.id, nextWaitingTicket.callNumber, deskNumber);
    },
    error: function error(errorObject) {
      if (errorObject.status == 404) {
        alert('No customer is waiting');
      } else {
        alert('An error occured.');
        $('#nextCustomerButton').removeClass('disabled');
      }
      
      $('#nextCustomerButton').removeClass('disabled');
    }
  });
}

function assignCustomer(ticketId, ticketNumber, deskNumber) {
  $.ajax({
    url: '/waitingTicket/' + parseInt(ticketId) + '/takeIntoProcess?deskNumber=' + parseInt(deskNumber),
    method: 'PUT',
    success: function success() {
      $('#nextTicketNumber').text(ticketNumber);
      $('#nextCustomerButton').removeClass('disabled');
    },
    error: function error(errorObject) {
      console.log(errorObject);
      
      if (errorObject.status == 409) {
        // Ticket was already taken by another agent, try again.
        nextCustomer(deskNumber);
      } else {
        alert('An error occured.');
        $('#nextCustomerButton').removeClass('disabled');
      }
    }
  });
}

$(function ready() {
  $('#nextCustomerForm').submit(function nextCustomerFormSubmitHandler(event) {
    event.preventDefault();
    
    var deskNumber = $('#deskNumber').val();
    
    if (!deskNumber || deskNumber == 0) {
      alert('Please enter your desk\'s number');
      return;
    }
    
    $('#nextCustomerButton').addClass('disabled');
    nextCustomer(deskNumber);
  });
});