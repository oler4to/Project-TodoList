import Project from './Project.js'

export default class TodoList{
  constructor(){
    this.projects = [],
    this.projects.push(new Project('Personal')),
    this.projects.push(new Project('Work'))
  }
  
  setProjects(projects){
    this.projects = projects
  }
  
  addProject(project){
    if(this.projects.every((p) => p.name !== project.name))
    this.projects.push(project)
    else console.log('Project already exists!')
  }
  
  deleteProject(projectName){
    this.setProjects(this.projects.filter((project) => project.name !==
    projectName))
  }
  
  getProjects(){
    return this.projects
  }
  
  getProject(projectName){
    return this.projects.find((p) => p.name === projectName)
  }
}