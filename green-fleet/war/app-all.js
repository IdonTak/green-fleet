/*
Copyright(c) 2011 HeartyOh.com
*/
Ext.define("GreenFleet.mixin.Msg",function(){var b;function a(d,e){return'<div class="msg"><h3>'+d+"</h3><p>"+e+"</p></div>"}function c(e,f){if(!b){b=Ext.core.DomHelper.insertFirst(document.body,{id:"msg-div"},true)}var f=Ext.String.format.apply(String,Array.prototype.slice.call(arguments,1));var d=Ext.core.DomHelper.append(b,a(e,f),true);d.hide();d.slideIn("t").ghost("t",{delay:1000,remove:true})}return{msg:c}}());Ext.define("GreenFleet.mixin.User",function(){var b=login.username;function a(c){if(c!==undefined){b=c}return b}return{login:{id:a,name:a}}}());Ext.define("GreenFleet.mixin.Mixin",{mixin:function(b,a){try{switch(typeof(b)){case"string":Ext.apply(Ignite,Ext.create(b,a));return;case"object":Ext.apply(Ignite,b)}}catch(c){console.log(c.stack)}}});Ext.define("GreenFleet.mixin.UI",{addDockingNav:function(a,b){var d={tabConfig:{width:29,height:22,padding:"0 0 0 2px"}};try{Ext.getCmp("docked_nav").add(Ext.create(a,Ext.merge(d,b)))}catch(c){console.log(c);console.trace()}},addSystemMenu:function(a,b){try{var d=Ext.getCmp("system_menu");var g=Ext.create(a,b);d.insert(0,g);var c=6;d.items.each(function(e){c+=e.getWidth()});d.setSize(c,d.getHeight())}catch(f){}},addContentView:function(a){this.showBusy();var b;if(typeof(a)==="string"){b=Ext.create(a,{closable:true})}else{b=a}Ext.getCmp("content").add(b).show();this.clearStatus()},setStatus:function(a){Ext.getCmp("statusbar").setStatus(a)},showBusy:function(a){Ext.getCmp("statusbar").showBusy(a)},clearStatus:function(){Ext.getCmp("statusbar").clearStatus()},doMenu:function(a){if(a.viewModel){Ext.require(a.viewModel,function(){GreenFleet.addContentView(Ext.create(a.viewModel,{title:a.text,tabConfig:{tooltip:a.tooltip},closable:true}))})}else{GreenFleet.status.set({text:"View Not Found!",iconCls:"x-status-error",clear:true})}}});Ext.define("GreenFleet.view.Viewport",{extend:"Ext.container.Viewport",layout:"border",defaults:{split:false,collapsible:false},items:[{xtype:"viewport.north",region:"north",height:48},{xtype:"viewport.west",region:"west",width:70},{xtype:"viewport.center",region:"center"}]});Ext.define("GreenFleet.view.company.Company",{extend:"Ext.container.Container",alias:"widget.company",title:"Company",layout:{align:"stretch",type:"vbox"},initComponent:function(){Ext.applyIf(this,{items:[this.buildList(this),this.buildForm(this)],});this.callParent(arguments)},buildList:function(a){return{xtype:"gridpanel",title:"Company List",store:"CompanyStore",flex:3,columns:[{dataIndex:"id",text:"ID"},{dataIndex:"name",text:"Name"},{dataIndex:"createdAt",text:"Created At"},{dataIndex:"updatedAt",text:"Updated At"}],viewConfig:{},listeners:{itemclick:function(c,b){var d=a.down("form");d.loadRecord(b)}},onSearch:function(b){var c=b.down("textfield[name=idFilter]");var d=b.down("textfield[name=nameFilter]");b.store.load({filters:[{property:"id",value:c.getValue()},{property:"name",value:d.getValue()}]})},onReset:function(b){b.down("textfield[name=idFilter]").setValue("");b.down("textfield[name=nameFilter]").setValue("")},tbar:["ID",{xtype:"textfield",name:"idFilter",hideLabel:true,width:200,listeners:{specialkey:function(d,c){if(c.getKey()==c.ENTER){var b=this.up("gridpanel");b.onSearch(b)}}}},"NAME",{xtype:"textfield",name:"nameFilter",hideLabel:true,width:200,listeners:{specialkey:function(d,c){if(c.getKey()==c.ENTER){var b=this.up("gridpanel");b.onSearch(b)}}}},{xtype:"button",text:"Search",tooltip:"Find Company",handler:function(){var b=this.up("gridpanel");b.onSearch(b)}},{text:"refresh",handler:function(){var b=this.up("gridpanel");b.onReset(b)}}]}},buildForm:function(a){return{xtype:"form",bodyPadding:10,title:"Company Details",flex:2,items:[{xtype:"textfield",name:"id",fieldLabel:"ID",anchor:"100%"},{xtype:"textfield",name:"name",fieldLabel:"Name",anchor:"100%"},{xtype:"textfield",name:"updatedAt",disabled:true,fieldLabel:"Updated At",anchor:"100%"},{xtype:"textfield",name:"createdAt",disabled:true,fieldLabel:"Created At",anchor:"100%"}],dockedItems:[{xtype:"toolbar",dock:"bottom",layout:{align:"middle",type:"hbox"},items:[{xtype:"button",text:"Save",handler:function(){var b=this.up("form").getForm();if(b.isValid()){b.submit({url:"company/save",success:function(c,d){a.down("gridpanel").store.load()},failure:function(c,d){GreenFleet.msg("Failed",d.result.msg)}})}}},{xtype:"button",text:"Delete",handler:function(){var b=this.up("form").getForm();if(b.isValid()){b.submit({url:"company/delete",success:function(c,d){a.down("gridpanel").store.load();c.reset()},failure:function(c,d){GreenFleet.msg("Failed",d.result.msg)}})}}},{xtype:"button",text:"Reset",handler:function(){this.up("form").getForm().reset()}}]}]}}});Ext.define("GreenFleet.view.map.Map",{extend:"Ext.panel.Panel",alias:"widget.map",title:"Maps",height:100,width:100,layout:"fit",initComponent:function(){Ext.applyIf(this,{items:[this.buildMap(this)],});this.callParent()},displayMap:function(b,e,d){var c={zoom:12,center:new google.maps.LatLng(e,d),mapTypeId:google.maps.MapTypeId.ROADMAP};b.map=new google.maps.Map(b.getEl().first(".map").dom,c);google.maps.event.addListener(b.map,"zoom_changed",function(){setTimeout(function(){b.map.setCenter(c.center)},3000)});var a=new google.maps.Marker({position:c.center,map:b.map,title:"Hello World!"});google.maps.event.addListener(a,"click",function(){var f=new google.maps.InfoWindow({content:a.getTitle(),size:new google.maps.Size(50,50)});f.open(b.map,a)})},buildMap:function(a){return{xtype:"box",flex:1,html:'<div class="map" style="height:100%"></div>',listeners:{afterrender:function(){console.log(this);a.displayMap(this,37.56,126.97)}}}}});Ext.define("GreenFleet.store.CompanyStore",{extend:"Ext.data.Store",autoLoad:false,constructor:function(a){var b=this;a=a||{};b.callParent([Ext.apply({proxy:{type:"ajax",url:"company",reader:{type:"json"}},fields:[{name:"id",type:"string"},{name:"name",type:"string"},{dateFormat:"YYYY-MM-DD",name:"createdAt",type:"date"},{dateFormat:"YYYY-MM-DD",name:"updaatedAt",type:"date"}]},a)])}});Ext.define("GreenFleet.view.viewport.Center",{extend:"Ext.tab.Panel",id:"content",alias:"widget.viewport.center",items:[{xtype:"map",closable:false},{xtype:"obd",closable:false},{xtype:"filemanager",closable:false},{xtype:"company",closable:false}]});Ext.define("GreenFleet.view.viewport.North",{extend:"Ext.panel.Panel",alias:"widget.viewport.north",layout:{type:"hbox",align:"stretch"},items:[{xtype:"brand",width:100},{xtype:"main_menu",flex:1},{xtype:"system_menu",width:130}]});Ext.define("GreenFleet.view.viewport.West",{extend:"Ext.panel.Panel",alias:"widget.viewport.west"});Ext.define("GreenFleet.view.Brand",{extend:"Ext.panel.Panel",alias:"widget.brand",html:"<h1>Green Fleet</h1>"});Ext.create("Ext.data.Store",{id:"menustore",fields:[{name:"text"}],data:[{text:"Vehicle"},{text:"Employees"},{text:"Allocation"},{text:"Incidents"},{text:"Maintenance"},{text:"Risk Assessment"},{text:"Purchase Order"}],});Ext.define("GreenFleet.view.MainMenu",{extend:"Ext.toolbar.Toolbar",alias:"widget.main_menu",items:[{text:"Vehicle"},{text:"Employees"},{text:"Allocation"},{text:"Incidents"},{text:"Maintenance"},{text:"Risk Assessment"},{text:"Purchase Order"}]});Ext.define("GreenFleet.view.SystemMenu",{extend:"Ext.toolbar.Toolbar",alias:"widget.system_menu",items:[{type:"help",text:"help",handler:function(){}},{itemId:"refresh",type:"refresh",text:"refresh",handler:function(){}},{type:"search",text:"search",handler:function(c,d,a,b){}}]});Ext.define("GreenFleet.view.vehicle.OBDCollector",{extend:"Ext.form.Panel",alias:"widget.obd",title:"Collection OBD Information",layout:"anchor",defaults:{anchor:"100%"},items:[{xtype:"textfield",name:"vehicle",fieldLabel:"Vehicle",value:"1234567890"},{xtype:"textfield",name:"speed",fieldLabel:"Speed",value:120},{xtype:"textfield",name:"gas",fieldLabel:"Gas",value:65},{xtype:"textfield",name:"tirePressure",fieldLabel:"Tire Pressure",value:23},{xtype:"textfield",name:"longitude",fieldLabel:"Longitude",value:"126°58'40.63\"E"},{xtype:"textfield",name:"latitude",fieldLabel:"Latitude",value:"37°33'58.87\"N"}],buttons:[{text:"Reset",handler:function(){this.up("form").getForm().reset()}},{text:"Submit",formBind:true,disabled:true,handler:function(){var a=this.up("form").getForm();console.log(a);if(a.isValid()){a.submit({url:"obd",success:function(b,c){GreenFleet.msg("Success",c.result.msg)},failure:function(b,c){GreenFleet.msg("Failed",c.result.msg)}})}}}]});Ext.define("GreenFleet.model.File",{extend:"Ext.data.Model",fields:[{name:"filename",type:"string"},{name:"creation",type:"number"},{name:"md5_hash",type:"string"},{name:"content_type",type:"string"},{name:"size",type:"string"}]});Ext.define("GreenFleet.view.file.FileManager",{extend:"Ext.panel.Panel",alias:"widget.filemanager",title:"FileManager",layout:{type:"vbox",align:"stretch",pack:"start"},initComponent:function(){this.callParent();this.add(Ext.create("GreenFleet.view.file.FileViewer",{flex:1}));this.add(Ext.create("GreenFleet.view.file.FileUploader",{flex:1}));this.add(Ext.create("GreenFleet.view.file.FileList",{flex:2}))}});Ext.define("GreenFleet.store.FileStore",{extend:"Ext.data.Store",storeId:"filestore",model:"GreenFleet.model.File",proxy:{type:"ajax",url:"/data/files.json",reader:{type:"json"}},autoLoad:true});Ext.define("GreenFleet.controller.ApplicationController",{extend:"Ext.app.Controller",stores:["CompanyStore"],models:[],views:["company.Company","map.Map"],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){}});Ext.define("GreenFleet.controller.FrameController",{extend:"Ext.app.Controller",stores:[],models:[],views:["viewport.Center","viewport.North","viewport.West","Brand","MainMenu","SystemMenu"],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){}});Ext.define("GreenFleet.controller.VehicleController",{extend:"Ext.app.Controller",stores:[],models:[],views:["vehicle.OBDCollector"],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){}});Ext.define("GreenFleet.controller.FileController",{extend:"Ext.app.Controller",stores:["FileStore"],models:["File"],views:["file.FileManager"],init:function(){this.control({viewport:{afterrender:this.onViewportRendered}})},onViewportRendered:function(){}});Ext.Loader.setConfig({enabled:true,paths:{GreenFleet:"app"}});Ext.define("GreenFleet",{singleton:true,mixins:{msg:"GreenFleet.mixin.Msg",user:"GreenFleet.mixin.User",mixin:"GreenFleet.mixin.Mixin",ui:"GreenFleet.mixin.UI"}});var console=console||{log:function(){},trace:function(){}};Ext.require("GreenFleet.view.Viewport");Ext.onReady(function(){Ext.application({name:"GreenFleet",autoCreateViewport:false,controllers:["GreenFleet.controller.ApplicationController","GreenFleet.controller.FrameController","GreenFleet.controller.VehicleController","GreenFleet.controller.FileController"],launch:function(){Ext.create("GreenFleet.view.Viewport").show()}})});
