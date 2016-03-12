this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["client/messenger-template.handlebars"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"chat\">\n	<div class=\"chat-head\">\n		<div class=\"chat-title\">"
    + alias4(((helper = (helper = helpers.formated || (depth0 != null ? depth0.formated : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"formated","hash":{},"data":data}) : helper)))
    + "</div>\n		<div class=\"remove-messenger fa fa-times\"></div>\n	</div>\n	<div class='chat-box'>\n		<div class='chat-wrapper'>\n			<div class=\"chat-container\"></div>\n		</div>\n	</div>\n	<div class=\"user-container\">\n		<textarea type=\"text\" class=\"cmd\" placeholder=\"Press Enter to send\"></textarea>\n	</div>\n<div>";
},"useData":true});