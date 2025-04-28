// import Chart from 'chart.js/auto';
// import Papa from 'papaparse';


// fetch('./data/data.csv') 
//     .then(response => response.text())
//     .then(csvData => {
//         const parsedData = Papa.parse(csvData, { header: true });
//         const labels = parsedData.data.map(row => row['Label']); 
//         const values = parsedData.data.map(row => parseFloat(row['Value'])); 

//         const ctx = document.getElementById('myBarChart').getContext('2d');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels, // X-axis labels
//                 datasets: [{
//                     label: 'Dataset Label',
//                     data: values, // Y-axis values
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     })
//     .catch(error => console.error('Error loading data:', error));
