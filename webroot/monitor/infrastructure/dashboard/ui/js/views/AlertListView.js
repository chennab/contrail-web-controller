/*
 * Copyright (c) 2015 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'backbone',
    'contrail-view',
],function(_,Backbone,ContrailView) {
    var AlertListView = ContrailView.extend({
        initialize: function(options) {
        },
        renderAlerts: function() {
            var self = this;
            var alertListTmpl = contrail.getTemplate4Id('alerts-template');
            var alertList = self.model.getItems();

            self.$el.find('.widget-body .widget-main').
                html(alertListTmpl(alertList.slice(0,5)));
            self.$el.find('.widget-header').initWidgetHeader({
                title: 'Alerts'
            });

            self.$el.find('#moreAlertsLink').click(function() {
                ctwu.loadAlertsPopup({
                    model: self.model
                });
            });
        },
        render: function() {
            var self = this;
            self.renderAlerts();
            self.model.onDataUpdate.subscribe(function() {
                self.renderAlerts();
            });
        }
    });
    return AlertListView;
});