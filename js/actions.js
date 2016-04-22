import {Collections, Models} from './collections'
import DOM from 'react-dom'
import React, {Component} from 'react'
import {DashView,RoomieChore} from './views'
import BackboneFire from 'bbfire'




var ref = new Firebase("https://roomieshare.firebaseio.com/")

function triggerBackboneEventAsync(evtName, payload){
	setTimeout(function(){
		console.log("poll for new data triggering!")
		BackboneFire.Events.trigger(evtName, payload)
	},	500 )
}

export var Actions = {

 userSignIn: function(email,password){
	// 
	ref.authWithPassword({
		email:email,
		password:password
	}, function(error,authData){
		if (error) {
			console.log(error)
		}
		else{
			// 
			// var um = new Models.UserModel(authData.uid) 
			// 
			// um.fetchWithPromise().then(function(){
			// 	
			location.hash = "houseChores"
		}
	})
 },

  AutoSignIn: function(email,password){  // this function is a duplicate of the signIn func above
 										// it's purpose - sends user to dashView instead of chores 
 	ref.authWithPassword({
 		email:email,
 		password:password
 	}, function(error,authData){
 		if (error) {
 			console.log(error)
 		}
 		else{
 			// 
 			// var um = new Models.UserModel(authData.uid) 
 			// 
 			// um.fetchWithPromise().then(function(){
 			// 	
 			location.hash = "DashView"
 		}
 	})
  },
 createUser: function(email,password,name){
	var self = this
	ref.createUser({
		email: email,
		password:password
	}, function(error,authData){
		if(error) {
			alert(error)
		}
		else{
			var userMod = new Models.UserModel(authData.uid)
			userMod.set({
				name :name,
				email:email,
				id   :authData.uid,
			})
			self.AutoSignIn(email,password)
		}
	})
 },

 doSignUp: function(){
 	location.hash = "createAccount"
 },

 doSignIn: function(){
 	location.hash = "logIn"
 },

 addHouse: function(houseName){ // creates a house name during initial user account setup
	var currentUserId = ref.getAuth().uid
	var hc = new Collections.HousesCollection()
	var houseObj = hc.create({
		name:houseName
	})
	var houseId = houseObj.id
	// 
	var um = new Models.UserModel(currentUserId) // sets the house id on the user model
	
	um.on('sync change', function(){
		triggerBackboneEventAsync('pollForNewData', um.get('houseId'))
	})

	um.set({houseId:houseId})
	location.hash = "houseChores"
 },


 addRoomate: function(roomieModel,houseId){
 	// sets & saves (autosync is set to false on query func) 
 	//the passed in houseId to the roomie model that was passed
 	// from RoomieAdder<_submitRoomie function on views.js

	roomieModel.set({houseId: houseId}) 	
	roomieModel.save()
 		
 },

 removeItem: function(choreModel){
 	console.log ("trying to delete:", choreModel)
 	// choreModel.url = `http://roomieshare.firebaseio.com/chores/${choreModel.id}`
 	choreModel.destroy()
 },

 addAChore: function(choreText,houseId){
 	var currentUserId = ref.getAuth().uid
	var cc = new Collections.ChoresCollection()
 		cc.create({
 			choreText: choreText,
 			done: false,
 			houseId: houseId,
 			userId: "_",
 			userEmail: "_"
 		})
 },

 grabAChore: function(choreModel){
 	var currentUserId = ref.getAuth().uid
 	choreModel.set({
 		userId: currentUserId,
 		userEmail: ref.getAuth().password.email
 	})
 
 },

 sendBack: function(choreModel){
 	console.log(choreModel)
 	choreModel.set({
 		userId: "_",
 		userEmail: "_"
 	})
 }

}






