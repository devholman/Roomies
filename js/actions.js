import {Collections, Models} from './collections'


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
	var hc = new Collections.HousesCollection()
	var houseObj = hc.create({
		name:houseName
	})
	console.log(houseObj)
	var habColl = new Collections.HabitationsCollection()
	habColl.create({
		houseID: houseObj.id,
		userId: currentUserId
	})
},

 

 // addRoomate: function(roomieName,roomieEmail){
 // 	// I need to query by email to return object 
 // 	//for this user and add them to the habitat by their id
 // 		})
 // },

 addAChore: function(choreText){
 	var currentUserId = ref.getAuth().uid
	var cc = new Collections.ChoresCollection()
	var hc = new Collections.HabitationsCollection()

	console.log("this is hc:", hc)
	console.log('this is cc:',cc)
 		cc.create({
 			choreName: choreText,
 			done: false,
 			done_by: 'date',
 			userId: currentUserId
 		
 	
 		})
 }

}



