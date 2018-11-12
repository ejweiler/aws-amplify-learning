import React, { Component } from 'react';
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator, S3Album } from 'aws-amplify-react'
import aws_exports from './aws-exports'
import './App.css';

Amplify.configure(aws_exports)
Storage.configure({ level: 'private' })

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`

class App extends Component {
  uploadFile = (evt) => {
    const file = evt.target.files[0]
    const name = file.name
    Storage.put(name, file).then(() => {
      this.setState({ file: name })
    })
  }
  componentDidMount() {
    Analytics.record('Amplify_CLI')
  }
  todoMutation = async () => {
    const todoDetails = {
      name: 'Party tonight!',
      description: 'Amplify CLI rocks!'
    };
    
    const newEvent = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newEvent));
  }

  listQuery = async () => {
    console.log('listing todos');
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  }

  post = async () => {
    console.log('calling api');
    const response = await API.post('myitems', '/items', {
      body: {
        id: '1',
        name: 'hello amplify!'
      }
    });
    alert(JSON.stringify(response, null, 2));
  }
  get = async () => {
    console.log('calling api');
    const response = await API.get('myitems', '/items/object/1');
    alert(JSON.stringify(response, null, 2));
  }
  list = async () => {
    console.log('calling api');
    const response = await API.get('myitems', '/items/1');
    alert(JSON.stringify(response, null, 2));
  }

  render() {
    return (
      <div className="App">
        <p>Pick a file</p>
        <input type="file" onChange={this.uploadFile} />
        <button onClick={this.listQuery}>GraphQL Query</button>
        <button onClick={this.todoMutation}>GraphQL Mutation</button>
        <button onClick={this.post}>POST</button>
        <button onClick={this.get}>GET</button>
        <button onClick={this.list}>LIST</button>
        
        <S3Album level="private" path='' />
      </div>
    );
  }
}

export default withAuthenticator(App, true);
