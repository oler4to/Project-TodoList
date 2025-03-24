import Project from './Project.js'

export default class TodoList{
  constructor(){
    this.projects = [],
    this.projects.push(new Project('Personal')),
    this.projects.push(new Project('Work'))
  }
}