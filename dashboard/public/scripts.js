const loadData = () => {
  fetch("/api/temperature")
    .then(response => {
      if (response.status !== 200) {
        console.log(response);
      }
      return response;
    })
    .then(response => response.json())
    .then(parsedResponse => {
      const unpackData = (arr, key) => {
        return arr.map(obj => obj[key]);
      };
      const data = [
        {
          type: "scatter",
          mode: "lines",
          name: "Temperature",
          x: unpackData(parsedResponse, "time"),
          y: unpackData(parsedResponse, "temp"),
          line: { color: "#17BECF" }
        }
      ];
      const layout = {
        yaxis: {
          title: {
            text: "Temperature (°C)"
          },
          showspikes: true
        },
        xaxis: {
          title: {
            text: "Reading Time"
          },
          showspikes: true
        }
      };
      return Plotly.newPlot("graphs-container", data, layout);
    })
    .catch(error => console.log(error));
};

$(window).on("load", loadData);
