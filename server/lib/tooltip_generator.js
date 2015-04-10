
var getHTML = function(item, event) {
  var v = "undefined";
  switch(item.type) {
    case 'line':
      try {
        eval('v = ' + item.value + ';');
      } catch (e) {
        console.log(e.message);
        console.log(e.stack);
      }
      break;
    case 'link':
      try {
        eval('var link = ' + item.value + ';');
        eval('var token = ' + item.token + ';');
      } catch (e) {
        console.log(e.message);
        console.log(e.stack);
      }
      if (item.href) {
        v = "<a href='" +
            item.href.replace(/#TOKEN#/g, token) +
            "' target='_blank'>" +
            link + "</a>";
      } else {
        v = "<a onclick=\"" +
            item.click.replace(/#TOKEN#/g, token) +
            "\" href='javascript:void(0);'>" +
            link + "</a>";
      }
      break;
    default:
      break;
  }
  return v;
};

var tooltip_generator = function(template) {
  this.template = template;
  this.getHTML = getHTML;
  
  this.tt_table = "<table>\n";
  for (var i = 0, l = this.template.length, t; i < l; i++) {
    t = this.template[i];
    this.tt_table += "<tr class =\"tt-row-" + t.name + "\">\n";
    this.tt_table += "<td class =\"tt-col tt-col-name tt-col-name-"
              + t.name+"\">" + t.name + "</td>\n";
    this.tt_table += "<td class =\"tt-col tt-col-val tt-col-val-"
              + t.name + "\">#token"+t.name+"token#</td>\n";
    this.tt_table += "</tr>\n";
  }
  this.tt_table += "</table>\n";
};

tooltip_generator.prototype.getDescription = function(event) {
  var result = this.tt_table;
  for (var i = 0, l = this.template.length, t; i < l; i++) {
    t = this.template[i];
    result = result.replace("#token" + t.name + "token#", this.getHTML(t, event));
  }
  return result;
}

module.exports = tooltip_generator;