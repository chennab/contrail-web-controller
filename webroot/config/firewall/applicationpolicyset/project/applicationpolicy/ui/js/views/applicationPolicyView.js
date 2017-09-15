/*
* Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
*/

define([
   'underscore',
   'backbone',
    'contrail-view'
], function (_, Backbone, ContrailView) {
        var self;
    var applicationPolicyView = ContrailView.extend({
        el: $(contentContainer),
        renderApplicationPolicy: function (viewConfig) {
            self = this,
            self.renderView4Config(self.$el, null,
                                   this.getAppPolicyConfig(viewConfig));
        },
        getAppPolicyConfig: function (viewConfig) {
            var hashParams = viewConfig.hashParams,
                customProjectDropdownOptions = {
                    config: true,
                    childView: {
                        init: this.getAppPolicy(viewConfig),
                    }
                },
                customDomainDropdownOptions = {
                    childView: {
                        init: ctwvc.getProjectBreadcrumbDropdownViewConfig(
                                              hashParams,
                                              customProjectDropdownOptions)
                    }
                };
            return ctwvc.getDomainBreadcrumbDropdownViewConfig(hashParams,
                                                    customDomainDropdownOptions)
        },
        getAppPolicy: function (viewConfig) {
            return function (projectSelectedValueData) {
                selectedDomainProjectData = projectSelectedValueData;
                return {
                    elementId:
                        cowu.formatElementId([ctwc.APPLICATION_POLICY_SET_LIST_VIEW_ID]),
                    view: "applicationPolicyListView",
                    app: cowc.APP_CONTRAIL_CONTROLLER,
                    viewPathPrefix: "/config/firewall/applicationpolicyset/project/applicationpolicy/ui/js/views/",
                    viewConfig: $.extend(true, {}, viewConfig,
                                         {projectSelectedValueData:
                                         projectSelectedValueData})
                }
            }
        }
    });
    return applicationPolicyView;
});
