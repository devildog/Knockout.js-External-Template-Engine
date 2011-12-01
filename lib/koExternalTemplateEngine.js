(function(global, ko, infuser, undefined) {
// Knockout External Template Engine
// Author: Jim Cowart
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 2.0

var ExternalTemplateSource = function(templateId) {
    this.templateId = templateId;
    this.loaded = false;
    this.template = ko.observable(infuser.defaults.loadingTemplate.content);
    this.template.data = {};
};

ko.utils.extend(ExternalTemplateSource.prototype, {
    data: function(key, value) {
        if (arguments.length === 1) {
           return this.template.data[key];
        }
        this.template.data[key] = value;
    },

    text: function(value) {
        if (!this.loaded) {
           this.getTemplate();
        }

        if (arguments.length === 0) {
            return this.template();
        } else {
           this.template(arguments[0]);
        }
    },

    getTemplate: function() {
        var self = this;
        infuser.get(self.templateId, function(tmpl) {
            self.template(tmpl);
            self.loaded = true;
        });
    }
});
var KoExternalTemplateEngine = function(koEngineType) {
    var engine = koEngineType ? new koEngineType() : new ko.nativeTemplateEngine();
    engine.templates = {};
    engine.makeTemplateSource = function(template) {
        // Named template
        if (typeof template == "string") {
            var elem = document.getElementById(template);
            if (elem)
                return new ko.templateSources.domElement(elem);
            else {
                if(!engine.templates[template]) {
                    engine.templates[template] = new ExternalTemplateSource(template);
                }
                return engine.templates[template];
            }
        }
        else if ((template.nodeType == 1) || (template.nodeType == 8)) {
            // Anonymous template
            return new ko.templateSources.anonymousTemplate(template);
        }
        
    };
    return engine;
};
ko.KoExternalTemplateEngine = KoExternalTemplateEngine; ko.setTemplateEngine(new KoExternalTemplateEngine()); })(window, ko, infuser);