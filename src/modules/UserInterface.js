import Task from './Task.js'
import List from './List.js'
import TodoList from './TodoList.js'
import Storage from './Storage.js'

import { formatDate } from 'date-fns'

export default class UserInterface{
  static currentList = 'All'
  
  static start(){
    
    Storage.onStartup()
    
    UserInterface.loadHome('All')
    UserInterface.loadNormalLists()
    UserInterface.loadTimeBasedLists()
    
    UserInterface.initAddTaskButton()
    UserInterface.initAddListButton()
    UserInterface.initEditListsButton()
    UserInterface.initCancelEditListsButton()
    UserInterface.initSaveChangesButton()
    
    
  }
  
  static loadHome(listName){
    
    const tasksContainer = document.querySelector('#tasks-container');
    
    UserInterface.clearDisplay(tasksContainer)
    UserInterface.makeSectionHead(listName)
    UserInterface.loadTasks(tasksContainer, listName)
    
  }
  
  static makeSectionHead(listName){
    const sectionHeader = document.getElementById('main-header');
    
          sectionHeader.textContent = listName;
  }
  
  static clearDisplay(tasksContainer){
    tasksContainer.innerHTML = ''
  }
  
  static clearFormInput(extention){
    
    for(let i = 0; i <= 4; i++){
      document
      .querySelector(`#task-${extention}`)[i]
      .value = ''
      
      if(i == 3){
        document
        .querySelector(`#task-${extention}`)[i]
        .value = 'No Urgency'
      } else if (i == 4){
        document
        .querySelector(`#task-${extention}`)[i]
        .value = 'None'
      }
      
    }
    
  }
  
  static loadNormalLists(){
    
    const normalLists = document.querySelector('#normal-section');
    
          normalLists.innerHTML = ''
    
    Storage.getTodo()
    .getLists()
    .map((list) => {
      normalLists.appendChild(UserInterface.createListTab(list.name))
    })
  }
  
  static loadTimeBasedLists(){
    const duedateBasedLists = document.querySelector('#duedate-based-section');
    
          duedateBasedLists.innerHTML = ''
    
    let listNames = ['Today', 'This Week', 'Overdue']
    
    for(let list of listNames){
      duedateBasedLists.appendChild(
        UserInterface.createListTab(
          list))
    }
  }
  
  static loadTasks(tasksContainer, listName){
    
    let duedateLists = ['Today', 'This Week', 'Overdue']
    
    if(listName == 'All'){
      
      Storage.getTodo()
      .getLists()
      .map((list) => {
  
        list
        .getTasks()
        .forEach( task => {
        tasksContainer.appendChild(
          UserInterface.buildTask(task))
          
        })
        
      })
      
    } else if(duedateLists.includes(listName) == true){
        
      Storage
      .getTasksDue(listName)
        .map((task) => {
          tasksContainer.appendChild(
            UserInterface.buildTask(task))
        })
        
    } else {
      
      Storage
      .getTodo()
        .getList(listName)
        .getTasks()
          .forEach((task) =>
            tasksContainer.appendChild(
             UserInterface.buildTask(task) ))
    }
    
    UserInterface.checkForEmptyDisplay()
  
  }
  
  static setupNoTasksMessage(){
    const tasksContainer = document.getElementById('tasks-container')
    
    const noTasksMessage = document.createElement('span')
    
          noTasksMessage.setAttribute('class', 'no-tasks-message')
          noTasksMessage.textContent = "Can't display tasks that don't exist"
    
   document
    .getElementById('tasks-container')
    .appendChild(noTasksMessage)
  }
  
  static checkForEmptyDisplay(){
    const tasksContainer = document.querySelector('#tasks-container')
    
    if(!tasksContainer) return
    
    const taskPresent = document.querySelector('#tasks-container #task')
    
    const noTasksMessage = document.querySelector('#tasks-container .no-tasks-message')
    
    if(!taskPresent){
      
      if(!noTasksMessage){
          this.setupNoTasksMessage()
      }
    
    } else {
      if(noTasksMessage){
        noTasksMessage.remove()
      }
    }
    
  }
  
