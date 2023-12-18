// Given URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    // Fetch the json data
    d3.json(url).then(function (alldata) {
        // Initialize dropdown
        initDropdown(alldata.names);

        // Pass the first subject and call the functions
        updateCharts(alldata, alldata.names[0]);
    });
}

function initDropdown(names) {
    // Use D3 to select in the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Populate dropdown
    names.forEach(function (id) {
        dropdownMenu.append("option").text(id).property("value");
    });
}

function updateCharts(alldata, selectedValue) {
    // Get sample data for the selected subject
    let id = alldata.samples.find(take => take.id == selectedValue);

    // Get data for each of the  charts
    let sample_values = id.sample_values;
    let otu_ids = id.otu_ids;
    let otu_labels = id.otu_labels;

    // Call function to display charts
    displayCharts(sample_values, otu_ids, otu_labels);

    // Call function, update metadata
    updateMetadata(alldata, selectedValue);
}

function displayCharts(sample_values, otu_ids, otu_labels) {
    // Data bar chart
    let bar_data = [{
        type: 'bar',
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels,
        orientation: 'h',
        marker: {
            color: 'Purple' 
        }
    }];
    // Data bubble chart
    let bubble_data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            colorscale: 'Red',
            size: sample_values
        }
    }];

    //  bar chart
    let bar_layout = {
        title: 'Bar Chart',
        height: 600,
        width: 800
    };

    // bubble chart
    let bubble_layout = {
        title: 'Bubble Chart',
        height: 500,
        width: 900
    };

    // display charts
    Plotly.newPlot('bar', bar_data, bar_layout);
    Plotly.newPlot('bubble', bubble_data, bubble_layout);
}

function updateMetadata(alldata, selectedValue) {
    // Retrieve metadata for the selected subjec
    let metadata = alldata.metadata.find(take => take.id == selectedValue);

    // metadata selection
    let sample_metadata = d3.select('#sample-metadata').html('');

    // Iterate through the values and display information 
    Object.entries(metadata).forEach(([key, value]) => {
        sample_metadata.append("h5").text(`${key}: ${value}`);
    });
}

// Init. the dashboard
init();
