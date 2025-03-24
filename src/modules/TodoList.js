import Project from './Project.js'

export default class TodoList{
  constructor(){
    this.projects = [],
    this.projects.push(new Project('Personal')),
    this.projects.push(new Project('Work'))
  }
  
  addProject(project){
    if(this.projects.every((p) => p.name !== project.name))
    this.projects.push(project)
    else console.log('Project already exists!')
  }
  
  getProjects(){
    return this.projects
  }
  
  getProject(projectName){
    return this.projects.find((p) => p.name === projectName)
  }
}