  static createListTab(listName){
    const listsMenu =
    document.getElementById('lists-menu')
    
    if(!listsMenu) return
    
    const tab = document.createElement('span')
          tab.setAttribute('id', 'list-tab')
          
      if(listName == 'None'){
        
        tab.innerHTML = `← Back to Mainpage`;
        UserInterface.openListTab(tab, 'All')
        
      } else {
        tab.innerHTML = `${listName} <span class='list-task-count'> </span> 
        <button class='delete-list' style='display:none'> Delete </button>
        `
        
          if(['Today', 'This Week', 'Overdue'].includes(listName)){
              
              tab
              .querySelector('.list-task-count')
              .textContent = Storage.getTasksDue(listName).length
              
           } else {
              
              tab
              .querySelector('.list-task-count')
              .textContent = Storage.getList(listName).getTasks().length
            }
        
        tab.setAttribute('data-name', listName)
        UserInterface.openListTab(tab, listName)
      }
    
    return tab
  }
  
  static getEditStatus(){
    const listsMenu = document.getElementById('lists-menu')
      
      if(listsMenu.getAttribute('data-status') === 'edit'
      ){
        return true
      } else{
        return false
      }

  }
  
  static openListTab(tab, tabName){
    const main = document.querySelector('main')
      
    const timeTabs = ['Today', 'This Week', 'Overdue']
        
    tab.onclick = () => {
      
    if(!this.getEditStatus()){
      UserInterface.currentList = tabName,
      UserInterface.loadHome(UserInterface.currentList)
      
      if(timeTabs.includes(tabName)){
        main
          .querySelector('#add-task')
            .style.display = 'none'
      } else {
        main
          .querySelector('#add-task')
            .style.display = 'block'
      }
      
    }} 
    
}
  
  static updateTaskCount(){
    const normalLists = document.querySelector('#normal-section')
    
    const duedateBasedLists = document.querySelector('#duedate-based-section')
    
    normalLists
    .childNodes
      .forEach(list => {
        
        if(list.hasAttribute('data-name')){
          
          if(Storage.checkForPreExistingList(list.getAttribute('data-name')))
          
          list
          .querySelector('.list-task-count')
          .textContent = Storage
          .getList(list.getAttribute('data-name'))
          .getTasks().length
          
        }
      })
    
    duedateBasedLists
    .childNodes
      .forEach(list => {
        
          list
          .querySelector('.list-task-count')
          .textContent = Storage
          .getTasksDue(list.getAttribute('data-name'))
          .length
        
      })
    
  }
  
  static buildTask(task){
    const taskDiv = document.createElement('div')
          taskDiv.setAttribute('id', 'task')
          
      taskDiv.innerHTML = (
      ` <div>
      <span id='task-name'>${task.name}</span>
      <span id='task-duedate'>${task.getDate()}</span>
      <span id='task-expand'>+</span>
        </div>
        
        <div>
      <span id='task-details'>${task.details}</span>
      <span id='task-urgency'>${task.urgency}</span>
      <span id='task-list'>${task.list}</span>
      
          <div id='task-buttons'>
            <button id='task-delete-button'>
            Delete
            </button>
            
            <button id='task-edit-button'>
            Edit
            </button>
          </div>
          
        </div>
        
      ` )
     
     const deleteTaskButton = taskDiv.querySelector('#task-delete-button')
     
     deleteTaskButton.onclick = () => {
      UserInterface.deleteTask(taskDiv, task)
      UserInterface.updateTaskCount()
      UserInterface.checkForEmptyDisplay()
     }
     
     const editTaskButton = taskDiv.querySelector('#task-edit-button');
     
     editTaskButton.onclick = () => {
       UserInterface.editTask(taskDiv, task)
       editTaskButton.style.display = 'none'
     }

    
    return taskDiv
  
  }
  
