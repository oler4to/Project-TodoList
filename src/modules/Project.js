export default class Project {
  constructor(name){
    this.name = name,
    this.tasks = []
  }
  
  setName(projectName){
    this.name = projectName
  }
  
  getName(){
    return this.name
  }
  
  setTasks(projectTasks){
    this.tasks = projectTasks
  }
  
  getTasks(){
    return this.tasks
  }
}