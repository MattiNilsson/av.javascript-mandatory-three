import React from 'react';
import axios from "axios";
import { Redirect } from "react-router";
import { token$, updateToken } from '../store';



class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      email : "",
      password : "",
      token : token$.value,
      submitted : false,
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.subscription = token$.subscribe(token => this.setState({ token }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onSubmit(e){
    e.preventDefault();
    axios.post("http://3.120.96.16:3002" + "/auth", {
        email : this.state.email, 
        password : this.state.password,
    })
    .then((response) =>{
      updateToken(response.data.token);
    })
  }

  onChange(e){
    console.log(e.target.name + " : " + e.target.value)
    this.setState({[e.target.name] : e.target.value});
  }

  render() { 
    if(this.state.token) {
      return <Redirect to="/"/>
    }

    return ( 
    <div className="flex log">
      <h1 style={{marginBottom : "20px",}}>login</h1>
      <form onSubmit={this.onSubmit}>
      Email<input 
        name="email" 
        onChange={this.onChange} 
        value={this.state.email} 
        type="email"
      />
      Password<input 
        name="password" 
        onChange={this.onChange} 
        value={this.state.password} 
        type="password" 
      />
      <button type="submit">Log in</button>
      </form>
    </div>
    );
  }
}
 
export default Login;