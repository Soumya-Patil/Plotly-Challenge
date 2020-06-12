
// function that builds the metadata panel
function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    d3.json("data/samples.json").then((data) => {

        // Use d3 to select the panel with id of `#sample-metadata`
        var Mdata = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        Mdata.html("");

        // Use `Object.entries` to add each key and value pair to the panel and append
        Object.entries(data).forEach(([key, value]) => {
          Mdata.append("h6").text(`${key}:${value}`);
        })
        
    })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to Fetch the Sample Data for the Plots
  d3.json("data/samples.json").then((data) => {
    // @TODO: Build a Bubble Chart Using the Sample Data
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    // @TODO: Build a Pie Chart
    let bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "out_id"}
    }

    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.plot("bubble", bubbleData, bubbleLayout);
    

    // create trace for bar chart 
    var barChart = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "bar",
        orientation: "h"
      }
    ];

  // Apply the group bar mode to the layout
  var barlayout = {
    title: "OTU Results",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

    
    

    Plotly.plot("bar", barChart, barLayout)
})
}

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    data.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = data[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


