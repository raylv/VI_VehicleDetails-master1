sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/vi/VehicleDetails/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(UIComponent, Device, models, JSONModel, MessageBox) {
	"use strict";
	
	var bMessageOpen = false;
	
	return UIComponent.extend("sap.vi.VehicleDetails.Component", {
		oEventBus: sap.ui.getCore().getEventBus(),
		
		metadata: {
			manifest: "json"
		},
		
		handleStartup: function() {
			if(!this.getComponentData() || !this.getComponentData().startupParameters) {
				return;
			}
			var oStartupParameters = this.getComponentData().startupParameters;
			if (oStartupParameters && oStartupParameters.vehicleUID) {
			 	this.getRouter().navTo("VehicleDetails", {
			 	 	vehicleUID : oStartupParameters.vehicleUID[0]
			 	}, true);
			}
		},

		init: function() {
			var that = this;
			
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			// set page html title
			if(that.getModel("i18n").getResourceBundle().getText("appTitle") !== "appTitle") {
				document.title = "SAP VI - " + that.getModel("i18n").getResourceBundle().getText("appTitle");
			}

			// set device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
			
			// handle session timeouts (http response code 503 when making an odata call)
			this.getModel("vehicleInsights").attachRequestFailed(null, function(oEvent){
				var oResponse = oEvent.getParameters("response");
				if(oResponse.response && oResponse.response.statusCode && oResponse.response.statusCode === 503 && bMessageOpen === false) {
					bMessageOpen = true;
					MessageBox.warning(
						that.getModel("i18n").getResourceBundle().getText("Component.SessionTimeout.Text"), {
							title: that.getModel("i18n").getResourceBundle().getText("Component.SessionTimeout.Title"),
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function(oEvent) {
								if(oEvent === sap.m.MessageBox.Action.YES) {
									location.reload();
								}
								bMessageOpen = false;
							}
						}
	               );
				} else if(oResponse.response && oResponse.response.statusCode && oResponse.response.statusCode >= 300 && bMessageOpen === false) {
					bMessageOpen = true;
					MessageBox.error(
						that.getModel("i18n").getResourceBundle().getText("Component.RequestFailed.Text"), {
							title: that.getModel("i18n").getResourceBundle().getText("Component.RequestFailed.Title"),
							actions: [sap.m.MessageBox.Action.OK],
							details: "Technical error description: " + JSON.stringify(oResponse),
							onClose: function() {
								bMessageOpen = false;
							}
						}
	               );
				}
			}, this);

			this.oEventBus.subscribe("sap.vi.VehicleDetails.Component", "getRouter", this.publishRouter);
			
			this.handleStartup();
		},
		exit: function() {
			this.oEventBus.unsubscribe("sap.vi.VehicleDetails.Component", "getRouter", this.publishRouter);
		},
		publishRouter: function() {
			this.oEventBus.publish("sap.vi.VehicleDetails.Component", "getRouter.response", this.getRouter());
		}
	});
});