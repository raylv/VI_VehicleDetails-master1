sap.ui.define([
		"sap/uxap/BlockBase"
	], function (BlockBase) {
	"use strict";
	
	var oBlock = BlockBase.extend("sap.vi.VehicleDetails.view.vehicleDetails.SummaryBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.SummaryBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.SummaryBlock",
					type: "XML"
				}
			}
		}
	});
	return oBlock;
}, true);