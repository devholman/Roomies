	import React, {Component} from 'react'
	import {Actions} from './actions'
	import {Collections,Models} from './collections'
	import DOM from 'react-dom'
	import BackboneFire from 'bbfire'





	var Header 	   = React.createClass({
		render: function(){
			return(
				<div className="header-container">
					<h3 className="header">Roomies</h3>
					<h6>Sharing a home has never been easier</h6>
					<hr/>
				</div>
			)
		}
	})

	var SplashHeader = React.createClass({
		
		_signerUpper: function(){
			Actions.doSignUp()
		},

		_signerInner: function(){
			Actions.doSignIn()
		},

		render: function(){
			return(
				<div className="splash-header-container">
					<h2 className="splash-title">Roomies</h2>
					<div className="splash-btn-container">
						<button onClick={this._signerInner}>Sign In</button>
						<p>|</p>
						<button onClick={this._signerUpper}>Sign Up</button>
						<p>|</p>
						<button>How it Works</button>
						<p>|</p>
						<button>Contact</button>


					</div>
				</div>
			)
		}
	})

	var NavBar 	   = React.createClass({
		

		render: function(){
			return(
				<div className="nav-bar-container">
					<a className="nav-links" href="#chores">House Chores </a>
					<a className="nav-links" href="#myHouse">My Chores </a>
					<a className="nav-links" href="#addRoomies">Add Roomies </a>					
					<a className="nav-links" href="#createHouse">Create a new house </a>
					<a className="nav-links" href="#logOut">LogOut </a>
					<hr/>
				</div>
			)
		}
	})

	var SplashView = React.createClass({

		render: function(){
			return(
				<div className="splash-container">
					<SplashHeader />
					<div className="background-img"></div>
					<h3>"Sharing a home has never been easier"</h3>
				</div>
			)
		}
	})

	var DashView   = React.createClass({

		getInitialState: function(){
			return {
				houseId: this.props.houseId
			}
		},

		// if the user has house id they're directed to DashView
		// if user doesn't have house id they're directed to wait for invite or create house
		componentDidMount: function(){
			var component = this
			BackboneFire.Events.on('pollForNewData', function(houseIdVal){
				console.log("poll for data heard!")
				component.setState({
					houseId: houseIdVal
				})

			})
		},

		render: function() { 

							
			console.log(this.state.houseId)
			if (this.state.houseId !== undefined) {
				var content = <div>
								<Header/>
								<NavBar />
							  </div>
			}
			else {
				var content = (
					<div>
						<Header/>
						<NavBar />
						<h3>Please wait for a House Invite</h3><br/>
						<h3>Or</h3>
						<CreateNewHouseView/>
					</div>
				)
			}
				return (
					<div className="dash" >
						{content}
					</div>
				)
		}
	})


// *************** User Sign Up and Sign in Views ******************

	var AuthView = React.createClass({

		render:function(){
			return(
				<div className="authPage">
					<Header />
					<SignUp /> 
				</div>
			)
		}
	})

	var SignUp 	 = React.createClass({

		_doSignUp: function(e) {
			e.preventDefault()
			Actions.createUser(this.email,this.password,this.name)
			e.target.value = ''
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
					<form onSubmit={this._doSignUp} className="signUp-form">
						<h3>Create an Account</h3>
						Enter your name:
						<input onChange={this._updateName} required/><br/>
						Enter Email:<br/>
						<input onChange={this._updateEmail} required/><br/>
						Enter a password:<br/>
						<input onChange={this._updatePassword} type="password" required/><br/>
						<input className="button-primary" id="signUpBtn" type="submit" DefaultValue="Sign Up"/><br/>
					</form>
				)
		}
	})

	var SignIn   = React.createClass({

		_doSignIn: function(e) {
			e.preventDefault()
			Actions.userSignIn(this.email,this.password)
			e.target.value = ''
		},
		
		_updateEmail: function(e){

			this.email = e.target.value
		},

		_updatePassword: function(e){

			this.password = e.target.value
		},
		
		render: function(){
			return(
				<div className="signIn-container">
					<Header />
					<form onSubmit={this._doSignIn}>
						<h3>Sign In</h3>
						Enter Email:<br/>
						<input className="user-info" onChange={this._updateEmail} placeholder='' required/><br/>
						Enter a password:<br/>
						<input className="user-info" onChange={this._updatePassword} type="password" placeholder='' required/><br/>
						<input className="button-primary" type="submit" id="signInBtn" DefaultValue="Sign In"/><br/>
					</form>
				</div>
				)
		}
	})

	var CreateNewHouseView = React.createClass({
		_updateHouseName: function(e){
			e.preventDefault()
			this.house = e.target.value
		},

		_addHouse: function(e){
			e.preventDefault()
			Actions.addHouse(this.house)
			
			// location.hash = "DashView"
		},

		render: function(){
			return(
				<div>
					<form onSubmit={this._addHouse}>
						<h4> Create a house name: </h4><br/>
						<input onChange={this._updateHouseName} placeholder="Enter a house name"/><br/>
						<input className="button-primary" type="submit" id="addHouseBtn" DefaultValue="add house" />
					</form>
				</div>
			)
		}
	})


