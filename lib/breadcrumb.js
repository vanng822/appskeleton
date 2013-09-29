/**
 * data:
 * 	[
 * 	{url: String,
 * 	text: String}
 * ]
 */
var Breadcrumb = function(data, separator) {
	this.data = data;
	this.separator = separator;
};

Breadcrumb.prototype = {
	prepare : function() {
		return this.data;
	},
	renderChild : function(item, close) {
		var html = '';
		html += '<span rel="v:child">'
		html += '<span typeof="v:Breadcrumb">';
		html += '<a href="' + item.url + '" rel="v:url" property="v:title">';
		html += item.text;
		html += '</a>';
		html += this.separator;
		if (close) {
			html += '</span>';
		}
		return html;
	},
	render : function() {
		var i, len, data = this.prepare(), html = '', endspans = '';
		len = data.length;
		if(len > 0) {
			html += '<div xmlns:v="http://rdf.data-vocabulary.org/#">';
			html += '<span typeof="v:Breadcrumb">';
			html += '<a href="' + data[0].url + '" rel="v:url" property="v:title">';
			html +=	data[0].text;
			html += '</a>';
			html += this.separator;
			for( i = 1; i < len - 1; i++) {
				html += this.renderChild(data[i]);
				endspans += '</span>';
			}
			endspans += '</span>';
			if (len > 1) {
				html += data[i].text;
			}
			html += endspans;
			html += '</div>';
		}
		return html;
	}
};

module.exports = {
	breadcrumb : function(data, separator) {
		var separator = separator || '&nbsp;&#8250;&nbsp;';
		return new Breadcrumb(data, separator).render();
	}
};
