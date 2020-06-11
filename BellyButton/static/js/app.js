function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
      d3.json(`/metadata/${sample}`).then((data) => {
          // Use d3 to select the panel with id of `#sample-metadata`
          var Mdata = d3.select("#sample-metadata");
          // Use `.html("") to clear any existing metadata
          Mdata.html("");
          // Use `Object.entries` to add each key and value pair to the panel
          // Hint: Inside the loop, you will need to use d3 to append new
          // tags for each key-value in the metadata.
          Object.entries(data).forEach(([key, value]) => {
            Mdata.append("h6").text(`${key}:${value}`);
          })
          // BONUS: Build the Gauge Chart
          // buildGauge(data.WFREQ);
            buildGauge(data.WFREQ);
      })
  }
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to Fetch the Sample Data for the Plots
    d3.json(`/samples/${sample}`).then((data) => {
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
  
      let bubbleData = [
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
  
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      let barData = [
        {
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
      
      let barLayout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("plot", barData, barLayout)
  })
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
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