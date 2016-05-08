function pullTicket() {
  $.getJSON('/waitingTicket/newTicket', function success(newWaitingTicket) {
    $('#newTicketNumber').text(newWaitingTicket.callNumber);
    $('#pullTicketButton').removeClass('disabled');
  });
}

$(function ready() {
  $('#pullTicketButton').click(function pullTicketButtonClickHandler() {
    $('#pullTicketButton').addClass('disabled');
    pullTicket();
  });
});