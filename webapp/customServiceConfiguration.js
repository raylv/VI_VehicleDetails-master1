sap.ui.define([], function() {
	"use strict";

	var namespace = "ch_amag";
	
	return {
		GETLASTDATA: namespace + "__GetLatestPropertyValues",
		PROPERTYCOUNT: namespace + "__ParameterCount",
		PROPERTYCOUNTOBSERVER: namespace + "__ParameterCountObserver",
		INBOUNDBUFFER: namespace + "__InboundMessageBufferMonitor",
		getOdataEntitiyName: function(sEntitiy) {
			while(sEntitiy.charAt(0) === "_") {
				sEntitiy = sEntitiy.substr(1);
			}
			return namespace + "__" + sEntitiy;
		},
		getIDSpace: function() {
			return namespace.split("_").join(".") + ".local";
		}
	};
});