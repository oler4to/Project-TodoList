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
  
  addTask(t){
    if(this.tasks.every((task) => task.name != t.name)){
      this.tasks.push(t)
    } else{
      console.log('Task already exist.')
    }
  }
  
  deleteTask(tName){
    this.setTasks(this.tasks.filter((task) => task.name !== tName))
  }
}