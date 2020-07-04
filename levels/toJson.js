const fs = require('fs');
const path = require('path');

fs.readdirSync(__dirname)
	.filter(file => /^l[0-9a-z-]+\.js$/i.test(file))
	.map(file => path.join(__dirname, file))
	.forEach(file => {
		const level = require(file);
		fs.writeFile(file + 'on', JSON.stringify(level), (err) => {
			if (err) console.log(err);
		})
	});
