const cheerio = require('cheerio');
const req = require('tinyreq');

function scrape(url, data, cb) {
	// 1. request the HTML
	req(url, (err, body) => {
		if(err) { return err };

		// 2. load the html from the request into cheerio
		let $ = cheerio.load(body);
		let payload = {};

		// 3. Extract the data based on known elements from the page
		Object.keys(data).forEach(k => {
			payload[k] = {}
			payload[k].selector = data[k];
			payload[k].value = $(data[k]).text();
		});

		let nodes = $('*').toArray();
		let html = $('*').html();


		console.log(nodes)

		// 4. Send the extracted data back
		cb(null,nodes,html,payload);
	});
}

let args = {
	title: "title",
	header: "h1",
	paragraph: "p" 
};

scrape("http://www.example.com", args, (err,data,html,payload) => {
	if(err) { console.log(err) };
	if(data) { 
		// it aint pretty, but it looks nice in the terminal
		console.dir(data, { depth: null, colors: true })
		console.log('=========================================');
		console.log('   * This is the raw requested HTML *    ');
		console.log('=========================================\n');
		console.log(html + '\n');
		console.log('=========================================');
		console.log('      * Requested element values *'       );
		console.log('=========================================\n');
		console.log(JSON.stringify(payload) + '\n');
			Object.keys(payload).forEach(k => {
				let target = k;
				console.log(' => Target element given name: '+ target);
				console.log(' => Target element selector: '+ payload[target].selector);
				console.log(' => Target element value: '+ payload[target].value +'\n')
			});
		console.log('=========================================');
		console.log(' * This the parsed top-level DOM data *  ');
		console.log('=========================================\n');
			Object.keys(data).forEach(k => {
				let node = data[k];
				console.log(' * Element type => '+ node.type);
				console.log(' * Element name => '+ node.name);
				console.log(' * Element attributes => '+ JSON.stringify(node.attribs));
				console.log(' * Number of children => '+ node.children.length);
				console.log('\n--------------------\n');
			});
	};
});

// use depth to traverse?
// Circular-proof log: console.dir(data, { depth: null, colors: true })