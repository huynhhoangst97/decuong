    var chartHum = document.getElementById('chartHum').getContext('2d');
    let element_hum = document.querySelector('#hum')

    var chart_hum = new Chart(chartHum, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                lineTension: 0.1,
                backgroundColor: "rgba(78, 177, 186,0.1)",
                borderColor: "rgba(78, 177, 186,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(78, 177, 186,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(78, 177, 186,1)",
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

    function hum_adddata(index,local,data,labels) {
        chart_hum.data.datasets[local].data[index] = data;
        chart_hum.data.labels[index] = labels;
        Chart.defaults.global.showTooltips = false;
        chart_hum.update();
    }
    var socket = io("localhost:3000");
    socket.on('datasendCli',(data)=>{
        var i=0,j=0;
        var maxAtTimeHum=0,minAtTimeHum=0;
        var maxHum=data[1].doam,minHum=data[1].doam;
        var sumHum=0;
        while(typeof data[i] !="undefined"){
            if(maxHum<=data[i].doam){
                maxHum=data[i].doam;
                maxAtTimeHum=data[i].thoigian;
            }
            if(minHum>=data[i].doam){
                minHum=data[i].doam;
                minAtTimeHum=data[i].thoigian;
            }
            sumHum+=parseInt(data[i].doam);
            i++;
        }
        console.log(data[1].thoigian);
        if(data.length>7){
            for(i=data.length-8;i<data.length;i++){
                hum_adddata(i-data.length+8,0,data[i].doam,data[i].thoigian);
            }
        }else{
            for(i=0;i<data.length;i++){
                hum_adddata(i,0,data[i].doam,data[i].thoigian);
            }
        }
        var humtable= document.getElementById("humtable").rows[0].cells;
        var humtable1= document.getElementById("humtable").rows[1].cells;
        var humtable2= document.getElementById("humtable").rows[2].cells;
        humtable[1].innerHTML=maxHum+" %";
        humtable[2].innerHTML=maxAtTimeHum;
        humtable1[1].innerHTML=+minHum+" %";
        humtable1[2].innerHTML=minAtTimeHum;
        humtable2[1].innerHTML='<span class="label label-success">'+Math.round(sumHum/data.length)+" %"+'</span>';
    });

    socket.on('server-send-bang1',(data)=>{
        let opts = {
            angle: 1, // The span of the gauge arc
            lineWidth: 0.1, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.6, // // Relative to gauge radius
              strokeWidth: 0.035, // The thickness
              color: 'rgba(78, 177, 186)' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: 'rgba(78, 177, 186)',   // Colors
            colorStop: 'rgba(78, 177, 186)',    
            strokeColor: '#EEEEEE',  
            generateGradient: true,
            highDpiSupport: true,    
            
          };
          var target = document.getElementById('hum'); // your canvas element
          var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
          gauge.maxValue = 100; // set max gauge value
          gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
          gauge.animationSpeed = 32; // set animation speed (32 is default value)
          gauge.set(data.doam); // set actual value
          gauge.setTextField(document.getElementById("preview-textfield"));
    });



    var today = new Date();
        var now = today.toDateString();
        now = now.replace(/\s/g, '_');