(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['messenger-template'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"chat\">\n	<div class=\"chat-head\">\n		<div class=\"chat-title\">"
    + alias4(((helper = (helper = helpers.reciever || (depth0 != null ? depth0.reciever : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"reciever","hash":{},"data":data}) : helper)))
    + "</div>\n		<div class=\"remove-messenger\">X</div>\n	</div>\n	<div class=\"chat-container "
    + alias4(((helper = (helper = helpers.reciever || (depth0 != null ? depth0.reciever : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"reciever","hash":{},"data":data}) : helper)))
    + "\"></div>\n	<div class=\"user-container\">\n		<input type=\"text\" class=\"cmd "
    + alias4(((helper = (helper = helpers.reciever || (depth0 != null ? depth0.reciever : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"reciever","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Press Enter to send\">\n	</div>\n<div>";
},"useData":true});
})();