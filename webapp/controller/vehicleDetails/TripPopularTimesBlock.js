sap.ui.define([
		"sap/uxap/BlockBase"
	], function (BlockBase) {
	"use strict";
	
	var oBlock = BlockBase.extend("sap.vi.VehicleDetails.view.vehicleDetails.TripPopularTimesBlock", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripPopularTimesBlock",
					type: "XML"
				},
				Expanded: {
					viewName: "sap.vi.VehicleDetails.view.vehicleDetails.TripPopularTimesBlock",
					type: "XML"
				}
			}
		}
	});
	return oBlock;
}, true);