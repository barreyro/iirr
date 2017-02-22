import React, { Component } from 'react';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers';
import {pipe, partial} from './lib/utils'
import {loadTodos, createTodo, saveTodo, destroyTodo} from './lib/todoService'

class App extends Component {
  state = {todos: [],
    currentTodo: ''
  }

  static contextTypes ={
    route: React.PropTypes.string
  }

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos}))
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({todos: updatedTodos})
    destroyTodo(id)
      .then(()=>this.showTempMessage('Todo Removed'))
  }

  handleToggle = (id) => {
    const getToggledTodo= pipe(findById, toggleTodo)
    const updated = getToggledTodo(id, this.state.todos)
    const getUpdatedTodos = partial(updateTodo, this.state.todos)
    const updatedTodos = getUpdatedTodos(updated)
    this.setState({todos: updatedTodos}) 
    saveTodo(updated)
      .then(()=> this.showTempMessage('Todo updated'))
  }
  
  handleSubmit = (evt) => {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {id: newId, name: this.state.currentTodo, isComplete: false}
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    });
    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'))

  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }

  handleEmptySubmit = (evt)  => {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply a todo name'
    })
  }

  handleInputChange = (evt) =>  {
    this.setState({
      currentTodo: evt.target.value
    });
  }

  render() {
    const submitHandler = this.state.currentTodo.trim() ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <div className="Todo-App">
          <h2 className="Todo-Title">Todo List</h2>
          <TodoList handleToggle={this.handleToggle} todos={displayTodos} 
          handleRemove={this.handleRemove}/>
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          {this.state.message&& <span className='success'>{this.state.message}</span>}
          <TodoForm handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}/>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
