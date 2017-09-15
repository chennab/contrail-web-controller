/*
 * Copyright (c) 2017 Juniper Networks, Inc. All rights reserved.
 */

var applicationPolicyLoader = new ApplicationPolicyLoader();

function ApplicationPolicyLoader() {
    this.load = function (paramObject) {
        var self = this, currMenuObj = globalObj.currMenuObj,
            hashParams = paramObject['hashParams'],
            rootDir = currMenuObj['resources']['resource'][1]['rootDir'],
            pathPolicySetView = rootDir + '/js/views/applicationPolicyView.js',
            renderFn = paramObject['function'];

            if (self.policySetView == null) {
                require([pathPolicySetView], function (PolicySetView) {
                    self.policySetView = new PolicySetView();
                    self.renderView(renderFn, hashParams);
                 }, function (err) {
                     console.info("Application Policy Page Load error:" + err);
                 });
            } else {
                self.renderView(renderFn, hashParams);
            }
    }
    this.renderView = function (renderFn, hashParams) {
        $(contentContainer).html("");
        switch (renderFn) {
        case 'renderApplicationPolicy':
            this.policySetView[renderFn]({hashParams: hashParams});
            break;
        }
    };

    this.updateViewByHash = function (hashObj, lastHashObj) {
        var renderFn;
        this.load({hashParams: hashObj, 'function': renderFn});
    };

    this.destroy = function () {
        ctwu.destroyDOMResources(ctwl.APPLICATION_POLICY_SET_PREFIX_ID);
    };
}