  static deleteTask(taskDiv, task){
    const tasksContainer = document.querySelector('#tasks-container')
  
    Storage.deleteTask(task.list, task.name )
    tasksContainer.removeChild(taskDiv)
  }
  
  static editTask(taskDiv, task){
    UserInterface.createEditTaskPopup(taskDiv)
    UserInterface.openEditTaskPopup()
    UserInterface.saveChanges(taskDiv, task)
  }
  
  static saveChanges(taskDiv, task){
    
    const saveChangesButton = document.querySelector('.popup-save-button')
    
      saveChangesButton.onclick = () => {
        UserInterface.updateTask(
          taskDiv, Storage.updateTask(task, UserInterface.getFormInput('edit-popup')) 
          )
              
        UserInterface.closeEditTaskPopup(
          taskDiv.children[1].children[3])

        
      }
  }
  
  static updateTask(taskDiv, updatedData){
    const newTask = updatedData
    
    taskDiv
    .children[0]
    .children[0].textContent = newTask.name
    
    taskDiv
    .children[1]
    .children[0]
    .textContent = newTask.details
    
    taskDiv
    .children[0]
    .children[1]
    .textContent = newTask.getDate()
    
    taskDiv
    .children[1]
    .children[1]
    .textContent = newTask.urgency
    
    taskDiv
    .children[1]
    .children[2]
    .textContent = newTask.list
  }
  
  static addList(normalLists, listName){
    
    const listsMenu = document.getElementById('lists-menu')
      
    if(Storage.checkForPreExistingList(listName) !== true){
        
        if(listName != ''){

        Storage.addList(listName),
          
          normalLists
          .appendChild(UserInterface.createListTab(listName))
          
        UserInterface.closeNewListPopup()
      
        } else { alert('Try giving your list a name') }
      
    } else alert('I think you already have this list')
  }
  
  static getFormInput(extention){
    const form = document.querySelector(`#task-${extention}`)
    
    let data = {
      name: form[0].value,
      details: form[1].value,
      duedate: form[2].value,
      urgency: form[3].value,
      list: form[4].value
    }
    
    return data 
    
  }
  
  static getListFormInput(){
    const listForm = document.querySelector('#list-form')
  
    return listForm[0].value
  }
  
  static validateData(data){
    if(!Storage.checkForPreExistingTask(
    data.list, data.name)){
      
      if(data.name !== ''){
        
        Storage.addTask(data)
        return true
        
      } else {
        alert('Maybe try giving your task a name?')
      }
      
    } else {
      alert("How about you create a task that doesn't already exist?'") 
    }
  }
  
  static createTask(currentList, content){
    const tasksContainer = document.querySelector('#tasks-container')
    
    const data = UserInterface.getFormInput('form')
    
        if(UserInterface.validateData(data)){
          
          if(currentList == 'All'){
        
          tasksContainer.insertBefore(
           UserInterface.buildTask(
              Storage.getTask(data)), 
            tasksContainer.firstElementChild)
           
        } else if(currentList == content.list && content.list != 'None'){
          
          tasksContainer.insertBefore(
            UserInterface.buildTask(
              Storage.getTask(data)), 
            tasksContainer.firstElementChild)
        }
          
      UserInterface.closeCreateTaskPopup()
      UserInterface.checkForEmptyDisplay()
          
        }
  }
  
  static initAddTaskButton(){
    const main = document.querySelector('main');
    
    const addTaskButton = document.getElementById('add-task');
    
          addTaskButton.setAttribute('id', 'add-task');
          addTaskButton.innerHTML = '+';
          addTaskButton.style.display = 'block'
        
          
      addTaskButton.onclick = () => {
        UserInterface.openCreateTaskPopup()
      
      main
      .querySelector('#add-task')
      .style.display = 'none'
      
      }
          
    
  }
  
