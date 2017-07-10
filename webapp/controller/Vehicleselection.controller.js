sap.ui.define([
	"sap/vi/VehicleDetails/controller/BaseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.vi.VehicleDetails.controller.Vehicleselection", {
		_navToTarget: null,
		onInit: function() {
			this.getRouter().getRoute("Vehicleselection").attachPatternMatched(this.onPatternMatched, this);
		},
		onSearch: function(oEvent) {
			var sQuery = oEvent.getParameters().query,
				oTableCtx = this.getView().byId("VehicleselectionTable").getBinding("items");
			if(sQuery.length < 1) {
				oTableCtx.filter([]);
				return;
			}
			var aFilter = [];	
			aFilter.push(new sap.ui.model.Filter({
				path: "Name",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sQuery
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "LicensePlate",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sQuery
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "Description",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sQuery
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "MakeName",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sQuery
			}));
			aFilter.push(new sap.ui.model.Filter({
				path: "ModelName",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: sQuery
			}));

			var oCombinedFilter = new sap.ui.model.Filter({
				filters: aFilter,
				and: false
			});
			oTableCtx.filter(oCombinedFilter);
		},
		onPatternMatched: function(oEvent) {
		},
		onTableItemPress: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext("vehicleInsights");
			var oVehicle = this.getView().getModel("vehicleInsights").getProperty(oCtx.getPath());
			this.getRouter().navTo("VehicleDetails", {
				vehicleUID: oVehicle.VehicleUID
			});
		}

	});

});