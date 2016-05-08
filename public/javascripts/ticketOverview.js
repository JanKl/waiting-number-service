function updateOverviewBoard() {
  $.getJSON('/waitingTicket', function success(allWaitingTickets) {
    $('#waitingTicketsTable tbody').empty();
    
    var allWaitingTicketsCount = allWaitingTickets.length;
    for (var i = 0; i < allWaitingTicketsCount; ++i) {
      var deskNumberOutput = '(waiting)';
      var classOutput = '';
      
      if (allWaitingTickets[i]['deskNumber'] != 0) {
        deskNumberOutput = allWaitingTickets[i]['deskNumber'];
        var classOutput = 'success';
      }
      
      $('#waitingTicketsTable tbody:last-child').append('<tr class="' + classOutput + '"><td>' + escapeHtml(allWaitingTickets[i]['callNumber']) + '</td><td>' + escapeHtml(deskNumberOutput) + '</td></tr>');
    }      
  });
}

$(function ready() {
  updateOverviewBoard();
  setInterval(updateOverviewBoard, 1000);
});