$(document).ready(function () {
	var socket= io("localhost:3000");
	socket.on("server-send-bang1",function(data) {
		var hang1= document.getElementById("tab1").rows[1].cells;
		hang1[1].innerHTML=data.nhietdo+" ℃";

		var hang2= document.getElementById("tab1").rows[2].cells;
		hang2[1].innerHTML=data.doam+" %";

		var hang3= document.getElementById("tab1").rows[3].cells;
		hang3[1].innerHTML=data.anhsang+ " LUX";

		var hang4= document.getElementById("tab1").rows[4].cells;
		hang4[1].innerHTML=data.co2+ " ppm";
	})

	
	socket.on("server-send-bang2",function(data) {
		var hang1= document.getElementById("tab2").rows[1].cells;
		hang1[1].innerHTML=data.ph+" pH";

		var hang2= document.getElementById("tab2").rows[2].cells;
		hang2[1].innerHTML=data.ec+" ms/cm";

		var hang3= document.getElementById("tab2").rows[3].cells;
		hang3[1].innerHTML=data.waterTemp+" ℃";

		var hang4= document.getElementById("tab2").rows[4].cells;
		hang4[1].innerHTML=data.Oxygen+" ppm";
	})
})