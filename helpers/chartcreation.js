// This module is used to create a chart from the each month's average values. The function takes a
// monthly documents array as it's parameter. First an xtics string is created. This will be the values
// of the x-axis, that is the months that are included in the monthly documents. The values of each
// are pushed to the A array. The next step is to create a new plot file. This will include the commands
// for creating the chart. The plot file is created with fs.writeFileSync()-operation, where the plot
// commands are written to the new plot1-file. We then spawn a gnuplot instance as a child process.
// For that the working directory is first changed to the gnuplot directory. This must be specified in
// the .env file. The gnuplot instance reads the plot1 file and creates a chart from it. The chart is
// saved to an image file. After creating the file the working directory is returned back to normal.
// Finally the plot1 file gets deleted.

const { spawnSync } = require('child_process');
const fs = require('fs');
var path = require('path');
const process = require('process');

module.exports = {

    "createChart": async (monthly_documents, cb) => {
		
		let A = [];
		let xtics = '';
		let i = 1;
		await monthly_documents.forEach(monthly_document => {
			if (monthly_document.avg != 'NaN') {
				if (xtics == '') {
					xtics = xtics + "'" + monthly_document.month + " / " + monthly_document.year + "' " + i;
				} else {
					xtics = xtics + ", '" + monthly_document.month + " / " + monthly_document.year + "' " + i;
				}
			}
			i++;
			A.push(monthly_document.avg);
		});
		let A_length = A.length;
		
		let filepath = path.join(__dirname, '..').replace(/\\/g, '\\\\');
		let filepath_to_images = filepath + '\\images';
		
		let plot = `
			cd '${filepath_to_images}'
			array A[${A_length}] = [${A}]
			set autoscale
			set xtics (${xtics})
			set boxwidth 0.5
			set style fill solid
			set terminal png
			set output 'image.png'
			plot A using 1:2 with boxes
		`;
		
		fs.writeFileSync('plot1.p', plot);
        
		process.chdir(process.env.GNUPLOT_WD);
		spawnSync('gnuplot ' + filepath + '\\plot1.p', { shell: true });
		process.chdir(path.join(__dirname, '..'));
        fs.unlinkSync(path.join(__dirname, '../', 'plot1.p'));

        cb();

    }

}