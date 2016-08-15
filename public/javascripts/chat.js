
function getChat(){
	var popup = document.getElementById("chat_container");
	var button = document.getElementById("chat_button");
	popup.style.visibility="visible";
	button.style.visibility="hidden";
}


function closeChat(){
	var popup = document.getElementById("chat_container");
	var button = document.getElementById("chat_button");
	button.style.visibility="visible";
	popup.style.visibility="hidden";
}