  static initAddListButton(){
    const listsMenu = document.getElementById('lists-menu');
    
    const addListButton = document.createElement('button');
    
          addListButton.setAttribute('id', 'add-list');
          addListButton.textContent = '+';
          addListButton.style.display = 'block'
        
        UserInterface.createListForm()
          
      addListButton
      .onclick = () => {
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'none'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'none'
        
        listsMenu
        .setAttribute('data-status', 'edit')
        
        UserInterface.openNewListPopup()
        
      }
      
    document
    .getElementById('lists-menu')
    .appendChild(addListButton)
  }
  
  static initEditListsButton(){
    const listsMenu = document.getElementById('lists-menu')
    
    const editButton = document.createElement('button')
    
          editButton.setAttribute('id', 'edit-lists')
          editButton.textContent = 'Edit'
    
      editButton.onclick = () => {
        
        const list = document.querySelectorAll('#normal-section #list-tab')
        
        UserInterface.editListsMenu()
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'none'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'none'
        
        listsMenu
        .setAttribute('data-status', 'edit')
        
        listsMenu
        .querySelector('#cancel-button')
        .style.display = 'block'
        
        list
        .forEach(list => {
           if(list.hasAttribute('data-name') === true){
           
           list
          .querySelector('.list-task-count')
          .style.display = 'none'
          
          if(list.getAttribute('data-name') !== UserInterface.currentList ){
           list
          .querySelector('.delete-list')
          .style.display = 'block'
           }
           }
        })
      }
    
    document
    .getElementById('lists-menu')
    .appendChild(editButton)
    
  }
  
  static initCancelEditListsButton(){
    const listsMenu = document.getElementById('lists-menu')
    
    
    const cancelButton = document.createElement('button');
          
          cancelButton.setAttribute('id', 'cancel-button');
          cancelButton.textContent = 'Cancel'
          cancelButton.style.display = 'none'
          
      cancelButton
      .onclick = () => {
        
      const list = document.querySelectorAll('#lists-menu #list-tab')
    
       UserInterface.cancelEditListsMenu()
       
       listsMenu
       .querySelector('#edit-lists')
       .style.display = 'block'
       
       listsMenu
      .setAttribute('data-status', 'display')
       
       listsMenu
       .querySelector('#add-list')
       .style.display = 'block'
       
       listsMenu
       .querySelector('#cancel-button')
       .style.display = 'none'
       
       list
        .forEach(list => {
           if(list.hasAttribute('data-name') === true){
           
           list
          .querySelector('.list-task-count')
          .style.display = 'block'
          
           list
          .querySelector('.delete-list')
          .style.display = 'none'
           }
        })
       
      }
    
    document
    .getElementById('lists-menu')
    .appendChild(cancelButton)
  }
  
  static initSaveChangesButton(){
    const listsMenu = document.getElementById('lists-menu');
    
    
    const saveChangesButton = document.createElement('button')
          
          saveChangesButton.setAttribute('id', 'save-changes')
          saveChangesButton.textContent = 'Save Changes'
          saveChangesButton.style.display = 'none'
          
      saveChangesButton
      .onclick = () => {
        
        const list = document.querySelectorAll('#lists-menu #list-tab')
    
        UserInterface.cancelEditListsMenu()
      
        listsMenu
        .querySelector('#add-list')
        .style.display = 'block'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'block'
        
        listsMenu
        .setAttribute('data-status', 'display')
        
        listsMenu
        .querySelector('#save-changes')
        .style.display = 'none'
        
        listsMenu
        .querySelector('#cancel-button')
        .style.display = 'none'
        
        list
        .forEach(list => {
           if(list.hasAttribute('data-name') === true){
           
           list
          .querySelector('.list-task-count')
          .style.display = 'block'
          
           list
          .querySelector('.delete-list')
          .style.display = 'none'
           }
        })
        
      }
      
    document
    .getElementById('lists-menu')
    .appendChild(saveChangesButton)
  }
  
