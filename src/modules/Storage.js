import Task from './Task.js'
import Project from './Project.js'
import TodoList from './TodoList.js'

export default class Storage {
  onStartup(){
    if(localStorage.length < 1) {
    const todo = new TodoList()
    
    todo
    .getProject('Personal')
    .addTask(
      new Task(
        'This is a random task',
        'Remember to do some random thing!',
        '25/03/2025',
        'Medium',
        'Personal'
        ))
    
    todo
    .getProject('Personal')
    .addTask(
      new Task(
        'This is another random task',
        'Remember to do some other random things!',
        '26/03/2025',
        'High',
        'Personal'
        ))
    
    todo
    .getProject('Work')
    .addTask(
      new Task(
        'This time its an IMPORTANT task for work',
        'Remember to do some that very important thing for that one person!',
        '29/03/2025',
        'High',
        'Work'
        ))
    
    localStorage.setItem('todo', JSON.stringify(todo))
    } else console.log('already done!')
    
  }
  
  saveToStorage(todo){
    localStorage.setItem('todo', todo)
  }
  
  setupTodo(){
    const todo = Object.assign(
      new TodoList, 
      JSON.parse(localStorage.getItem('todo')))
      
      todo.setProjects(
        todo 
        .getProjects()
        .map((project) => Object.assign(new Project, project)))
        
      todo
      .getProjects()
      .map((project) => 
        project.setTasks(
          project
          .getTasks()
          .map((task) =>
            Object.assign(new Task, task)
            )
          )
        )
      
  return todo
  }
  
}
