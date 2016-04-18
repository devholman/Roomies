// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"


import BackboneFire from 'bbfire'
import DOM from 'react-dom'
import React, {Component} from 'react'
import {Actions} from './actions'
import {Collections,Models} from './collections'
import {SplashView,SignIn,AuthView,DashView,MyHouseView,ChoresView,Chore,RoomieView} from './views'

// `${rootURl}/houses/${houseID}/chores`
BackboneFire.Firebase.Model.prototype.fetchWithPromise = BackboneFire.Firebase.Collection.prototype.fetchWithPromise = function() {
    this.fetch()
    var self = this
    var p = new Promise(function(res,rej){
        self.once('sync',function() {
            res()
        })
        self.once('err',function() {
            rej()
        })
    })
    return p
}

var rootURL = "https://roomieshare.firebaseio.com/"
var ref = new Firebase("https://roomieshare.firebaseio.com/")
window.ref = ref



var RoomieRouter = BackboneFire.Router.extend({
	routes:{
		"splash" 		 : "handleSplash",
		"createAccount"  : "handleSignUp",
		"createHouse"    : "handleHouseCreation",
		"DashView"	 	 : "handleDashView",
		"myHouse" 		 : "handleMyHouse",
		"chores"		 : "handleChores",
		"addRoomies" 	 : "handleAddRoomies",
		"logOut"		 : "handleLogout",
		"logIn" 		 : "handleLogIn",
		"*Default"       : "handleSplash"
	},
	
	initialize: function(){
		// this.ref = new Firebase(rootURL)

		// if (!this.ref.getAuth()) {
		//     location.hash = "splash"
		// }

		// this.on('route', function() {
		//     if (!this.ref.getAuth()) {
		//         location.hash = "createAccount"
		//     }
		// })
		BackboneFire.history.start()
	},

	handleSignUp: function(){

		DOM.render(<AuthView />, document.querySelector('.container'))
	},

	handleSplash: function(){

		DOM.render(<SplashView />, document.querySelector('.container'))
	},

	handleLogIn: function(){

		DOM.render(<SignIn />, document.querySelector('.container') )
	},

	handleDashView: function() {
		function renderDashView(usrModel){
			var houseId = um.get('houseId')

			DOM.render(<DashView houseId={houseId} />, document.querySelector('.container'))

		}
		//this helps change the view on hash change. Because of open socket connection w/ fb
		//fb remembers the user model and won't re-render the page on hash change. 
		//if user model is synced w/ fb then render view. otherwise, wait for sync then render the view
		var um = new Models.UserModel(ref.getAuth().uid)

		if(um.id) {  
			renderDashView(um)
		}else{
			um.on('sync',function() {
				renderDashView(um)
			})
		}
	},	

	handleMyHouse: function(){
		function renderUserChoreView(UserModel){
			var roomieChoresColl = new Collections.QueryByUserId(ref.getAuth().uid)

			DOM.render(<MyHouseView roomieChoresColl={roomieChoresColl} myMod={myMod} />, document.querySelector('.container') )
		}

		var myMod = new Models.UserModel(ref.getAuth().uid)
		if(myMod.id) {
			renderUserChoreView(myMod)
		}else{
			myMod.on('sync',function() {
				renderUserChoreView(myMod)
			})
		}
	},

	handleChores: function(){
		function renderChoresView(usrModel){
			var houseId  = usrModel.get('houseId')
			var choresInHouseColl = new Collections.QueryByHouseId(houseId)

			DOM.render(<ChoresView choresInHouseColl={choresInHouseColl} houseId={houseId}/>, document.querySelector('.container'))
		}

		var usrModel = new Models.UserModel(ref.getAuth().uid)
		if(usrModel.id) {
			renderChoresView(usrModel)
		}else{
			usrModel.on('sync', function(){
				renderChoresView(usrModel)
			})
		}
	},

	handleAddRoomies: function(){
		function renderRoomiesView(UserModel){
			var houseId = um.get('houseId')
			var roomiesInHouseColl = new Collections.QueryUserByHouseId(houseId)
			
			DOM.render(<RoomieView houseId={houseId} roomiesInHouseColl={roomiesInHouseColl}/>, document.querySelector('.container'))

		}
		var um = new Models.UserModel(ref.getAuth().uid)
		if(um.id) {
			renderRoomiesView(um)
		}else{
			um.on('sync',function() {
				renderRoomiesView(um)
			})
		}
	},

	handleLogout: function(){
		ref.unauth()
		DOM.render(<SplashView />, document.querySelector('.container'))
	}

	// handleDashView2: function(){

	// 	var myMod = new Models.UserModelFetcher(ref.getAuth().uid)
	// 	myMod.fetch()
		
	// 	if ( myMod.id === ref.getAuth().uid ){
	// 		Actions.routeUserToProperView(myMod)

	// 	} else {
	// 		myMod.on('sync', function(){
	// 			Actions.routeUserToProperView(myMod)
	// 		})
	// 	}
	// }


})

var rtr = new RoomieRouter()


