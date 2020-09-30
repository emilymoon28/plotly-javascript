
d3.json("./data/samples.json").then(function(data){
    var names = data.names;
    var info = data.metadata;
    var samples = data.samples;

    var infoCard=d3.select("#sample-metadata")

    //populating dropdown manue
    var selectTag = d3.select("select");

    //we have select all options tags from inside select tag (which there are 0 atm)
    //and assigned data as to be the base of modelling that selection.
    var options = selectTag.selectAll('option')
                  .data(info);

    //if we had some elements from before, they would be reused, and we could access their
    //selection with just `options`
    options.enter()
        .append('option')
        .attr('value', function(d) {
               return d.id;
        })
        .text(function(d) {
            return d.id;
        });
     
    //creat Demographic Info
    function buildInfobox(ID){
        infoCard.html("");

        var infoResult=info.filter(person=>person.id.toString()===ID)[0];
        console.log(infoResult);
       
        Object.entries(infoResult).forEach(([key,value])=>{
            infoCard.append("h6").text(`${key}: ${value}\n`)
        });
    };

    //create bar chart
    function plotBar(ID){
        // Initialize bar chart x and y arrays
        var x = [];
        var y = [];
        var z = [];

        var barResult=samples.filter(sample=>sample.id.toString()===ID)[0]
        top10Values=barResult.sample_values.slice(0,10);
        top10Otu=barResult.otu_ids.slice(0,10).map(value=>`OTU ${value}`);
        top10Labels=barResult.otu_labels.slice(0,10);

        x=top10Values.reverse();
        y=top10Otu.reverse();
        z=top10Labels.reverse();

        var trace1={
            x: x,
            y: y,
            type:"bar",
            text:z,
            orientation:'h'
        };
       var data=[trace1];

       var layout = {
            title: "Top 10 OTUs and Values"
        };

       console.log(data);

       Plotly.newPlot('bar',data,layout);   
    };

    //create bubble chart
    function plotBubble(ID){
       //initial bubble chart
       var ids=[];
       var values=[];
       var labels=[];

       var bubbleResult=samples.filter(sample=>sample.id.toString()===ID)[0]

       ids=bubbleResult.otu_ids;
       values=bubbleResult.sample_values;
       labels=bubbleResult.otu_labels;

       var trace2 = {
          x:ids,
          y:values,
          text:labels,
          mode:'markers',
          marker: {
              color:ids,
              size:values,
              //sizemode:'diameter'
            }
       };

       var layout2 = {
           title: "OTU and Values",
           xaxis: {title:{text:"OTU ID"}},
           yaxis: {title:{text:"Value"}}
       };

      var data2=[trace2];
      console.log(data2);

      Plotly.newPlot('bubble',data2,layout2);

    };

    //plot Gauge Chart
    function plotGauge(ID){

        var gaugeResult=info.filter(person=>person.id.toString()===ID)[0];

        // Enter a speed between 0 and 180
        var level = parseFloat(gaugeResult.wfreq)*20;

        // Trig to calc meter point
        var degrees = 180 - level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data3 = [{ 
                type: 'scatter',
                x: [0], 
                y:[0],
                marker: {size: 10, color:'850000'},
                showlegend: false,
                name: 'speed',
                text: level,
                hoverinfo: 'text+name'},

                { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                    rotation: 90,
                    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
                    textinfo: 'text',
                    direction: 'clockwise',
                    textposition:'inside',
                    marker: {colors:["rgb (212, 239, 223)",
                    "rgb (169, 223, 191)",
                    "rgb (125, 206, 160)",
                    "rgb (82, 190, 128)",
                    "rgb (39, 174, 96)",
                    "rgb (34, 153, 84)",
                    "rgb (30, 132, 73)",
                    "rgb (25, 111, 61)",
                    "rgb (20, 90, 50)",
                    "white"]},
                    labels:['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
                    hoverinfo: 'label',
                    hole: .5,
                    type: 'pie',
                    showlegend: false
                }];

        var layout = {
            title:"Belly Button Washing Frequency<br> Scrubs per Week",
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                  color: '850000'
                }
              }],
            height: 500,
            width: 500,
            xaxis: {zeroline:false, showticklabels:false,
                       showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                       showgrid: false, range: [-1, 1]}
        };
        Plotly.newPlot('gauge',data3,layout);


    };



    //display defualt plots as ID=940
    function init(){
        //initial demographic info box
        buildInfobox('940');

        //initial bar chart
        plotBar('940');

        //initial bubble char
        plotBubble('940');

        //initial gauge chart
        plotGauge('940');
        
    }

    init();

    //call the function when a change takes place
    selectTag.on("change",updatePlotly);

    function updatePlotly(){
        //grab selected value
        var selectedValue=selectTag.property("value");
        console.log(selectedValue);

        //create info panel
        buildInfobox(selectedValue);
        
        //update bar chart
        plotBar(selectedValue);

        //update bubble chart
        plotBubble(selectedValue);

        //update gauge chart
        plotGauge(selectedValue);
    };
    
   
});


