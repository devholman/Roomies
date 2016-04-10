import {Collections,Models} from './collections'


var ref = new Firebase("https://roomieshare.firebaseio.com/")

export var Actions = {
	roomies: null,

 userSignIn: function(email,password){
	console.log(email)
	ref.authWithPassword({
		email:email,
		password:password
	}, function(error,authData){
		if (error) console.log(error)
		else{
			// console.log('signing in')
			// var um = new Models.UserModel(authData.uid) 
			// console.log("this is um:", um) //puts all user data on the router
			// um.fetchWithPromise().then(function(){
			// 	console.log('fetched')
				location.hash = "createHouse"
			
		}
	})
 },

 createUser: function(email,password,name){
	console.log(email,password,name)
	ref.createUser({
		email: email,
		password:password
	}, function(error,authData){
		if(error) console.log(error)
		else{
			var userColl = new Collections.UserCollection(authData.uid)
			userColl.create({
				name :name,
				email:email,
				id   :authData.uid
			})
		}
	})
 },

 addHouse: function(houseName){
	var currentUserId = ref.getAuth().uid
	var hc = new Collections.HousesCollection(currentUserId)
	hc.create({
		houseName:houseName,
		roomies: null
	})

	hc.on('sync',function() {
		var theHouse = hc.where({houseName: houseName})[0]
		console.log(theHouse)
		var houseId = theHouse.id
		console.log(houseId)

		var um = new Models.UserModel(currentUserId)
			um.set({
				houseName: houseName,
				houseID  : houseId
			})
	})
 },

 addRoomate: function(roomieName,roomieEmail){
 	var uc = new Collections.UserCollection()
 		uc.create({
 			roomieName : roomieName,
 			roomieEmail: roomieEmail
 		})

 		uc.on('sync', function(){
 			var theRoomie = uc.where({roomieEmail:roomieEmail})[0]
 				console.log(theRoomie)
 			var roomieEm = theRoomie.get('roomieEmail')
 				console.log("the new roomie:", roomieEm)
 			
 			var qe = new Collections.QueryByEmail(roomieEm)
 			console.log("this is qe",qe)

 		})
 },

 addAChore: function(choreText){
 	var currentUserId = ref.getAuth().uid

 		var cc = new Collections.ChoresCollection(currentUserId)
 			
 			cc.set({
 				chore: choreText
 			})
 }

}


