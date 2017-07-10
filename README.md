# VI_VehicleDetails
Displays an overview page of a vehicle

## Prerequisites
All entities from here: https://github.wdf.sap.corp/ConsultingVI/VI_Backend

## Setup hints

| Item | What | Status |
|---|-------|----|
| 1 | Single file configuration [1] | Yes |
| 2 | Required Destination | Full service URL (new odata service) |
| 3 | i18n | en (default), de |

Information on the table above
1)  If yes then the only changes required check must be made in ```customServiceConfiguration.js```. If no you will have to all databindings and that they match the name of your entities.
2) Full Service URL = The VI Backend destination must contain the complete path to the OData service. If it is "Host only" you will have to change the datasource path for the vehicleInsights datasource in manifest.json