
/**
 * 
 * @param {*}  match fileName is Include name
 * @returns * 
 */
const matchPattern = function (name) {
	if(!name) return false;
	return /\.(png|jpg|jpeg|webp)$/.test(name);
}

module.exports = matchPattern;

