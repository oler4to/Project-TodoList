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
  
  getTask(taskName){
    return this.tasks.find((task) => 
    task.name === taskName)
  }
  
  addTask(t){
    if(this.tasks.every((task) => task.name != t.name)){
      this.tasks.push(t)
    }
  }
  
  deleteTask(tName){
    this.setTasks(this.tasks.filter((task) => task.name !== tName))
  }
}