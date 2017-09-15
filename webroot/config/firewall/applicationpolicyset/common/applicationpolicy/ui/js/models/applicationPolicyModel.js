/*
 * Copyright (c) 2017 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-config-model'
], function (_, ContrailConfigModel) {
    var applicationPolicyModel = ContrailConfigModel.extend({
        defaultConfig: {
            'name': '',
            'firewall_policy': ''
        },
        formatModelConfig: function(modelConfig) {
//        	var policyRef = getValueByJsonPath(modelConfig, "firewall_policy_refs", []);
//		     if (policyRef.length > 0) {
//		    	 var uuidList = [];
//		    	 for(var i = 0; i < policyRef.length; i++){
//		    		 uuidList.push(policyRef[i].to.join(':'));
//		    	 }
//		         modelConfig["firewall_policy"] = uuidList.join(cowc.DROPDOWN_VALUE_SEPARATOR);
//		     } else {
//		         modelConfig["firewall_policy"] = null;
//		     }
             //modelConfig["firewall_policy"] = polRefFormatter(modelConfig);
		     //this.formatRBACPermsModelConfig(modelConfig);
        	return modelConfig;
        },
        validations: {
        	applicationPolicyValidation: {
                'name': {
                    required: true,
                    msg: 'Enter a valid Application Policy Set.'
                }
            }
        }
    });
    function polRefFormatter (dc) {
        var polArr = [];
        var pols   =
            getValueByJsonPath(dc, 'firewall_policy_refs', []);

        if (!pols.length) {
            return '-';
        }

        var sortedPols = 
         _.sortBy(pols, function (pol) {
             var sequence =
                Number(getValueByJsonPath(pol, 'attr;sequence', 0));
             return ((1 + sequence) * 100000 ) - sequence;
        });

        pLen = pols.length;

        $.each(sortedPols,
            function (i, obj) {
                polArr.push(obj.to.join(':'));
            }
        );

        return polArr;
    };
    return applicationPolicyModel;
});
