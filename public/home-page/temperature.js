var chartTemp = document.getElementById('chartTemp').getContext('2d');
let element_temp = document.querySelector('#temp')

var chart_temp = new Chart(chartTemp, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            lineTension: 0.1,
            backgroundColor: "rgba(255, 79, 1,0.1)",
            borderColor: "rgba(255, 79, 1,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(255, 79, 1,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255, 79, 1,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
        }]
    },
    options: {
        legend:{
            display:false,
        },
        scales: {
            yAxes: [{
                ticks:{
                    beginAtZero:true
                }
            }]
        }
    }
});

function temp_adddata(index,local,data,labels) {
    chart_temp.data.datasets[local].data[index] = data;
    chart_temp.data.labels[index] = labels;
    Chart.defaults.global.showTooltips = false;
    chart_temp.update();
}
var socket = io("localhost:3000");
socket.on('datasendCli',(data)=>{
    var i=0,j=0;
    var maxAtTimeTemp=0,minAtTimeTemp=0;
    var maxTemp=data[1].nhietdo,minTemp=data[1].nhietdo;
    var sumTemp=0;
    while(typeof data[i] !="undefined"){
        
        if(maxTemp<=data[i].nhietdo){
            maxTemp=data[i].nhietdo;
            maxAtTimeTemp=data[i].thoigian;
        }
        if(minTemp>=data[i].nhietdo){
            console.log(data[i].nhietdo)
            minTemp=data[i].nhietdo;
            minAtTimeTemp=data[i].thoigian;
        }
        sumTemp+=parseInt(data[i].nhietdo);
        i++;
    }

    if(data.length>7){
        for(i=data.length-8;i<data.length;i++){
            temp_adddata(i-data.length+8,0,data[i].nhietdo,data[i].thoigian);
        }
    }else{
        for(i=0;i<data.length;i++){
            temp_adddata(i,0,data[i].nhietdo,data[i].thoigian);
        }
    }
    
    var temptable= document.getElementById("temptable").rows[0].cells;
    var temptable1= document.getElementById("temptable").rows[1].cells;
    var temptable2= document.getElementById("temptable").rows[2].cells;
    temptable[1].innerHTML=maxTemp+" ℃";
    temptable[2].innerHTML=maxAtTimeTemp;
    temptable1[1].innerHTML=minTemp+" ℃";
    temptable1[2].innerHTML=minAtTimeTemp;
    temptable2[1].innerHTML='<span class="label label-success">'+Math.round(sumTemp/data.length)+" ℃"+'</span>';
    $( ".today" ).append(now);
});
socket.on('server-send-bang1',(data)=>{
    let gaugeOptions = {
        hasNeedle: false,
        needleColor: 'gray',
        needleUpdateSpeed: 1000,
        arcColors: ['#FF4F01', 'lightgray'],
        arcDelimiters: [data.nhietdo*2],
        rangeLabel: ['0', '50'],
        centralLabel: ''+data.nhietdo+'℃',
      }
    GaugeChart
  .gaugeChart(element_temp, 300, gaugeOptions)
  .updateNeedle(data.nhietdo*2)
});



var today = new Date();
    var now = today.toDateString();
    now = now.replace(/\s/g, '_');

