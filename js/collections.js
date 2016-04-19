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

	QueryByEmail: BackboneFire.Firebase.Collection.extend({
	    initialize: function(targetEmail) {
	        this.url = ref.child('users').orderByChild('email').equalTo(targetEmail)
	    },
	    autoSync: false
	}),

	QueryByHouseId: BackboneFire.Firebase.Collection.extend({
		initialize: function(targetHouseId){
			this.url = ref.child('chores').orderByChild('houseId').equalTo(targetHouseId)
		}
	}),

	QueryUserByHouseId: BackboneFire.Firebase.Collection.extend({
		initialize: function(targetHouseId){
			this.url = ref.child('users').orderByChild('houseId').equalTo(targetHouseId)
		}
	}),

	QueryByHouseName: BackboneFire.Firebase.Collection.extend({
		initialize: function(targetHouseName){
			this.url = ref.child('houses').orderByChild('name').equalTo(targetHouseName)
		}
	}),

	QueryByUserId: BackboneFire.Firebase.Collection.extend({
		initialize: function(targetUserId){
			this.url = ref.child('chores').orderByChild('userId').equalTo(targetUserId)
		}
	})
}

export var Models = {

	HouseModel: BackboneFire.Firebase.Model.extend({
		initialize: function(){
			this.url = `${rootURL}/houses`
		}
	}),

	UserModel: BackboneFire.Firebase.Model.extend({
		initialize: function(uid){
			this.url = `${rootURL}/users/${uid}`
		}
	}),

	UserModelFetcher: BackboneFire.Firebase.Model.extend({
		initialize: function(uid){
			this.url = `${rootURL}/users/${uid}`
		},

		autoSync: false
		
	}),


	ChoreModel: BackboneFire.Firebase.Model.extend({
		
		url: `${rootURL}/chores/`,
		
			defaults: {
				status:"To Do",
				done  : false
			}
	})
}
