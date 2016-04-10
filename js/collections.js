import BackboneFire from 'bbfire'

var rootURL = "https://roomieshare.firebaseio.com/"
var ref = new Firebase("https://roomieshare.firebaseio.com/")


export var Collections = {

	RoomiesCollection: BackboneFire.Firebase.Model.extend({
		
		initialize: function(){
		this.url = `${rootURL}/roomies`
		}
	}),

	ChoresCollection: BackboneFire.Firebase.Model.extend({

		initialize: function(){
			this.url = `${rootURL}/chores`
		}
	}),

	UserCollection: BackboneFire.Firebase.Collection.extend({
		initialize: function(){
		this.url = `${rootURL}/users/`
		}
	}),

	UserHouseCollection: BackboneFire.Firebase.Collection.extend({
		initialize: function(uid){
			this.url = `${rootURL}/users/${uid}/houses/`
		}
	}),

	HousesCollection: BackboneFire.Firebase.Collection.extend({
		url: `${rootURL}/houses/`
	}),

	QueryByEmail: BackboneFire.Firebase.Collection.extend({
	    initialize: function(targetEmail) {
	        this.url = ref.child('users').orderByChild('email').equalTo(targetEmail)
	    },
	    autoSync: false
	})
}

export var Models = {
	UserModel: BackboneFire.Firebase.Model.extend({
		initialize: function(uid){
			this.url = `${rootURL}/users/${uid}`
		},
		autoSync: false
	}),

	ChoreModel: BackboneFire.Firebase.Model.extend({
			defaults: {
				status:"To Do",
				done  : false
			}
	})
}
