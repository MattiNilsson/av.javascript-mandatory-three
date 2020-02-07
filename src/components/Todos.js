import React from 'react';
import { Redirect } from "react-router";
import Login from "./Login"
import { token$, updateToken } from '../store';
import axios from 'axios';
import jwt from "jsonwebtoken";
import DeleteIcon from '@material-ui/icons/Delete';

class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      token : token$.value,
      value : "",
      todos : [],
      email : "",
    }
    this.onChange = this.onChange.bind(this);
    this.onAddTodo = this.onAddTodo.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount(){
    console.log("mounted")

    this.subscription = token$.subscribe(token => this.setState({ token }));
    const decoded = jwt.decode(this.state.token)
    console.log(decoded)
    this.setState({email : decoded});

    if(this.state.token){
      axios.get("http://3.120.96.16:3002/todos", {
        headers : {
          Authorization: `Bearer ${this.state.token}`,
        }})
      .then((response) => {
        console.log(response);
        this.setState({todos : response.data.todos})
      })
      .catch((error) => {
        console.error(error);
        if(error.response){
          localStorage.clear();
          updateToken(null);
          this.setState({token : null});
        }
      })
    }else{
      this.setState({token : "noToken"})
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  onChange(e){
    this.setState({value : e.target.value})
  }

  onAddTodo(e){
    e.preventDefault();
    if(this.state.value){
      axios.post("http://3.120.96.16:3002/todos", 
      { content : this.state.value}, 
      { headers : {
          Authorization: `Bearer ${this.state.token}`,
        }})
      .then((response) => {
        console.log(response);
        this.setState(state => {
          const todos = [...state.todos, {content : state.value, id : response.data.todo.id}];

          return {
            todos, 
            value : "",
          }
        })
        console.log(this.state.value)
        console.log(this.state.todos)
      })
      .then(() => {
        this.setState({value : ""});
      })
      .catch(() => {
        alert("Something went wrong. Try to re-login please.")
      })
    }else{
      alert("Faulty value")
    }
  }

  onDelete(e){
    let thisID = e.target.parentElement.parentElement.id;
    let target = e.target.parentElement.parentElement;
    if(thisID){
      axios.delete("http://3.120.96.16:3002/todos/" + thisID, 
      { headers : {
        Authorization: `Bearer ${this.state.token}`,
      }})
      .then((response) => {
        console.log(response);
        console.log(target)
        target.remove();
      })
      .then(() =>{
        console.log(this.state.todos)
      })
      .catch((error) => {
        console.log(error)
        alert("Something went wrong. Try to re-login please.")
      })
    }
  }

  render() { 
    if(!this.state.token){
      console.log(token$.value)
      return( <Redirect to="/login" component={Login}/> );
    }

    let allTodos;
    if(this.state.todos[0]){
      allTodos = this.state.todos.map((item, id) =>{
        return (
        <div className="todo" key={id} test={id} id={this.state.todos[id].id}>
          <h3>{item.content}</h3>
          <DeleteIcon className="deleteIcon" onClick={this.onDelete} />
        </div>
        )
      });
    }else{
      allTodos = <div className="todo"><h3>No Todos Yet</h3></div>;
    }
    console.log(this.state.token)
    return ( 
    <div className="flex log">
      <h1>{this.state.email.email}</h1>
      <form onSubmit={this.onAddTodo}>
        new todo<input onChange={this.onChange} value={this.state.value}></input>
        <button type="submit">add todo</button>
      </form>
      <div className="todos flex">{allTodos}</div>
    </div>
    );
  }
}
 
export default Todos;