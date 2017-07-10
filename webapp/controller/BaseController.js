sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/vi/VehicleDetails/customServiceConfiguration"
], function (Controller, History, CustomServiceConfiguration) {
	"use strict";
	return Controller.extend("sap.vi.VehicleDetails.controller.BaseController", {
		_i18nBundle: null,
		getRouter : function (fnCb) {
			if(sap.ui.core.UIComponent.getRouterFor(this)) {
				if(fnCb) {
					fnCb(sap.ui.core.UIComponent.getRouterFor(this));
				} else {
					return sap.ui.core.UIComponent.getRouterFor(this);		
				}
			} else {
				var oEvtBus = sap.ui.getCore().getEventBus();
				oEvtBus.subscribeOnce("sap.vi.VehicleDetails.Component", "getRouter.response", function(dummy, dummy2, oRouter) {
					fnCb(oRouter);
				});
				oEvtBus.publish("sap.vi.VehicleDetails.Component", "getRouter");
			}
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},
		resolveCustomServicePath: function(sEntityName) {
			if(sEntityName.charAt(0) === "/") {
				return "/" + CustomServiceConfiguration.getOdataEntitiyName(sEntityName.substr(1));
			}
			return CustomServiceConfiguration.getOdataEntitiyName(sEntityName);
		},
		getIDSpace: function() {
			return CustomServiceConfiguration.getIDSpace();           
		},
		text: function(sKey) {
			if(!this._i18nBundle) {
				this._i18nBundle = this.getView().getModel("i18n").getResourceBundle();
			}
			return this._i18nBundle.getText(sKey);
		},
		geti18nBundle: function() {
			if(!this._i18nBundle) {
				this._i18nBundle = this.getView().getModel("i18n").getResourceBundle();
			}
			return this._i18nBundle;
		}
	});
});