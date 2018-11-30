var chartCo2 = document.getElementById('chartCo2').getContext('2d');

var chart_co2 = new Chart(chartCo2, {
    
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            lineTension: 0.1,
            backgroundColor: "rgba(163, 237, 230,1)",
            borderColor: "rgba(255, 79, 1,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
        }]
    },
    options: {
        title: {
            fontColor:"#6a9a1f",
            fontSize:25,
            display: true,
            text: 'CO2 Injection'
        },
        legend:{
            display:false,
        },
        scales: {
            xAxes: [{
                ticks:{
                    beginAtZero:true
                }
            }]
        }
    }
});

function co2_adddata(index,local,data,labels) {
    chart_co2.data.datasets[local].data[index] = data;
    chart_co2.data.labels[index] = labels;
    Chart.defaults.global.showTooltips = false;
    chart_co2.update();
}
var socket = io("localhost:3000");
socket.on('datasendCli',(data)=>{
    var i=0,j=0;
    var maxAtTimeCo2=0,minAtTimeCo2=0;
    var maxCo2=data[1].co2,minCo2=data[1].co2;
    var sumco2=0;
    while(typeof data[i] !="undefined"){
        
        if(maxCo2<=data[i].co2){
            maxCo2=data[i].co2;
            maxAtTimeCo2=data[i].thoigian;
        }
        if(minCo2>=data[i].co2){
            console.log(data[i].co2)
            minCo2=data[i].co2;
            minAtTimeCo2=data[i].thoigian;
        }
        sumco2+=parseInt(data[i].co2);
        i++;
    }

    if(data.length>7){
        for(i=data.length-8;i<data.length;i++){
            co2_adddata(i-data.length+8,0,data[i].co2,data[i].thoigian);
        }
    }else{
        for(i=0;i<data.length;i++){
            co2_adddata(i,0,data[i].co2,data[i].thoigian);
        }
    }
    
    var co2table= document.getElementById("co2table").rows[1].cells;
    var co2table1= document.getElementById("co2table").rows[2].cells;
    var co2table2= document.getElementById("co2table").rows[3].cells;
    var co2table4= document.getElementById("co2table").rows[0].cells;
    co2table[1].innerHTML=maxCo2+" ppm";
    co2table[2].innerHTML=maxAtTimeCo2;
    co2table1[1].innerHTML=minCo2+" ppm";
    co2table1[2].innerHTML=minAtTimeCo2;
    co2table2[1].innerHTML='<span class="label label-success">'+Math.round(sumco2*10/data.length)/10+" ppm"+'</span>';
    
    co2table4[1].innerHTML=data[data.length-1].co2+" ppm";
    co2table4[2].innerHTML=data[data.length-1].thoigian;
});
socket.on("server-send-bang1",(data)=>{
    
})
var today = new Date();
    var now = today.toDateString();
    now = now.replace(/\s/g, '_');

