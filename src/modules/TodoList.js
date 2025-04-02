import Project from './Project.js'

export default class TodoList{
  
  constructor(){
    this.projects = [],
    this.projects.push(new Project('None')),
    this.projects.push(new Project('Personal')),
    this.projects.push(new Project('Work'))
    
  }
  
  setProjects(projects){
    this.projects = projects
  }
  
  addProject(project){
    if(this.projects.every((p) => p.name !== project.name)){
    this.projects.push(project)
    }
  }
  
  deleteProject(projectName){
    this.projects = this.projects.filter((project) => project.name !==
    projectName)
  }
  
  getProjects(){
    return this.projects
  }
  
  getProject(projectName){
    return this.projects.find((p) => p.name === projectName)
  }
  
  getAllTasks(){
    const allTasks = new Project('All Tasks')
    
    this.projects.map(
      project => { for( let task of project.tasks){
        allTasks.tasks.push(task)
      } })
    
    return allTasks
  }
}