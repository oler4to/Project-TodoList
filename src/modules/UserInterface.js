import Task from './Task.js'
import Project from './Project.js'
import TodoList from './TodoList.js'
import Storage from './Storage.js'

export default class UserInterface{
  
  static onStartup(mainSection, projectMenu){
    
    Storage.onStartup()
    
    UserInterface.loadHome('Home')
    UserInterface.loadProjects()
    UserInterface.loadAllTasks()
    
  }
  
  static loadHome(projectName){
    
    const mainDisplay = document.querySelector('#output');
    
    mainDisplay.innerHTML = '';
    
    const sectionHeader = document.createElement('h1');
    
          sectionHeader.textContent = projectName;
          sectionHeader.setAttribute('id', 'section-header')
          
      mainDisplay.appendChild(sectionHeader)
    
  }
  
  static loadProjects(){
    const projectMenu = document.querySelector('#projects-menu')
    
    Storage.setupTodo()
    .getProjects()
    .map((project) => UserInterface.createProject(projectMenu, project.name)
    )
    
  }
  
  static loadAllTasks(){
    
    const mainDisplay = document.querySelector('#output');
    
   Storage.setupTodo()
    .getProjects()
    .map((project) => project.getTasks()
     .forEach((task) =>
        UserInterface.createTask(
         mainDisplay, 
         task.project,
         task.name,
         task.details ) 
      ))
      
      if(mainDisplay.children.length < 2){
        mainDisplay.innerHTML += 
        ` <span> No Tasks Here </span> `
      }
    
  }
  
  static loadTasks(projectName){
    
    const mainDisplay = document.querySelector('#output')
    
    Storage.setupTodo()
      .getProject(projectName)
      .getTasks().forEach((task) =>
         UserInterface.createTask(
           mainDisplay, task.project, 
           task.name, task.details
          ))
          
      if(mainDisplay.children.length < 2){
        mainDisplay.innerHTML += 
        ` <span> No Tasks Here </span> `
      }
    
  }
  
  static sendFormData(form){
    if(Storage.checkForPreExistingTask(form[4].value, form[0].value)
    !== true){
      
    Storage.addTask(
      form[4].value,
      form[0].value,
      form[1].value,
      form[2].value,
      form[3].value,
      )
      
  } else { return false }
  
  }
  
  static createProject(output, projectName){
    
    const div = document.createElement('span');
    
          div.setAttribute('id', 'project-tab')
          div.textContent = projectName;
          div.onclick = () =>{
            UserInterface.loadHome(projectName)
            UserInterface.loadTasks(projectName)
          }
          
    output.appendChild(div)
    
  }
  
  static createTask(output, projectName, taskName, taskDetails){
    
    const project = Storage.getProject(projectName);
      
    const task = Storage.getTask(projectName, taskName)
    
    const div = document.createElement('div')
    
          div.setAttribute('id', 'task')
          
          div.appendChild(
            UserInterface.createTaskField(
              task.name, 'task-name'))
            
          div.appendChild(
            UserInterface.createTaskField(
              task.details, 'task-details'))
            
          div.appendChild(
            UserInterface.createTaskField(
              task.duedate, 'task-duedate'))
            
          div.appendChild(
            UserInterface.createTaskField(
              task.urgency, 'task-urgency'))
            
          div.appendChild(
            UserInterface.createTaskField(
              task.project, 'task-project'))
              
          div.appendChild(
            UserInterface.deleteTaskButton(project, task))
    
    output.appendChild(div)
    
  }
  
  static createTaskField(fieldValue, fieldID){
    
    const span = document.createElement('span');
    
          span.setAttribute('id', fieldID);
          span.textContent = fieldValue;
          
    return span
    
  }
  
  static deleteTaskButton(project, task){
    
    const mainDisplay = document.querySelector('#output')
    
    const deleteButton = document.createElement('button')
    
          deleteButton.setAttribute('id', 'task-delete-button')
          deleteButton.textContent = 'delete'
          deleteButton.onclick = () => {
          Storage.deleteTask(
            project.name,
            task.name ),
            mainDisplay.removeChild(deleteButton.parentElement)
  
          }
    return deleteButton
    
  }
  
}