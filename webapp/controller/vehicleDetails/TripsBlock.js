sap.ui.define([
		"sap/uxap/BlockBase"
	], function (BlockBase) {
	"use strict";
	
	var oBlock = BlockBase.extend("sap.vi.VehicleDetails.view.vehicleDetails.TripsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripsBlock",
					type: "XML"
				}
			}
		}
	});
	return oBlock;
}, true);