class Graph{
  constructor(data,config)
  {
    this.data = data;
    this.data.load().then(()=>{
      console.log(data.resp);
      let data_x = [];
      let data_y = [];
      data.resp.map((el,ele)=>{
          data_x.push(el[Object.getOwnPropertyNames(el)[0]]);
          data_y.push(el[Object.getOwnPropertyNames(el)[1]]);
      })
      console.log(data_x,data_y);
      document.getElementById('myChart').onclick= (evt)=>{
            let activePoints = this.myChart.getElementsAtEvent(evt);
            let firstPoint = activePoints[0];
            let label = this.myChart.data.labels[firstPoint._index];
            let value = this.myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
            console.log(label + ": " + value);
        };

      let ctx = document.getElementById('myChart').getContext('2d');
      this.myChart = new Chart(ctx, {
        type: 'line',
        responsive: true,
        data: {
            labels: data_x,
            datasets: [{
                label: 'Kasa na koncie',
                data: data_y,
                borderColor:'rgb(0,255,0,0.4)',
                backgroundColor:'rgb(0,255,0,0.4)',
                pointRadius: 5,
                pointHoverRadius: 8,
                fill:false
            }],
        },
        options: {
          legend: {
						position: 'bottom',
					},
          tooltips: {
						mode: 'index',
						intersect: false,
					},
					hover: {
						mode: 'index',
						intersect: false
					},
        scales: {
            xAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                      if (index% 1 == 0) return value;
                        return null;
                    }
                }
            }]
        }
      }
    })
    //   this.myChart = new Chart(ctx, {
    //     type: 'line',
    //     responsive: true,
    //     data: {
    //         labels: data_x,
    //         datasets: [{
    //             label: 'Kasa na koncie',
    //             data: data_y,
    //             borderColor:'rgb(0,255,0,0.4)',
    //             backgroundColor:'rgb(0,255,0,0.4)',
    //             pointRadius: 5,
    //             pointHoverRadius: 8,
    //             fill:false
    //         }],
    //     },
    //     options: {
    //       legend: {
		// 				position: 'bottom',
		// 			},
    //       tooltips: {
		// 				mode: 'index',
		// 				intersect: false,
		// 			},
		// 			hover: {
		// 				mode: 'index',
		// 				intersect: false
		// 			},
    //     scales: {
    //         xAxes: [{
    //             ticks: {
    //                 callback: function(value, index, values) {
    //                   if (index% 1 == 0) return value;
    //                     return null;
    //                 }
    //             }
    //         }]
    //     }
    //   }
    // })

  })
}

}
