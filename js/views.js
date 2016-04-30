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
				<div className="splash-header-container col-xs-12 col-sm-12">
					<h2 className="splash-title col-xs-12 col-sm-12">Roomies</h2>
					<nav className="splash-btn-container col-xs-12 col-sm-12">
						<button onClick={this._signerUpper}>Sign Up</button>
						<p>|</p>
						<button onClick={this._signerInner}>Sign In</button>
						<p>|</p>
						<button>How it Works</button>
						<p>|</p>
						<button>Contact</button>
					</nav>
				</div>
			)
		}
	})

	var NavBar 	   = React.createClass({
		

		render: function(){
			return(
				<nav className="container-fluid nav-bar-container align-children">
					<a className="nav-links" href="#houseChores">House Chores </a>
					<a className="nav-links" href="#myChores">My Chores </a>
					<a className="nav-links" href="#addRoomies">Add Roomies </a>					
					<a className="nav-links" href="#createHouse" id="create-house-btn">Create a new house </a>
					<a className="nav-links" href="#logOut">Logout </a>
					<hr/>
				</nav>
			)
		}
	})

	var SplashView = React.createClass({

		render: function(){
			return(
				<div className="splash-container">
					<SplashHeader />
					<div className="splash-background-img"></div>
					<h3>"Sharing a home has never been easier"</h3>
					<HowItWorks/>
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
			// console.log(this.state.houseId)
			if (this.state.houseId !== undefined) {
				var content = <div>
								<Header/>
								<NavBar />
							  </div>
			}else {
				var content = (
					<div>
						<Header/>
						<NavBar />
						<div className="container invite-page">
							<h3 className="invite-text">Please wait for a <u>House Invite</u> from an existing house owner...</h3><br/>
							<h3 className="invite-text">Or</h3>
							<CreateNewHouseView/>
						</div>
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
					<div className="signUp-background-img"></div>
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
						<label>Enter your name:</label><br/>
						<input onChange={this._updateName} required/><br/>
						<label>Enter Email:</label><br/>
						<input onChange={this._updateEmail} required/><br/>
						<label>Enter a password:</label><br/>
						<input onChange={this._updatePassword} type="password" required/><br/>
						<input className="button-primary" id="signUp-btn" type="submit" DefaultValue="Sign Up"/><br/>
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
					<div className="signIn-background-img"></div>
					<form onSubmit={this._doSignIn}>
						<h3>Sign In</h3>
						<label>Enter Email:</label><br/>
						<input className="user-info" type="text" onChange={this._updateEmail} placeholder='' required/><br/>
						<label>Enter a password:</label><br/>
						<input className="user-info" type="text" onChange={this._updatePassword} type="password" placeholder='' required/><br/>
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
				<div className="container">
					<form onSubmit={this._addHouse} className="add-house-form">
						<h4 className="invite-text"> Create a new house name : </h4><br/>
						<div>
							<input onChange={this._updateHouseName} placeholder="Enter a house name"/>
							<input className="button-primary" type="submit" id="add-house-btn" DefaultValue="add house" />
						</div>
					</form>
				</div>
			)
		}
	})

// *************** HOW IT WORKS ********************
var HowItWorks = React.createClass({
	
	render: function(){
		return(
			<div className="hiw-container">
				<h3>How It Works</h3>
				<SignUpCreateHouse/>
				<AddYourRoomies/>
				<ListHouseChores/>
				<DoYourPart/>
			</div>

		)
	}
})

var SignUpCreateHouse = React.createClass({
	render: function(){
		return(
			<div className="hiw-create-house">
				<div>
					<h4>Sign Up! If you are the first Roomie to sign up, Create a house name. Or if your roomie has already created a house, have your roomie add you to their existing house using your email</h4>
				</div>
				<img src="./images/addHouse.png"/>
			</div>
		)
	}
})

var AddYourRoomies = React.createClass({
	render: function(){
		return(
			<div className="hiw-add-roomies">
				<img src="./images/addRoomies.png"/>
				<div>
					<h4>Add your Roomie using their email</h4>
				</div>
			</div>
		)
	}
})

var ListHouseChores = React.createClass({
	render: function(){
		return(
			<div className="hiw-list-chores">
				<div>
					<h4>Create a List of shared house chores</h4>
				</div>
				<img src="./images/listChores.png"/>
			</div>
		)
	}
})

var DoYourPart = React.createClass({
	render: function(){
		return(
			<div className="do-your-part">
				<img src="./images/doYourPart.png"/>
				<div>
					<h4>Do your part by claiming and completing chores</h4>
				</div>
			</div>
		)
	}
})

// *************** CONTACT ********************
// var ContactUs = React.createClass({
	
// 	render: function(){
// 		return(
// 			<div className="contact-container">
// 				<h3>Connect with Us</h3>
// 				<form>
// 					<label>Name:</label>
// 					<input type="text"></input>
// 					<label>Email:</label>
// 					<input type="text"></input>
// 					<label>Comment:</label>
// 					<textarea type="text">Hello,this feature is not yet functional. Please email devynholman@outlook.com if you wish to leave a comment.</textarea>
// 					<input type="submit" id="submit-comment"></input>
// 				</form>
// 			</div>
// 		)
// 	}
// })


// *************** MY CHORES VIEWS ******************

	var MyHouseView 		 = React.createClass({
		componentDidMount:function(){
			var component = this
			this.props.roomieChoresColl.on('sync update', function(){
				component.forceUpdate()
			})
		},

		render: function(){
			return(
				<div className="my-house-body">
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
				<div className="container">
					<div className="welcome-header">
						<h3>{`Welcome ${userName}`}</h3>
					</div>


					<table className="table my-chores-list">
						<thead>
							<tr>
								<th>Chore Name</th>
								<th>Status</th>
								<th>Completed</th>
							</tr>
						</thead>
						<tbody>

							{this.props.roomieChoresColl
								.filter(function(cmod){return cmod.id !== undefined})
								.map(this._viewChore)}
						</tbody>
					</table>
					
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
				<tr>
					<td className="my-chore-text">{this.props.choreMod.get('choreText')}</td>
					<td><button className=" btn btn-sm btn-default unclaim-chore-btn" onClick={this._remover}>Unclaim</button></td>
					<td><button className="btn btn-sm btn-danger" onClick={this._deleter}>X</button></td>
				</tr>
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
			if(choreModel.get('userId') === '_'){
				return true
			}else{
				return false
			}
		},

		_hasId: function(choreModel){
			if(choreModel.get('userId') !== '_'){
				return true
			}else{
				return false
			}
		},

		render: function(){
			//if the viewType = claimed then filter chores collection for all with user id
			// if the viewType = unclaimed then filter chores collection for all where userid is undefined
			var choresShowing = this.state.choreData.models
			if(this.state.viewType === "Unclaimed")choresShowing =this.props.choresInHouseColl.filter(this._NoIdView)
			if(this.state.viewType === "Claimed")choresShowing=this.props.choresInHouseColl.filter(this._hasId)

			return(
				<div className="shared-house-chores">
					<Header />
					<NavBar />
					<div className="container">
						<div className="row">
							<div className="col-xs-12 col-sm-3 view-buttons">{this._genButtons()}</div>
							<ChoresListAndInput choresInHouseColl={this.props.choresInHouseColl} choreData={choresShowing} houseId={this.props.houseId}/>
						</div>

					</div>
				</div>
			)
		}
	})

	var ChoresListAndInput = React.createClass({

		_choreAdder: function(keyEvent){
			if(keyEvent.keyCode ===13){
				var newChore = keyEvent.target.value
				var houseId = this.props.houseId
				Actions.addAChore(newChore,houseId)
				keyEvent.target.value=''
			}
		},

		componentDidMount: function(){
			var component = this
			// BackboneFire.Events.on('getUserId', function(userId){
			// })
		},

		render: function(){

			return(
					<div className="col-xs-12 col-sm-9 chores-container shared-chores-list">
						<h5>Shared Chores</h5><br/>
						<div>
							<input className="search-bar" placeholder="Add a new chore and press Enter" onKeyDown={this._choreAdder} />	
							<ChoresTable choreData={this.props.choreData}/>
						</div>
					</div>
			)
		}
	})

	var ChoresTable = React.createClass({

		_makeChore: function(choreModel,i){
			if(!choreModel.id ){return ''} //removes firebase ghost model
			return <Chore model={choreModel} key={i} choresInHouseColl={this.props.choresInHouseColl} />
		},

		render: function(){
			return(
				<div>
					<table className="table striped">
						<thead>
							<tr>
								<th>Chore Name</th>
								<th>Current Status</th>
								<th>Remove Chore</th>
							</tr>
						</thead>
						<tbody>
							{this.props.choreData
								.filter((m)=> {return typeof m.id !== 'undefined'})
								.map(this._makeChore)}
						</tbody>
					</table>
				</div>
			)
		}
	})

	var Chore 	 = React.createClass({

		_remover: function(){
			Actions.removeItem(this.props.model)
		},

		_grabber: function(){
			Actions.grabAChore(this.props.model)
		},

		_showButtonOrClaimedBy: function(clmByTxt){
			if(clmByTxt.length > 0){
				return 	<h6>{clmByTxt}</h6> 

			} else {
				return 	<button className="grab-chore-btn" onClick={this._grabber}>Claim it</button>
			}
		},

		render: function(){
		 // case where chore is claimed
			var buttonStyleObj={
				display:"none"
			}

			var claimedByText=`claimed by: ${this.props.model.get('userEmail')}`
		
			//case where chore is unclaimed
			if(this.props.model.get('userId') === '_'){ // if userId equals _ on the chore model then show the 'claim' button
				claimedByText = ''
				buttonStyleObj={display:"table-cell"}
			}else{
				buttonStyleObj={display:"none"}
			}

			return(
				// make me a tr...
				<tr className="single-chore-container" id="chore-styles">
					<td className="chore-header">
						<h4>{this.props.model.get('choreText')}</h4>
					</td>
					<td className="chore-body">
						{ this._showButtonOrClaimedBy(claimedByText) }
					</td>
					<td className="chore-footer">
						<button style={buttonStyleObj} className="chore-remove-btn" onClick={this._remover}>X</button>
					</td>
				</tr>
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
					<div className="container">
						<RoomieAdder houseId={this.props.houseId} />
						<RoomieList houseId={this.props.houseId} roomiesInHouseColl={this.props.roomiesInHouseColl} />
					</div>
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
						<h1>Add a Roomie:</h1><br/>
						<input type="text" id="roomieEmail" placeholder="Enter Roomie Email" onChange={this._addRoomieEmail}/>
						<input className="button-primary" id="add-roomie-btn" type="submit" defaultValue="Add Roomie"/><br/>
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
				<div className="col-xs-12 col-sm-12 roomie-list-container">
					<h1>All My Roomies</h1>
					<h2>{this.props.roomiesInHouseColl.map(this._getRoomie)}</h2>
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
