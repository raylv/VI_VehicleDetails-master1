sap.ui.define([
		"sap/uxap/BlockBase"
	], function (BlockBase) {
	"use strict";
	
	var oBlock = BlockBase.extend("sap.vi.VehicleDetails.view.vehicleDetails.TripStatisticsBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripStatisticsBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripStatisticsBlock",
					type: "XML"
				}
			}
		}
	});
	return oBlock;
}, true);