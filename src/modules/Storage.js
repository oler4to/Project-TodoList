import Task from './Task.js'
import List from './List.js'
import TodoList from './TodoList.js'
import UserInterface from './UserInterface.js'

export default class Storage {
  
  static onStartup(){
    if(localStorage.length == 0) {
    const todo = new TodoList()
    
    todo
    .getList('None')
    .addTask(
      new Task(
        'This is not an important task',
        'Remember to do nothing!',
        '2025-04-23',
        'Medium',
        'None'
        ))
    
    todo
    .getList('Personal')
    .addTask(
      new Task(
        'This is a random task',
        'Remember to do some random thing!',
        '2025-04-01',
        'Medium',
        'Personal'
        ))
    
    todo
    .getList('Personal')
    .addTask(
      new Task(
        'This is another random task',
        'Remember to do some other random things!',
        '2025-04-01',
        'High',
        'Personal'
        ))
    
    todo
    .getList('Work')
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
      
      todo.setLists(
        todo 
        .getLists()
        .map((list) => Object.assign(
          new List, list )))
        
      todo
      .getLists()
      .map((list) => 
        list.setTasks(
          list
          .getTasks()
          .map((task) => 
            Object.assign(new Task, task ))))
      
    return todo
    
  }
  
  static addTask(task){
    
    const todo = Storage.getTodo();
    
    todo
    .getList(task.list)
    .addTask(new Task(
      task.name, task.details, task.duedate, task.urgency, task.list))
    
    Storage.updateStorage(todo)
    

  }
  
  static updateTask(oldTask, newTask){
    const todo = Storage.getTodo()
    
    if(todo.getList(oldTask.list).getName !== newTask.list){
      
      Storage.deleteTask(
        oldTask.list, oldTask.name);
      Storage.addTask(newTask);
        
    } else {
      
    todo.getList(oldTask.list).getTask(oldTask).setFields(
      newTask.name, newTask.details,
      newTask.duedate, newTask.urgency )
      
    Storage.updateStorage(todo)
      
    }
    
  }
  
  static getList(listName){
    const list = 
    Storage.getTodo()
    .getList(listName);
    
    return list
  }
  
  static getLists(){
    const todo = Storage.getTodo()
    
    return todo.getLists()
  }
  
  static deleteList(listName){
    const todo = Storage.getTodo();
    
    todo.deleteList(listName);
    
    console.log(todo)
    
    Storage.updateStorage(todo)
  }
  
  static addList(listName){
    const todo = Storage.getTodo()
    
    todo.addList(new List(listName));
    
    Storage.updateStorage(todo)
    
    return Storage.getList(listName)
  }
  
  static getTasksDue(listName){
    const todo = Storage.getTodo()
    
    if(listName == 'Today'){
      return todo
      .getAllTasks()
      .getTasksDueToday()
    }
    if(listName == 'This Week'){
      return todo
      .getAllTasks()
      .getTasksDueThisWeek()
    } 
    
    if(listName == 'Overdue'){
      return todo
      .getAllTasks()
      .getTasksOverdue() 
    }
  }
  
  static getTask(task){
    const todo = Storage.getTodo();
    
    return todo.getList(task.list)
    .getTask(task.name)
  }
  
  static deleteTask(listName, taskName){
    const todo = Storage.getTodo();
    
    todo
    .getList(listName)
    .deleteTask(taskName)
    
    Storage.updateStorage(todo)
  }
  
  static checkForPreExistingTask(listName, taskName){
    const todo = Storage.getTodo()
    
  return todo
    .getList(listName)
    .getTasks()
    .some((task) => task.name === taskName)
  }
  
  static checkForPreExistingList(listName){
    const todo = Storage.getTodo()
    
    return todo
      .lists
      .some((list) => list.name === listName)
  }
  
}
