const webUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let wholeData;
let sample_values;
let otu_ids;
let otu_labels;



//Fetches data & sets up all dashboard components------------------------------------
d3.json(webUrl).then((data) => {
    wholeData = data;
    const subjects_test = data.names;
    const filter_data = getSamples(subjects_test[0], data);
    sample_values = filter_data.sample_values;
    otu_ids = filter_data.otu_ids;
    otu_labels = filter_data.otu_labels;
    dropDown(subjects_test);
    barChart(otu_ids, sample_values, otu_labels);
    bubbleChart(otu_ids, sample_values, otu_labels);
    demoGraphics(subjects_test[0], data);
});
// Appends the subject after iterating--------------------------------------------------
function dropDown(subject) {
    const drop_down = d3.select("#selDataset").node();
    for(let i = 0; i < subject.length; i++) {
        const opt = subject[i];
        const el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        drop_down.appendChild(el);
    }
}
//Retrieves data for a single test subject------------------------------------------------
function getSamples(id, data) {
    const sampleData = data.samples.find(sample => sample.id === id);
    if (sampleData) {
        return sampleData;
    } else {
        return [];
    }
}
//Locate the metadata associated with an ID,include their info---------------------------
function demoGraphics(id, data) {
    const demo = data.metadata.find(mtd => mtd.id.toString() === id);
    demoDisplay = d3.select("#sample-metadata");
    demoDisplay.selectAll("p").remove();
    demoDisplay.append("strong").append("p").text(`id: ${demo.id}`);
    demoDisplay.append("strong").append("p").text(`ethnicity: ${demo.ethnicity}`);;
    demoDisplay.append("strong").append("p").text(`gender: ${demo.gender}`);
    demoDisplay.append("strong").append("p").text(`age: ${demo.age}`);
    demoDisplay.append("strong").append("p").text(`location: ${demo.location}`);
    demoDisplay.append("strong").append("p").text(`bbtype: ${demo.bbtype}`);
    demoDisplay.append("strong").append("p").text(`wfreq: ${demo.wfreq}`);
}
//Bar chart with a dropdown menu to display the top 10 OTUs---------------------------------
function barChart(ids, values, labels) {
    const y_data = ids.map(otu_ids => "OTU " + otu_ids);
    const trace = {
        type: "bar",
        orientation: "h",
        x: values.slice(0, 10).reverse(),
        y: y_data.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse()
    };
    const plotData = [trace];
    const layout = {
        title:false
    };
    Plotly.newPlot("bar", plotData, layout)
}
//Animate the transition to updated data-----------------------------------------------------
function barChartInteractive(ids, values, labels) {
    const y_data = ids.map(otu_ids => "OTU " + otu_ids);
    const updatedTrace = {
        type: "bar",
        orientation: "h",
        x: values.slice(0, 10).reverse(),
        y: y_data.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse()
    };
    const animation = {
        data: [updatedTrace],
        traces: [0],
        layout: {},
    };
    Plotly.animate("bar", animation, {
        transition: {
            duration: 1000
        }, frame: {
            duration: 1000,
            redraw: true
        }
    });
}
//Create a bubble chart that displays each sample----------------------------------------
function bubbleChart(ids, values, labels) {
    const trace = {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
            size: values,
            color: ids,
            colorscale: "Cividis",
            sizeref: 2
        }
    };
    const plotData = [trace];
    const layout = {
        title: "",
        height: 500,
        xaxis: {range: [0, 4000]},
        yaxis: {range: [0, 700]}
    };
    Plotly.newPlot("bubble", plotData, layout);
}
//Animate the created bubble chart--------------------------------------------------------
function bubbleInteractive(ids, values, labels) {
    const updatedTrace = {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
            size: values,
            color: ids,
            colorscale: "Cividis",
            sizeref: 2
        }
    };
    const xMax = Math.max(...ids);
    const yMax = Math.max(...values);
    const layout = {
        title: ""
    };
    //Update when a new sample is selected
    Plotly.update("bubble");
    const animation = {
        data: [updatedTrace],
        traces: [0]
    };
    Plotly.animate("bubble", animation, {
        transition: {
            duration: 1000
        }, frame: {
            duration: 1000,
            redraw: true
        }
    });
}
//If there's a change in the selected from the dropdown.--------------------------------------
function optionChanged(val) {
    newData = getSamples(val, wholeData);
    sample_values = newData.sample_values;
    otu_ids = newData.otu_ids;
    otu_labels = newData.otu_labels ;
    barChartInteractive(otu_ids, sample_values, otu_labels);
    demoGraphics(val, wholeData);
    bubbleInteractive(otu_ids, sample_values, otu_labels);
}// end----------------------------------------------------------------------------------------