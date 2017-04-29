var socket = io.connect('http://localhost:3000');
// socket.emit('dpUpdate',{});
socket.on('refresh', reloadPage);
function reloadPage(){
	if(!document.getElementById('feedbackarea').value || 
		document.getElementById('feedbackarea').value == ""
		){
		window.location = window.location.href;
	}
	else{
		setTimeout(reloadPage,1000);
		}
}
