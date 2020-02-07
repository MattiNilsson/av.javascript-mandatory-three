import React from 'react';
import axios from "axios";
import { Redirect } from "react-router";
import { token$, updateToken } from '../store';

function addId(fn, id) {
  return (e) => fn(e, id);
}

class Reg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      details : {
        email : "",
        username : "",
        password : "",
        repassword : "",
      },
      Success : false,
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.onChangeEmail= addId(this.onChange, "email");
    this.onChangeUserName = addId(this.onChange, "username");
    this.onChangePassWord= addId(this.onChange, "password");
    this.onChangeRePassWord = addId(this.onChange, "repassword");
  }

  onSubmit(e){
    e.preventDefault();
    console.log("works")
    if(this.state.details.password !== this.state.details.repassword){
      alert("Passwords Don't Match")
    }else{
      axios.post("http://3.120.96.16:3002" + "/register", {
        email : this.state.details.email, 
        password : this.state.details.password,
      })
      .then((response) => {
        console.log(response)
        localStorage.clear();
        updateToken(null);
      })
      .then(() =>{
        this.setState({success : true})
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  componentWillMount(){
    this.subscription = token$.subscribe(token => this.setState({ token }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onChange(e, id){
    console.log(id + " : " + e.target.value)
    this.setState({ details: {
      ...this.state.details,
      [id]: e.target.value
    }});
  }

  render() { 
    if(this.state.success){
      return <Redirect to="/login" />
    }
    return (
    <div className="flex log">
      <h1 style={{marginBottom : "20px",}}>Regestration</h1>
      <form onSubmit={this.onSubmit}>
      email<input type="email" onChange={this.onChangeEmail} value={this.state.details.email}/>
      username<input  onChange={this.onChangeUserName} value={this.state.details.username}/>
      password<input type="password" onChange={this.onChangePassWord} value={this.state.details.password}/>
      re-password<input type="password" onChange={this.onChangeRePassWord} value={this.state.details.repassword}/>
      <button type="submit">Regester</button>
      </form>
    </div>
    );
  }
}

export default Reg;