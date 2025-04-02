import {isWithinInterval, isToday, subHours, isBefore, addDays} from 'date-fns'
import Storage from './Storage.js'


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
    return this.tasks.find(task => 
    task.name == taskName)
  }
  
  addTask(task){
    if(this.tasks.every((t) => t.name !== task.name)){
      this.tasks.push(task)
    }
  }
  
  deleteTask(tName){
   this.tasks = this.tasks.filter(task => task.name != tName)
  }
  
  getTasksDueToday(){
    return this.tasks.filter( task => {
      const taskDate = subHours(new Date(task.duedate), 2);
      return isToday(taskDate) == true
      })
  }
  
  getTasksDueThisWeek(){
    return this.tasks.filter( task => {
      
      const taskDate = subHours(new Date(task.duedate), 2);
      
      const currentDate = 
      `${new Date().getFullYear()}-
      ${new Date().getMonth() + 1}-
      ${new Date().getDate()}`
      
      return isWithinInterval(taskDate, {
        start: currentDate,
        end: addDays(currentDate, 6)
      }) == true
      })
  }
  
  getTasksOverdue(){
    return this.tasks.filter( task => {
      const taskDate = subHours(new Date(task.duedate), 2);
      
      const currentDate = 
      `${new Date().getFullYear()}-
      ${new Date().getMonth() + 1}-
      ${new Date().getDate()}`
      
      return isBefore(taskDate, currentDate) == true
      })
  }
  
}