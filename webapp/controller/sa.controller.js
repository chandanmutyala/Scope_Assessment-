sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("scopeassessment.controller.sa", {

        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("./model/data.json");
            this.getView().setModel(oModel, "countryModel");

            // var oModel = this.getOwnerComponent().getModel("countryModel");
            // this.getView().setModel(oModel,"countryModel");

        //     oModel.attachRequestCompleted(function () {
        //         var aCountryData = oModel.getProperty("/countries");
        //         var oColumnMapping = oModel.getProperty("/columnMapping");

        //         // Populate LOB ComboBox
        //         var aLOBOptions = oModel.getProperty("/lobOptions");
        //         this._populateComboBox("lobComboBox", aLOBOptions);

        //         // Populate Business Area ComboBox
        //         var aBusinessAreaOptions = oModel.getProperty("/businessAreaOptions");
        //         this._populateComboBox("businessAreaComboBox", aBusinessAreaOptions);

        //         // Populate Status ComboBox
        //         var aStatusOptions = oModel.getProperty("/statusOptions");
        //         this._populateComboBox("statusComboBox", aStatusOptions);

        //         //Bind MultiComboBox for Country
        //         if (Array.isArray(aCountryData)) {
        //             var oComboBox = this.byId("countryComboBox");
        //             aCountryData.forEach(function (oCountry) {
        //                 oComboBox.addItem(new sap.ui.core.Item({
        //                     key: oCountry.code,
        //                     text: oCountry.name
        //                 }));
        //             });
        //         } else {
        //             console.error("Country data is not an array.");
        //         }

        //         // Display all columns initially
        //         var oTable = this.byId("scopeItemsTable");
        //         var aColumns = oTable.getColumns();
        //         aColumns.forEach(function (oColumn) {
        //             oColumn.setVisible(true);  // Set all columns visible initially
        //         });
        //     }.bind(this));
        // },
        // onNavBack: function () {
        //     var oRouter = this.getOwnerComponent().getRouter();
        //     oRouter.navTo("Routehomepage");
        // },

        // _populateComboBox: function (sComboBoxId, aOptions) {
        //     var oComboBox = this.byId(sComboBoxId);
        //     if (oComboBox && Array.isArray(aOptions)) {
        //         aOptions.forEach(function (sOption) {
        //             oComboBox.addItem(new sap.ui.core.Item({
        //                 key: sOption,
        //                 text: sOption
        //             }));
        //         });
        //     } else {
        //         console.error("Failed to populate ComboBox: " + sComboBoxId);
        //     }
        },
        // onComboBoxSelectionChange: function () {
        //     var aFilters = [];

        //     // Get selected values from id ComboBox
        //     var oComboBox = this.byId("scopeIdComboBox");
        //     var aSelectedKeys = oComboBox.getSelectedKeys();
        //     console.log("Selected Scope IDs:", aSelectedKeys);  // Debugging output

        //     if (aSelectedKeys.length > 0) {
        //         aFilters.push(new Filter("ScopeItemID", FilterOperator.Contains, aSelectedKeys));
        //     }

        //      // Get selected values from description ComboBox
        //      var oComboBox = this.byId("descriptionComboBox");
        //      var aSelecteddes = oComboBox.getSelectedKeys();
        //      console.log("Selected Scope des:", aSelecteddes);  // Debugging output
 
        //      if (aSelecteddes.length > 0) {
        //          aFilters.push(new Filter("Description", FilterOperator.Contains, aSelecteddes));
        //      }

        //     // Get selected values from LOB ComboBox
        //     var aSelectedLOB = this.byId("lobComboBox").getSelectedKeys();
        //     if (aSelectedLOB.length > 0) {
        //         aFilters.push(new Filter("LOB", FilterOperator.Contains, aSelectedLOB));
        //     }

        //     // Get selected values from Business Area ComboBox
        //     var aSelectedBusinessArea = this.byId("businessAreaComboBox").getSelectedKeys();
        //     if (aSelectedBusinessArea.length > 0) {
        //         aFilters.push(new Filter("BusinessArea", FilterOperator.Contains, aSelectedBusinessArea));
        //     }

        //     // Get selected values from Status ComboBox
        //     var aSelectedStatus = this.byId("statusComboBox").getSelectedKeys();
        //     if (aSelectedStatus.length > 0) {
        //         aFilters.push(new Filter("Status", FilterOperator.Contains, aSelectedStatus));
        //     }

        //     // Combine all filters with AND operator
        //     var oCombinedFilter = new Filter({
        //         filters: aFilters,
        //         and: true
        //     });

        //     // Apply the filters to the table
        //     var oTable = this.byId("scopeItemsTable");
        //     var oBinding = oTable.getBinding("rows");  // Use "items" instead of "rows" if using sap.m.Table
        //     oBinding.filter(oCombinedFilter);
        // },

        onComboBoxSelectionChange: function () {
            var aFilters = [];
        
            // Get selected values from Scope ID ComboBox
            var oScopeIdComboBox = this.byId("scopeIdComboBox");
            var aSelectedScopeIds = oScopeIdComboBox.getSelectedKeys();
            console.log("Selected Scope IDs:", aSelectedScopeIds);  // Debugging output
        
            if (aSelectedScopeIds.length > 0) {
                var aScopeIdFilters = aSelectedScopeIds.map(function (sKey) {
                    console.log("Creating filter for Scope ID:", sKey);  // Debugging output
                    return new Filter("ScopeItemID", FilterOperator.EQ, sKey);
                });
        
                var oScopeIdFilter = new Filter({
                    filters: aScopeIdFilters,
                    and: false  // OR operator for multiple selected IDs
                });
        
                aFilters.push(oScopeIdFilter);
            }
            var descComboBox = this.byId("descriptionComboBox");
            var aSelectedDesc = descComboBox.getSelectedKeys();
            console.log("Selected Desc:", aSelectedDesc);  // Debugging output
        
            if (aSelectedDesc.length > 0) {
                var aDescFilters = aSelectedDesc.map(function (sKey) {
                    console.log("Creating filter for Desc:", sKey);  // Debugging output
                    return new Filter("Description", FilterOperator.EQ, sKey);
                });
        
                var oDescFilters = new Filter({
                    filters: aDescFilters,
                    and: false  // OR operator for multiple selected LOBs
                });
        
                aFilters.push(oDescFilters);
            }
        
            // Get selected values from LOB ComboBox
            var oLOBComboBox = this.byId("lobComboBox");
            var aSelectedLOBs = oLOBComboBox.getSelectedKeys();
            console.log("Selected LOBs:", aSelectedLOBs);  // Debugging output
        
            if (aSelectedLOBs.length > 0) {
                var aLOBFilters = aSelectedLOBs.map(function (sKey) {
                    console.log("Creating filter for LOB:", sKey);  // Debugging output
                    return new Filter("LOB", FilterOperator.EQ, sKey);
                });
        
                var oLOBFilter = new Filter({
                    filters: aLOBFilters,
                    and: false  // OR operator for multiple selected LOBs
                });
        
                aFilters.push(oLOBFilter);
            }
        
            // Get selected values from Business Area ComboBox
            var oBusinessAreaComboBox = this.byId("businessAreaComboBox");
            var aSelectedBusinessAreas = oBusinessAreaComboBox.getSelectedKeys();
            console.log("Selected Business Areas:", aSelectedBusinessAreas);  // Debugging output
        
            if (aSelectedBusinessAreas.length > 0) {
                var aBusinessAreaFilters = aSelectedBusinessAreas.map(function (sKey) {
                    console.log("Creating filter for Business Area:", sKey);  // Debugging output
                    return new Filter("BusinessArea", FilterOperator.EQ, sKey);
                });
        
                var oBusinessAreaFilter = new Filter({
                    filters: aBusinessAreaFilters,
                    and: false  // OR operator for multiple selected Business Areas
                });
        
                aFilters.push(oBusinessAreaFilter);
            }
        
            // Get selected values from Status ComboBox
            var oStatusComboBox = this.byId("statusComboBox");
            var aSelectedStatuses = oStatusComboBox.getSelectedKeys();
            console.log("Selected Statuses:", aSelectedStatuses);  // Debugging output
        
            if (aSelectedStatuses.length > 0) {
                var aStatusFilters = aSelectedStatuses.map(function (sKey) {
                    console.log("Creating filter for Status:", sKey);  // Debugging output
                    return new Filter("Status", FilterOperator.EQ, sKey);
                });
        
                var oStatusFilter = new Filter({
                    filters: aStatusFilters,
                    and: false  // OR operator for multiple selected Statuses
                });
        
                aFilters.push(oStatusFilter);
            }
        
            // Combine all filters with AND operator
            var oCombinedFilter = new Filter({
                filters: aFilters,
                and: true
            });
        
            console.log("Combined Filter:", oCombinedFilter);  // Debugging output
        
            // Apply the filters to the table
            var oTable = this.byId("scopeItemsTable");
            var oBinding = oTable.getBinding("rows");  // Use "items" if it's an sap.m.Table
            oBinding.filter(oCombinedFilter);
        
            console.log("Table Binding:", oBinding);  // Debugging output
        },
        // onAfterRendering: function () {
        //     var oTable = this.byId("scopeItemsTable"); // Replace with your table's ID
        //     //var aRows = oTable.getRows(); // Get all rows

           
               
        //         var oItem = oTable.getItems();
        //         var aCells = oItem.getCells(); // Get cells in the row

        //         // Assuming Status column index is 4; adjust as necessary
        //         // var oStatusCell = aCells[4]; // Adjust index based on your table structure
        //         // console.log(oStatusCell + "cell 4")
        //         // var status = oStatusCell.mBindingInfos.text.binding.sPath; // Get the status text

               
        //         var  status = oItem.getBindingContext().getProperty('status');
        //         aCells.forEach(function (oCell) {

                
        //         console.log("Status: ",status)

        //         // Apply the CSS class based on status
        //         if (status === "Available") {
        //             console.log("If block status : ",status)
        //             oCell.addStyleClass("greenBackground");
        //         } else if (status === 'Deprecated') {
        //             oCell.addStyleClass("redBackground");
        //         }
                
        //     });
        // },
       
        // statusFormatter: function (status) {
        //     if (status === "deprecated") {
        //         return "redCell"; 
        //     } else if (status === "available") {
        //         return "greenCell";             }
        //           },


        
         
        onAfterRendering: function () {
            this._applyCustomStyles(); // Ensure this is called after rendering
        },
        
        // _applyCustomStyles: function () {
        //     var oTable = this.byId("scopeItemsTable");
        //     var aRows = oTable.getRows();
        
        //     aRows.forEach(function (oRow, iIndex) {
        //         var aCells = oRow.getCells();
        //         var oCustomData = aCells[4].getCustomData()[0]; 
        //         var sClass = oCustomData.getValue(); 
                
        //         // Debugging
        //         console.log("Row Index:", iIndex);
        //         console.log("Cell Class:", sClass);
                
        //         // Apply styles
        //         aCells[4].addStyleClass(sClass);
        //     });
        // }
        
        

        
        
        


        onCountrySelectionChange: function (oEvent) {
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var oTable = this.byId("scopeItemsTable");
            var aColumns = oTable.getColumns();
            // var oColumnMapping = this.getView().getModel("countryModel").getProperty("/columnMapping");

            var oColumnMapping = this.getOwnerComponent().getModel("countryModel").getProperty("/columnMapping");
            
            // var oModel = this.getOwnerComponent().getModel("countryModel");
            // this.getView().setModel(oModel,"countryModel");
            console.log("Selected keys: ", aSelectedKeys);




            var updateColumnVisibility = function () {
                var bAnyKeySelected = aSelectedKeys.length > 0;

                // If no key is selected, show all columns
                if (!bAnyKeySelected) {
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 4) {  // Assuming country columns start from index 6
                            oColumn.setVisible(true);  // Show all columns if no country is selected
                        }
                    });
                } else {
                    // If any key is selected, hide all columns first
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 5) {  // Assuming country columns start from index 6
                            oColumn.setVisible(false);  // Hide all columns initially
                        }
                    });

                    // Show only the columns that match the selected country keys
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 4) {  // Assuming country columns start from index 6
                            var sKey = Object.keys(oColumnMapping).find(function (key) {
                                return oColumnMapping[key] === (i + 1);  // Adjust +1 based on your mapping logic
                            });

                            // If the column matches the selected country key, show it
                            if (sKey && aSelectedKeys.includes(sKey)) {
                                oColumn.setVisible(true);  // Show the matching country column
                            }
                        }
                    });
                }
            };  
            
            



            updateColumnVisibility();
        }
    });
});