import Task from './Task.js'
import Project from './Project.js'
import TodoList from './TodoList.js'
import Storage from './Storage.js'

export default class UserInterface{
  static sendFormData(form){
    if(form[0].value !== "")
   return Storage.addTask(
      form[4].value,
      form[0].value,
      form[1].value,
      form[2].value,
      form[3].value,
      )
  }
  
  static createTask(output,form){
    
    const project = Storage.getProject(form[4].value,);
    
    const task = 
    Storage.getTask(
      project,
      form[0].value,
      form[1].value,
      )
    
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
            
        div.appendChild(UserInterface.deleteTaskButton(project, task))
    
    output.appendChild(div)
  }
  
  static createTaskField(fieldValue, fieldID){
    const span = document.createElement('span')
          span.setAttribute('id', fieldID)
          span.textContent = fieldValue
          
      return span
  }
  
  static deleteTaskButton(project, task){
    const deleteButton = document.createElement('button')
          deleteButton.setAttribute('id', 'task-delete-button')
          deleteButton.textContent = 'delete'
          deleteButton.onclick = () => {
            Storage.deleteTask(project.name, task.name)
          }
          
      return deleteButton
  }
}