  static createListForm(){
    
    const listsMenu = document.getElementById('lists-menu')
    
    const newListForm = document.createElement('form')
    
          newListForm.setAttribute('id', 'list-form')
          
      newListForm.innerHTML = ( `
      <h2 id='form-header'> New List </h2>
      
      <div>
        <label>Name</label>
        <input type="text" name="list-name" required="true"/>
      </div>
        
      <button type="button" id="create-button">
      Add List
      </button>
      
      <button type="button" id="cancel-button">
      Cancel
      </button>
      
      `)
      
      newListForm
      .querySelector('#create-button')
      .onclick = () => {
        const normalLists = document.querySelector('#normal-section')
        
        UserInterface.addList(
          normalLists,
          UserInterface.getListFormInput())
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'block'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'block'
        
        listsMenu
        .setAttribute('data-status', 'display')
    }
    
      newListForm
      .querySelector('#cancel-button')
      .onclick = () => {
        UserInterface.closeNewListPopup()
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'block'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'block'
        
        listsMenu
        .setAttribute('data-status', 'display')
    }
    
    document
    .getElementById('list-form-popup')
    .appendChild(newListForm)
}

  static createTaskForm(){
    const main = document.querySelector('main')
    
    const newTaskForm = document.createElement('form')
    
          newTaskForm.setAttribute('id', 'task-form')
    
    newTaskForm.innerHTML = ( `
    <h2 id="form-header">New Task</h2>
        
    <div>
      <label>Name</label>
      <input type="text" name="task-name" required="true"/>
    </div>
    
    <div>
      <label>Details</label>
      <input type="text" name="task-details"/>
    </div>
    
    <div>
      <label>Duedate</label>
      <input type="date" name="task-duedate"/>
    </div>
    
    <div>
    
      <label>Urgency</label>
      <select id="urgency-selection"
      name="task-urgency">
      
        <option value='No Urgency' disabled selected> No Urgency (Default)</option>
        
        <option> Low </option>
        
        <option> Medium </option>
        
        <option> High </option>
        
      </select>
      
    </div>
    
    <div>
      <label>List</label>
      <select id="list-selection" name="task-list">
  
      </select>
    </div>
    
    
  <button type="button" id="create-button">
  Add Task
  </button>
  
  <button type="button" id="cancel-button"> Cancel
  </button>
  
    ` )
    
    Storage
    .getLists()
    .forEach((list) => {
      const option = document.createElement('option')
      
            option.textContent = list.name;
            
      newTaskForm
      .querySelector('#list-selection')
      .appendChild(option)
      
    })
    
    newTaskForm
    .querySelector('#cancel-button')
    .onclick = () => {
      UserInterface.closeCreateTaskPopup()
      
      main
      .querySelector('#add-task')
      .style.display = 'block'
    }
    
    newTaskForm
    .querySelector('#create-button')
    .onclick = () => {

      UserInterface.createTask(
        UserInterface.currentList,
        UserInterface.getFormInput('form'))
        
      main
      .querySelector('#add-task')
      .style.display = 'block'
        
    }
    
    document
    .getElementById('task-form-popup')
    .appendChild(newTaskForm)
    
  }
  