// *************** MY HOUSE VIEWS ******************

	var MyHouseView 		 = React.createClass({
		componentDidMount:function(){
			var component = this
			this.props.roomieChoresColl.on('sync update', function(){
				component.forceUpdate()
			})
		},

		render: function(){
			return(
				<div>
					<Header />
					<NavBar />
					<RoomieHouseChoreView myMod={this.props.myMod} roomieChoresColl={this.props.roomieChoresColl} />
				</div>
			)
		}
	})

	var RoomieHouseChoreView = React.createClass({

		_viewChore: function(choreMod, i){
			if(!choreMod.id ){return ''}
			return <RoomieChore key={i} choreMod={choreMod}/>
		},

		render: function(){
			var myMod = this.props.myMod
			var userName = myMod.get('name')
			console.log("roomie chores list:", this.props.roomieChoresColl)
			return(
				<div>
					<div className="welcome-header">
						<h3>{`Welcome ${userName}`}</h3>
					</div>
					<div className="my-chores-container">
						<h5>My Chores</h5>
						<div>
							{this.props.roomieChoresColl.map(this._viewChore)}
						</div>

					</div>
				</div>
			)
		}
	})

	var RoomieChore 		 = React.createClass({
		
		_deleter: function(choreModel){
			Actions.removeItem(this.props.choreMod)
		},

		_updater: function(){
			this.forceUpdate()
		},

		_remover: function(choreModel){
			Actions.sendBack(this.props.choreMod)
		},

		render: function(){
			return(
				<div className="single-chore-container">
					<div className="chore-header">
						<button onClick={this._deleter}>X</button>
					</div>
					<div className="chore-body">
						<p>{this.props.choreMod.get('choreText')}</p>
						<button className="unclaim-chore-btn" onClick={this._remover}>Unclaim</button>
					</div>
				</div>
			)
		}
	})


// *************** CHORE VIEWS ******************

	var ChoresView = React.createClass({
		
		componentDidMount:function(){
			var component = this
			this.props.choresInHouseColl.on('sync update', function(){
				component.forceUpdate()
			})
		},

		_genButtons: function(){
			var btns =[" Show All","Claimed","Unclaimed"].map(function(toDoStatus,id){
				return <button key={id} onClick={this._buttonValue} value={toDoStatus}>{toDoStatus}</button>
			}.bind(this))
			return btns
		},

		_buttonValue: function(e){
			var buttonVal = e.target.value
				this.setState ({
					viewType: buttonVal
				})
		},


		getInitialState: function(){  //puts the data from the collection on state
			return{    
				choreData: this.props.choresInHouseColl,
				viewType: " Show All" 
			}
		},

		_NoIdView: function(choreModel){
			if(choreModel.get('userId') === undefined){
				return true
			}else{
				return false
			}
		},

		_hasId: function(choreModel){
			if(!choreModel.get('userId') === undefined){
				return true
			}else{
				return false
			}
		},

		render: function(){
			var choresShowing = this.state.choreData.models
			if(this.state.viewType === "Unclaimed")choresShowing =this.props.choresInHouseColl.filter(this._NoIdView)
			if(this.state.viewType === "Claimed")choresShowing=this.props.choresInHouseColl.filter(this._hasId)

			return(
				<div>
					<Header />
					<NavBar />
					<div className="view-buttons">{this._genButtons()}</div>
					<ChoresList choresInHouseColl={this.props.choresInHouseColl} choreData={choresShowing} houseId={this.props.houseId}/>
				</div>
			)
		}
	})

	var ChoresList = React.createClass({

		_makeChore: function(choreModel,i){
			if(!choreModel.id ){return ''} //removes firebase ghost model
			return <Chore model={choreModel} key={i} choresInHouseColl={this.props.choresInHouseColl} />
		},

		_choreAdder: function(keyEvent){
			if(keyEvent.keyCode ===13){
				var newChore = keyEvent.target.value
				var houseId = this.props.houseId
				Actions.addAChore(newChore,houseId)
				keyEvent.target.value=''
			}
		},
//if the viewType = claimed then filter chores collection for all with user id
// if the viewType = unclaimed then filter chores collection for all where userid is undefined
//{this.props.choresInHouseColl.filter(this._filterView).map(this._makeChore)}					

		componentDidMount: function(){
			var component = this
			BackboneFire.Events.on('getUserId', function(userId){
			})
		},

		render: function(){

		   // if(this.props.viewType === "dash")// ....your logic here for var scssViewClass= «class-name-in-scss»
			//	{this.props.choresInHouseColl.map(this._makeChore)}
			

			return(
	
					<div className="chores-container">
						<h5>Shared Chores</h5><br/>
						<div>
							<input className="search-bar" placeholder="Add a new chore" onKeyDown={this._choreAdder} />	
							{this.props.choreData.map(this._makeChore)}
						</div>
					</div>

				
			)
		}
	})

	var Chore 	   = React.createClass({

		_remover: function(){
			Actions.removeItem(this.props.model)
		},

		_grabber: function(){
			Actions.grabAChore(this.props.model)
		},

		render: function(){
		 // case where chore is claimed
			var buttonStyleObj={
				display:"none"
			}
			var claimed=`claimed by: ${this.props.model.get('userEmail')}`

		
		//case where chore is unclaimed

			if(!this.props.model.get('userId')){ // if userId is not set on the chore model then show the 'claim' button
				buttonStyleObj.display="inline-block"
				claimed = ''
			}



			
			return(
				<div className="single-chore-container" id="chore-styles">
					<div className="chore-header">
						<button style={buttonStyleObj} className="chore-remove-btn" onClick={this._remover}>X</button>
					</div>
					<div className="chore-body">
						<p>{this.props.model.get('choreText')}</p>
						<button style={buttonStyleObj} className="grab-chore-btn" onClick={this._grabber}>Claim it</button>
						
					</div>
					<div className="chore-footer">
						<span>{claimed}</span>
					</div>
				</div>
			)
		}
	})


