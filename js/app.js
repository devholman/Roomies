// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"


import BackboneFire from 'bbfire'
import scrollTo from 'jquery.scrollto'
import DOM from 'react-dom'
import React, {Component} from 'react'
import {Actions} from './actions'
import {Collections,Models} from './collections'
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
// window.ref = ref

var Header = React.createClass({
	render: function(){
		return(
			<div className="header-container">
				<h3 className="header">Roomies</h3>
			</div>
		)
	}
})

var HomeView = React.createClass({
	
	_goToLogin: function(){
		location.hash='login'
	},

	_goToCreateAcct: function(){
		location.hash='createAccount'
	},

	render: function(){
		return(
			<div>
				<Header />
				<button onClick={this._goToLogin}>Login</button>
				<button onClick={this._goToCreateAcct}>Sign Up</button>
			</div>
			)
	}
})

var SplashView = React.createClass({
	email: '',
	password: '',
	name: '',
	// houseName: ''

	render:function(){
		return(
			<div className="splashPage">
				<SignUp /> 
				<SignIn />
			</div>
		)
	}
})

var SignUp = React.createClass({

	_doSignUp: function(e) {
		e.preventDefault()
		Actions.createUser(this.email,this.password,this.name)
	},

	_updateName: function(e){

		this.name = e.target.value
	},

	_updateEmail: function(e){

		this.email = e.target.value
	},

	_updatePassword: function(e){

		this.password = e.target.value
	},

	render: function() {
		return (
			<form onSubmit={this._doSignUp}>
					<h3>Create an Account</h3>
					Enter your name:
					<input onChange={this._updateName}/><br/>
					Enter Email:<br/>
					<input onChange={this._updateEmail}/><br/>
					Enter a password:<br/>
					<input onChange={this._updatePassword} type="password"/><br/>
					<input className="button-primary" id="signUpBtn" type="submit" DefaultValue="Sign Up"/><br/>
				</form>
			)
	}
})

var SignIn = React.createClass({

	_doSignIn: function(e) {
		e.preventDefault()
		Actions.userSignIn(this.email,this.password)
	},
	
	_updateEmail: function(e){

		this.email = e.target.value
	},

	_updatePassword: function(e){

		this.password = e.target.value
	},
	
	render: function(){
		return(
			<div>
				<form onSubmit={this._doSignIn}>
					<h3>Sign In</h3>
					Enter Email:<br/>
					<input onChange={this._updateEmail}/><br/>
					Enter a password:<br/>
					<input onChange={this._updatePassword} type="password"/><br/>
					<input className="button-primary" type="submit" id="signInBtn" DefaultValue="Sign In"/><br/>
				</form>
			</div>
			)
	}
})

var HouseCreationView = React.createClass({
	house: '',

	_updateHouseName: function(e){
		e.preventDefault()
		this.house = e.target.value
	},

	_addHouse: function(e){
		e.preventDefault()
		Actions.addHouse(this.house)
		console.log("the new house func", this)
		location.hash = "userDash"
	},

	render: function(){
		return(
			<div>
				<form onSubmit={this._addHouse}>
					<h4> Create a house name: </h4><br/>
					<input onChange={this._updateHouseName}/><br/>
					<input className="button-primary" type="submit" id="addHouseBtn" DefaultValue="add house" />
				</form>
			</div>
		)
	}
})

var UserDashView = React.createClass({
	getInitalState: function(){
		var habitation = this.props.habitationColl
	},

	componentDidMount:function(){
		var component = this
		var habitationColl = new Collections.HabitationsCollection(ref.getAuth().uid)
		habitationColl.on('sync', function(){
			console.log("the hab call, get id:",habitationColl)
			var houseNum = habitationColl.models[0].get('houseID')
			console.log(houseNum)
			// get the houseId off of habitationColl,
			// component.setState({habitationColl: habitationCol})
			// pass down the habitationColl as prlops 
			//    to ChoresView --> ChoreAdder
		})

	},

	render: function(){
		return(
			<div>
				<Header />
				<p>Welcome to user Dash</p>
				<hr/>
				<AddRoomieView/>
				<hr/>
				<ChoresView houseNum={this.houseNum}/>
			</div>
		)
	}
})

var AddRoomieView = React.createClass({
	roomieName: '',
	roomieEmail:'',

	_addRoomieName: function(e){
		this.roomieName = e.target.value
	},

	_addRoomieEmail: function(e){
		e.preventDefault()
		 
		this.roomieEmail = e.target.value
	},

	_submitRoomie: function(e){
		e.preventDefault()
		Actions.addRoomate(this.roomieName,this.roomieEmail)
	},

	render: function(){
		return(
			<div className="roomie-container">
				<form onSubmit={this._submitRoomie}>
					<h5>Add a Roomie:</h5><br/>
					Name:
					<input type="text" id="roomieName" onChange={this._addRoomieName}/><br/>
					Email:
					<input type="text" id="roomieEmail" onChange={this._addRoomieEmail}/><br/>
					<input className="button-primary" id="addRoomieBtn" type="submit" defaultValue="Add Roomie"/><br/>
				</form>
			</div>
		)
	}
})

var ChoresView = React.createClass({
	choreName: '',


	render: function(){
		return(
			<div className="chores-container">
				<div>
					<h5>Shared Chores</h5><br/>
					<ChoreAdder/>
				</div>
				<div>
					<h5>My Chores</h5>
				</div>
			</div>
		)
	}
})

var ChoreAdder = React.createClass({
		
	_handleKeyDown: function(keyEvent){
		if(keyEvent.keyCode ===13){
			var newChore = keyEvent.target.value

			//this.props.currentHouseId	
			console.log('chore adder view:', this.props.houseNum)

			Actions.addAChore(newChore)
			keyEvent.target.value=''
		}
	},

	render: function(){
		console.log(this.props)
		return(
			<input className="search-bar" placeholder="Add a new chore" onKeyDown={this._handleKeyDown}></input>
		)
	}
})

var RoomieRouter = BackboneFire.Router.extend({
	routes:{
		"createAccount"  : "handleSignUp",
		"createHouse"    : "handleHouseCreation",
		"userDash"		 : "handleUserDash",
		"login"          : "handleLogin",
		"*Default"       : "handleHome"
	},
	
	initialize: function(){
		this.ref = new Firebase(rootURL)

		if (!this.ref.getAuth()) {
		    location.hash = "createAccount"
		}

		this.on('route', function() {
		    if (!this.ref.getAuth()) {
		        location.hash = "createAccount"
		    }
		})
		BackboneFire.history.start()
	},

	handleHome: function(){
		DOM.render(<HomeView/>, document.querySelector('.container'))
	},

	handleSignUp: function(){

		DOM.render(<SplashView />, document.querySelector('.container'))
	},

	handleHouseCreation: function(){
		
		DOM.render(<HouseCreationView />, document.querySelector('.container'))
	},

	handleUserDash: function(){
		DOM.render(<UserDashView />, document.querySelector('.container'))
	},

	_roommateAdder: function(roomieEmail){
		console.log(self.um.get('houseID'))

	}
})

var rtr = new RoomieRouter()