  static createEditTaskPopup(taskDiv){
    
    const task = {
      name: taskDiv.children[0].children[0].textContent,
      details: taskDiv.children[1].children[0].textContent,
      duedate: taskDiv.children[0].children[1].textContent,
      urgency: taskDiv.children[1].children[1].textContent,
      list: taskDiv.children[1].children[2].textContent,
    }
    
    
    const popupContainer = document.querySelector('#task-edit-popup');
    
          popupContainer.style.display = 'none'
    
    popupContainer.innerHTML = ( 
    `
    <h2> Edit Task </h2>
    
    <div>
    <label>Name</label>
    <input type='text' class='task-popup-name' value='${task.name}'/> 
    </div>
    
    <div>
    <label>Details</label>
    <input type='text' class='task-popup-details' value='${task.details}'/> 
    </div>
    
    <div>
    <label>Duedate</label>
    <input type='date' class='task-popup-duedate'/> 
    </div>
    
    <div>
    <label>Urgency</label>
    <select class='task-popup-urgency'>
      
      <option> No Urgency </option>
      
      <option> Low </option>
      
      <option> Medium </option>
     
      <option> High </option>
    
    </select> 
    </div>
    
    <div>
    <label>List</label>
    <select class='task-popup-list'>
    
      </select>
    </div>
    
    <button type='button' class='popup-save-button'>
    Save Changes
    </button>
    
    <button type='button' class='popup-cancel-button'>
    Cancel
    </button>
    
    `)
    
    if(task.duedate !== 'No Date'){
      document
      .querySelector('.task-popup-duedate')
      .value = formatDate(task.duedate, 'yyyy-MM-dd')
    }
    
    Storage
    .getLists()
    .forEach((list) => {
      const option = document.createElement('option')
      
            option.textContent = list.name
            
      popupContainer
      .querySelector('.task-popup-list')
      .appendChild(option)
      
    })
    
    popupContainer
      .querySelector('.task-popup-urgency').value = task.urgency;
    
    popupContainer
      .querySelector('.task-popup-list').value = task.list;
    
    popupContainer
      .querySelector('.popup-cancel-button')
        .onclick = () => {
      UserInterface.closeEditTaskPopup(taskDiv)}
  }
  
  static editListsMenu(){
    
    const normalLists = document.getElementById('normal-section');
    
    const listsMenu = document.getElementById('lists-menu');
    
    normalLists
    .childNodes
    .forEach(list => {
      if(list.hasAttribute('data-name')){
        
        list
        .querySelector('.delete-list')
        .onclick = () => {
          Storage.deleteList(list.getAttribute('data-name'))
        
          
       if(Storage.getLists().length < 2){
          listsMenu
          
          .querySelector('#add-list')
          .style.display = 'block';
          
          listsMenu
          .querySelector('#cancel-button')
          .style.display = 'none';
          
          listsMenu
          .querySelector('#save-changes')
          .style.display = 'none';
          
        } else {
          listsMenu
          .querySelector('#save-changes')
          .style.display = 'block'
        }
        
        normalLists
          .removeChild(list)
          
          
          UserInterface.loadTimeBasedLists()
          UserInterface.updateTaskCount()
          
        }
        
      } })
  }
  
  static cancelEditListsMenu(){
    
    const normalLists = document.getElementById('normal-section')
    
    normalLists
    .childNodes
    .forEach(list => {
      if(list.hasAttribute('data-name')){
        
        list
        .querySelector('.list-task-count')
        .textContent = Storage.getList(
          list.getAttribute('data-name'))
          .getTasks().length
        
      }
      
    })
  }
  
  static openNewListPopup(){
    const popup = document.getElementById('list-form-popup')
    
    popup.style.display = 'block'
  }
  
  static closeNewListPopup(){
    
    
    UserInterface.updateTaskCount()
    const popup = document.querySelector('#list-form-popup')
    
    const listNameInput = document.querySelector('#list-form input')
    
    listNameInput.value = ''
    popup.style.display = 'none'


  }
  
  static openCreateTaskPopup(){
   UserInterface.createTaskForm()
    document
    .getElementById('task-form-popup')
    .style.display = 'block';
  }
  
  static closeCreateTaskPopup(){
    UserInterface.updateTaskCount()
    UserInterface.clearFormInput('form')
    document
      .getElementById('task-form-popup')
      .removeChild(
        document.querySelector('#task-form'))
        
    document
      .getElementById('task-form-popup')
      .style.display = 'none'
      
  }
  
  static openEditTaskPopup(){
    return document
      .getElementById('task-edit-popup')
      .style.display = 'block'
  }
  
  static closeEditTaskPopup(taskDiv){
    UserInterface.clearFormInput('edit-popup')
    UserInterface.updateTaskCount()
    document
      .getElementById('task-edit-popup')
      .style.display = 'none'
      
      taskDiv
      .querySelector('#task-edit-button')
      .style.display = 'block'
    
  }
  
}
