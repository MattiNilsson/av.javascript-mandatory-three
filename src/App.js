import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/Login"
import Reg from "./components/Reg"
import Todos from "./components/Todos"
import './App.css';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <h1>My Todo App</h1>
        <Router>
          <header>
            <Link to="/login"><button>Login Page</button></Link>
            <Link to="/reg"><button>Regestration Page</button></Link>
          </header>
          <Route path="/login" component={Login}/>
          <Route path="/reg" component={Reg}/>
          <Route exact path="/" component={Todos}/>
        </Router>
      </div>

    );
  }
}


export default App;
