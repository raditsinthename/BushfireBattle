
function edit(){
	var popup = document.getElementById("user_edit");
	popup.style.visibility="visible";
}

function updateA(image){
	$.post(window.location.href.split('/')[1]+'/login/update?image='+image);
}

function updateC(color){
	$.post(window.location.href.split('/')[1]+'/login/update?color='+color);
}