// *************** ROOMIE VIEWS ******************

	var RoomieView  = React.createClass({
		
		componentDidMount: function(){
			var component = this
			this.props.roomiesInHouseColl.on('sync update', function(){
				component.forceUpdate()
			})
		},

		render: function(){
			return(
				<div>
					<Header />
					<NavBar />
					<RoomieAdder houseId={this.props.houseId} />
					<RoomieList houseId={this.props.houseId} roomiesInHouseColl={this.props.roomiesInHouseColl} />
				</div>
			)
		}
	})

	var RoomieAdder = React.createClass({

		_addRoomieEmail: function(e){
		// captures the email the user entered
			e.preventDefault()
			this.roomieEmail = e.target.value
		},

		_submitRoomie: function(e){
		// takes roomies' email and searches database for a match
		// once email is fetched, houseId and user model is passed to addRoomate
			e.preventDefault()
			var houseId = this.props.houseId
			
			var emailQuery = new Collections.QueryByEmail(this.roomieEmail)
				emailQuery.fetchWithPromise().then(function(){
					
					var userToAdd = emailQuery.models[0]
					if (userToAdd.id) Actions.addRoomate(userToAdd,houseId)
					else alert ("There is no registered user with this email. Please try again.")
				})
		},

		render: function(){
			return(
				<div className="roomie-container">
					<form onSubmit={this._submitRoomie}>
						<h5>Add a Roomie:</h5><br/>
						Email:
						<input type="text" id="roomieEmail" onChange={this._addRoomieEmail}/><br/>
						<input className="button-primary" id="addRoomieBtn" type="submit" defaultValue="Add Roomie"/><br/>
					</form>
				</div>
			)
		}
	})

	var RoomieList  = React.createClass({
		// maps the collection of roomie names to the page
		
		_getRoomie: function(model, i){
			if(!model.id){return ''} // removes firebase ghost model
			return <Roomie key={i} user={model} />
		},

		render: function(){
			
			return(
				<div className="roomie-list-container">
					<h3>All My Roomies</h3>
					{this.props.roomiesInHouseColl.map(this._getRoomie)}
				</div>
			)
		}
	})

	var Roomie 		= React.createClass({
		// pulls the roomie data from it's model & sends to RoomieList
		render: function(){
			return(
				<div>
					<p>{this.props.user.get('name')}</p>

				</div>
			)
		}
	})

export{SplashView,SignIn,AuthView,DashView,MyHouseView,ChoresView,Chore,RoomieView,RoomieChore,CreateNewHouseView}
