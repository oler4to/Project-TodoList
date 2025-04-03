import Task from './Task.js'
import Project from './Project.js'
import TodoList from './TodoList.js'
import UserInterface from './UserInterface.js'

export default class Storage {
  
  static onStartup(){
    if(localStorage.length == 0) {
    const todo = new TodoList()
    
    todo
    .getProject('None')
    .addTask(
      new Task(
        'This is not an important task',
        'Remember to do nothing!',
        '2025-04-23',
        'Medium',
        'None'
        ))
    
    todo
    .getProject('Personal')
    .addTask(
      new Task(
        'This is a random task',
        'Remember to do some random thing!',
        '2025-04-01',
        'Medium',
        'Personal'
        ))
    
    todo
    .getProject('Personal')
    .addTask(
      new Task(
        'This is another random task',
        'Remember to do some other random things!',
        '2025-04-01',
        'High',
        'Personal'
        ))
    
    todo
    .getProject('Work')
    .addTask(
      new Task(
        'This time its an IMPORTANT task for work',
        'Remember to do some that very important thing for that one person!',
        '2025-05-23',
        'High',
        'Work'
        ))
    
    Storage.updateStorage(todo)
    
  }
  }
  
  static updateStorage(todo){
    localStorage.setItem(
      'todo', JSON.stringify(todo))
  }
  
  static getTodo(){
    
    const todo = Object.assign(
      new TodoList, 
      JSON.parse(localStorage.getItem('todo')))
      
      todo.setProjects(
        todo 
        .getProjects()
        .map((project) => Object.assign(
          new Project, project )))
        
      todo
      .getProjects()
      .map((project) => 
        project.setTasks(
          project
          .getTasks()
          .map((task) => 
            Object.assign(new Task, task ))))
      
    return todo
    
  }
  
  static addTask(task){
    
    const todo = Storage.getTodo();
    
    todo
    .getProject(task.project)
    .addTask(new Task(
      task.name, task.details, task.duedate, task.urgency, task.project))
    
    Storage.updateStorage(todo)
    
    return Storage.getTask(task.project, task.name)

  }
  
  static updateTask(oldTask, newTask){
    const todo = Storage.getTodo()
    
    if(todo.getProject(oldTask.project).getName !== newTask.project){
      
      Storage.deleteTask(
        oldTask.project, oldTask.name);
      Storage.addTask(newTask);
        
    } else {
      
    todo.getProject(oldTask.project).getTask(oldTask.name).setFields(
      newTask.name, newTask.details,
      newTask.duedate, newTask.urgency )
      
    Storage.updateStorage(todo)
      
    }
    
     return Storage.getTask(newTask.project, newTask.name)
  }
  
  static getProject(projectName){
    const project = 
    Storage.getTodo()
    .getProject(projectName);
    
    return project
  }
  
  static getProjects(){
    const todo = Storage.getTodo()
    
    return todo.getProjects()
  }
  
  static deleteProject(projectName){
    const todo = Storage.getTodo();
    
    todo.deleteProject(projectName);
    
    console.log(todo)
    
    Storage.updateStorage(todo)
  }
  
  static addProject(projectName){
    const todo = Storage.getTodo()
    
    todo.addProject(new Project(projectName));
    
    Storage.updateStorage(todo)
    
    return Storage.getProject(projectName)
  }
  
  static getTasksDue(projectName){
    const todo = Storage.getTodo()
    
    if(projectName == 'Today'){
      return todo
      .getAllTasks()
      .getTasksDueToday()
    }
    if(projectName == 'This Week'){
      return todo
      .getAllTasks()
      .getTasksDueThisWeek()
    } 
    
    if(projectName == 'Overdue'){
      return todo
      .getAllTasks()
      .getTasksOverdue() 
    }
  }
  
  static getTask(projectName,taskName){
    const todo = Storage.getTodo();
    
    return todo.getProject(projectName)
    .getTask(taskName)
  }
  
  static deleteTask(projectName, taskName){
    const todo = Storage.getTodo();
    
    todo
    .getProject(projectName)
    .deleteTask(taskName)
    
    Storage.updateStorage(todo)
  }
  
  static checkForPreExistingTask(projectName, taskName){
    const todo = Storage.getTodo()
    
  return todo
    .getProject(projectName)
    .getTasks()
    .some((task) => task.name === taskName)
  }
  
  static checkForPreExistingProject(projectName){
    const todo = Storage.getTodo()
    
    return todo
      .projects
      .some((project) => project.name === projectName)
  }
  
}
