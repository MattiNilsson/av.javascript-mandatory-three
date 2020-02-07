import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/Login"
import Reg from "./components/Reg"
import Todos from "./components/Todos"
import { token$, updateToken } from './store';
import jwt from "jsonwebtoken";
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      token : token$.value,
    }

    this.logout = this.logout.bind(this);
  }

  logout(e){
    localStorage.clear();
    updateToken(null);
    this.setState({token : null})
  }

  componentDidMount() {
    this.subscription = token$.subscribe((token) => this.setState({ token }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onUpdateRoute(e) {
    console.log("WORKS")
    this.setState({token : this.state.token})
  }

  render(){
    let profile;
    if(this.state.token){
      profile = 
      <div className="user">
      <button className="logoutBtn" onClick={this.logout}>LogOut</button>
      <img className="profile" />
      </div>
    }else{
      profile = <div></div>;
    }

    console.log("LOG : " + this.state.token)
    return (
      <div className="App">
        <div className="overall">
          <Router>
            <header>
              <h1>Todo Application</h1>
              <Link to="/login"><button className="headerBtn leftBtn">Login Page</button></Link>
              <Link to="/reg"><button className="headerBtn rightBtn">New Account</button></Link>
              {profile}
            </header>
            <Route path="/login" component={Login}/>
            <Route path="/reg" component={Reg}/>
            <Route exact path="/" component={Todos}/>
          </Router>
        </div>
      </div>

    );
  }
}


export default App;
