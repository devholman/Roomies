import BackboneFire from 'bbfire'

var rootURL = "https://roomieshare.firebaseio.com/"
var ref = new Firebase("https://roomieshare.firebaseio.com/")


export var Collections = {


	ChoresCollection: BackboneFire.Firebase.Collection.extend({

		initialize: function(){
			this.url = `${rootURL}/chores`
		}
	}),

	UserCollection: BackboneFire.Firebase.Collection.extend({
		initialize: function(){
		this.url = `${rootURL}/users/`
		}
	}),

	HousesCollection: BackboneFire.Firebase.Collection.extend({
		initialize:function () {
			this.url = `${rootURL}/houses/`
		}
	}),

	HabitationsCollection: BackboneFire.Firebase.Collection.extend({
		url: `${rootURL}/habitations`,

		initialize: function(){
			var ref = new Firebase(this.url)
			this.url = this.url
		
		}
	}),

	QueryByEmail: BackboneFire.Firebase.Collection.extend({
	    initialize: function(targetEmail) {
	        this.url = ref.child('users').orderByChild('email').equalTo(targetEmail)
	    },
	    autoSync: false
	})
}

export var Models = {

	HouseModel: BackboneFire.Firebase.Model.extend({
		urlRoot: `${rootURL}/houses`
	}),

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
