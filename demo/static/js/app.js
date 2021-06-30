// Getting html class
const forecastBtn = document.querySelector('.button');
const twoDiv = document.querySelector('.sectionTwoDiv');
const uploadBtn = document.querySelector('.uploadButton');
const rollingInput = document.querySelector('.rollingInput');
const staticInput = document.querySelector('.staticInput');
const forecastMethod = document.querySelector('.forecastMethod');
const forecastMonth = document.querySelector('#forecastMonth');
const forecastFrm = document.querySelector('.forecastFrm'); // Main Section1 Form

// On Click forecasting button code

forecastBtn.addEventListener('click', () => {
	if (uploadBtn.value.length===0 && forecastMonth.value.length===0 && staticInput.checked===false && rollingInput.checked===false) {
		alert("Fill the input details")
	}
	else  if ( uploadBtn.value.length !==0 && forecastMonth.value.length===0 && rollingInput.checked === false && staticInput.checked === false) {
		alert("Fill the  radio input and forecasting months details");
	}
	else  if (uploadBtn.value.length===0){
		alert('Upload a File');
	}
	// else if( uploadBtn.value.length !==0 && forecastMonth.value.length===0 ){   // for now its commented 
	//   alert('Enter the forecasting months')
	// }
	else if (uploadBtn.value.length!==0 && rollingInput.checked === true || staticInput.checked === true) {
		
		twoDiv.style.display = 'block'; // on click the main div tags contents will get diplayed having Graphs and Text's
		uploadBtn.setAttribute('disabled', ''); // on click the uploadButton will get disabled until refresh

		if(document.getElementById("submitFile").value == "") {
			console.log("No file selected");
			//TODO: No File Do Error Handling
		}
		
		var fd = new FormData();
	
		// below on click the forecasting methods that one selects will be displayed (Radio button)
		if (staticInput.checked === true) {
			forecastMethod.innerHTML = 'ARIMA Forecast Method: Static ';
			fd.append('forecast_method', 'static');
		} else if (rollingInput.checked === true) {
			forecastMethod.innerHTML = 'ARIMA Forecast Method: Rolling';
			fd.append('forecast_method', 'rolling')
		}

		fd.append("forecastMonth", forecastMonth.value);
		fd.append("input_file", document.getElementById("submitFile").files[0]);
	
		$.ajax({
			url:window.location.protocol+'//'+window.location.host+'/predict',
			method: 'POST',
			data: fd,
			processData: false,
			contentType: false,
			success: function(response){
				
				console.log(response);
		
				// TODO: Use the data returned in response to modify the graph and table values
				// Graph Plotty
				// Variable declared
				var inputMonth= response.input_data.months.length + response.predictions.pred_months.length;
				var priceInputMonth = response.input_data.months;
				var CommaValue;
				for(CommaValue=0; CommaValue<priceInputMonth.length; CommaValue++){   // Trying that comma seperated for prediction y axis 
				console.log(',');
				}
				// x - months, y - Price Value
				var predictionData = {
				x: response.predictions.pred_months,
				y: response.predictions.pred_values,
				type: 'scatter',
				name: 'forecast', // "predictions" key in response object
				};
				
				var inputData = {
				x: response.input_data.months.concat(response.predictions.pred_months),
				y: response.input_data.price_values,  
				type: 'scatter',
				name:'Training' // "input_data" key in response object
				};
				var layout = {
				title: 'Cloud Cost Forecasting ',
				};
				
				var data = [inputData, predictionData];
				var layout = {
					title: 'Forecasted Graph',
					xaxis: {
					  title: 'Months and Years '
					},
					yaxis: {
					  title: 'Prices'
					  
					}};
				
				Plotly.newPlot('myDiv', data, layout);

				///TABLE Plotty///
				// Varaibles for Plotty Table Values
				var tableMonth=response.predictions.pred_months;
				var tablePrice=response.predictions.pred_values;

				//helper function that used to slice arrays 

				// Function to round the pred_values (eg: 401.3232323 to 401) 
				tablePrice = tablePrice.map(function(each_element){
					return Number(each_element.toFixed(0));
				});

				function spliceIntoChunks(arr, chunkSize) {
					const res = [];
					while (arr.length > 0) {
						const chunk = arr.splice(0, chunkSize);
						res.push(chunk);
					}
					return res;
				}

				var tableMonthSlice = spliceIntoChunks(tableMonth, 1)
				var tablePriceSlice = spliceIntoChunks(tablePrice, 1)

				var values = [
				tableMonthSlice,
				tablePriceSlice,
				];
				
				var data = [
				{
					type: 'table',
					header: {
					values: [
						['<b>Month</b>'],
						['<b>Price in USD</b>'],
					
					],
					align: 'center',
					line: { width: 1, color: 'black' },
					fill: { color: '#7550A6' },
					font: { family: 'Arial', size: 20, color: 'white' },
					},
					cells: {
					values,
					align: 'start',
					line: { color: '#7550A6', width: 2 },
					font: { family: 'Arial', size: 15, color: ['black'] },
					},
				},
				];
				
				Plotly.newPlot('myTable', data);
		
			},
			error: function(response){
				console.log(response)
			}    
		});
	}
});

// Plotty Graph Code HARDCODED
/*eslint-disable */
// var trace1 = {
//   x: [1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
//   y: [,,,,,,,,,,,,,,,,,,,,330,345,360,375],
//   type: 'scatter',
//   name: 'forecast',
// };

// var trace2 = {
//   x: [1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
//   y: [32,57,63.0,82.0,75.0,95.0,120.0,152.0,164.0,190.0,183.0,221.0,240.0,246.0,259.0,272.0,284.0,284.0,297.0,316.0,,,,,],
//   type: 'scatter',
//   name:'Training'
// };
// var layout = {
//   title: 'Cloud Cost Forecasting ',
// };

// var data = [trace1, trace2];

// Plotly.newPlot('myDiv', data, layout);

// Plotty Table Code
 
