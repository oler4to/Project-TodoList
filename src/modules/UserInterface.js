import Task from './Task.js'
import List from './List.js'
import TodoList from './TodoList.js'
import Storage from './Storage.js'

import { formatDate } from 'date-fns'

export default class UserInterface{
  
  //START
  
  static currentList = 'All'
  
  static start(){
    
    Storage.onStartup()
    
    UserInterface.loadHome('All')
    UserInterface.loadNormalLists()
    UserInterface.loadTimeBasedLists()
    
    UserInterface.initOpenMenuButton()
    UserInterface.initAddTaskButton()
    UserInterface.initAddListButton()
    UserInterface.initEditListsButton()
    UserInterface.initCancelEditListsButton()
    UserInterface.initSaveChangesButton()
    
    
  }
  
  // LOAD, UPDATE AND CHANGE
  static loadHome(listName){
    
    const tasksContainer = document.querySelector('#tasks-container');
    
    if(!tasksContainer) return
    
    tasksContainer.innerHTML = ''
    UserInterface.buildSectionHead(listName)
    UserInterface.loadTasks(tasksContainer, listName)
    
  }
  
  static loadNormalLists(){
    
    const normalLists = document.querySelector('#normal-section');
    
          normalLists.innerHTML = ''
    
    Storage.getTodo()
    .getLists()
    .map((list) => {
      normalLists.appendChild(UserInterface.buildListTab(list.name))
    })
  }
  
  static loadTimeBasedLists(){
    const duedateBasedLists = document.querySelector('#duedate-based-section');
    
          duedateBasedLists.innerHTML = ''
    
    let listNames = ['Today', 'This Week', 'Overdue']
    
    for(let list of listNames){
      duedateBasedLists.appendChild(
        UserInterface.buildListTab(
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
  static updateTask(taskDiv, updatedData){
    const newTask = updatedData
    
    for(let key in newTask){
      console.log(taskDiv)
      
      taskDiv
        .querySelector(`#task-${key}`)
          .textContent = newTask[key]
      if(key == 'duedate' && newTask[key] !== 'No Date'){
        taskDiv
        .querySelector(`#task-${key}`)
          .textContent = formatDate(newTask.duedate, 'd MMMM yyyy')
      }
    }
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
  
  static changeMenuDisplay() {
    const listsMenu = document.querySelector('#lists-menu')
    
    if(!listsMenu) return
    
    if(listsMenu.getAttribute('data-display-status') == 'false'){
        
        listsMenu.style.display = 'flex'
        listsMenu.setAttribute('data-display-status', 'true')
        
      } else {
        listsMenu.style.display = 'none'
        listsMenu.setAttribute('data-display-status', 'false')
      }
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
  
  //VALIDATE
  
  static validateData(data, data2){
    if(!Storage.checkForPreExistingTask(data)){
      
      if(data.name !== ''){
        
        if(data2 === 'new'){
        Storage.addTask(data)
       } else {
         Storage.updateTask(data2, data)
       }
       
        return true
        
      } else {
        alert('Maybe try giving your task a name?')
      }
      
    } else {
      alert("How about you create a task that doesn't already exist?'") 
    }
  }
  
  //BUILD 
  
  static setupNoTasksMessage(){
    const tasksContainer = document.getElementById('tasks-container')
    
    const noTasksMessage = document.createElement('span')
    
          noTasksMessage.setAttribute('class', 'no-tasks-message')
          noTasksMessage.textContent = "Can't display tasks that don't exist"
    
   document
    .getElementById('tasks-container')
    .appendChild(noTasksMessage)
  }
  
  static buildSectionHead(listName){
    const sectionHeader = document.getElementById('main-header');
    
          sectionHeader.textContent = listName;
  }
 
  static buildTask(task){

    const taskDiv = document.createElement('div')
          taskDiv.setAttribute('id', 'task')
          
      taskDiv.innerHTML = (
      ` <div id='task-head'>
      <span id='complete-status'>${String.fromCodePoint(0x2713)}</span>
      <span id='task-name'>${task.name}</span>
      <span id='task-duedate'>${task.getDate()}</span>
      <span id='task-expand'>+</span>
        </div>
        
        <div id='task-more-details'>
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
      
    const moreDetailsSection = taskDiv.querySelector('#task-more-details')
    
    moreDetailsSection
    .style = `height: 0;
    overflow: hidden;`
      
    const expandTask = taskDiv.querySelector('#task-expand')
    
    expandTask.onclick = () => {
      
      if(moreDetailsSection.style.height == "0px"){
       console.log(moreDetailsSection) 
        
      moreDetailsSection
      .style = `height: 100px;
      overflow: hidden;
      transition: height 0.5s`
      } else {
        moreDetailsSection
        .style = `height: 0;
        overflow: hidden;
        transition: height 0.5s`
      }
    }
      
    const changeCompleteStatus = taskDiv.querySelector('#complete-status')
    
    changeCompleteStatus.onclick = () => {
      UserInterface.deleteTask(taskDiv, task)
    }
     
     const deleteTaskButton = taskDiv.querySelector('#task-delete-button')
     
     deleteTaskButton.onclick = () => {
      UserInterface.deleteTask(taskDiv, task)
     }
     
     const editTaskButton = taskDiv.querySelector('#task-edit-button');
     
     editTaskButton.onclick = () => {
       UserInterface.openEditTaskPopup(taskDiv)
     }

    return taskDiv
  
  }
  
  static buildListTab(listName){
    const listsMenu =
    document.getElementById('lists-menu')
    
    if(!listsMenu) return
    
    const tab = document.createElement('span')
          tab.setAttribute('id', 'list-tab')
          
      if(listName == 'None'){
        
        tab.innerHTML = `${String.fromCodePoint(0x2190)} Back to Mainpage`;
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
  
  static buildTaskForm(){
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

      UserInterface.addTask(
        UserInterface.currentList,
        UserInterface.getFormData('form'))
        
      main
      .querySelector('#add-task')
      .style.display = 'block'
        
    }
    
    document
    .getElementById('task-form-popup')
    .appendChild(newTaskForm)
    
  }
  
  static buildListForm(){
    
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
          UserInterface.getListFormData())
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'block'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'block'
        
        listsMenu
        .setAttribute('data-edit-status', 'display')
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
        .setAttribute('data-edit-status', 'display')
    }
    
    document
    .getElementById('list-form-popup')
    .appendChild(newListForm)
}
  
  static buildEditTaskForm(taskDiv){
    
    const oldData = {
      name: taskDiv.querySelector('#task-name').textContent,
      details: taskDiv.querySelector('#task-details').textContent,
      duedate: taskDiv.querySelector('#task-duedate').textContent,
      urgency: taskDiv.querySelector('#task-urgency').textContent,
      list: taskDiv.querySelector('#task-list').textContent,
      
    }
    
    
    const editTaskPopup = document.querySelector('#task-edit-popup')
    
    const editTaskForm = document.createElement('form');
    
          editTaskForm.setAttribute('id', 'task-edit-form')
    
    editTaskForm.innerHTML = ( `<h2> Edit Task </h2>
    
    <div>
      <label>Name</label>
      <input type='text' class='edit-popup-name'/> 
    </div>
    
    <div>
      <label>Details</label>
      <input type='text' class='edit-popup-details'/> 
    </div>
    
    <div>
      <label>Duedate</label>
      <input type='date' class='edit-popup-duedate'/> 
    </div>
    
    <div>
      <label>Urgency</label>
      <select class='edit-popup-urgency'>
        <option> No Urgency </option>
        <option> Low </option>
        <option> Medium </option>
        <option> High </option>
      </select> 
    </div>
    
    <div>
      <label>List</label>
      <select class='edit-popup-list'>
        </select>
    </div>
    
    <button type='button' class='edit-popup-save'> Save Changes </button>
    
    <button type='button' class='edit-popup-cancel'> Cancel </button> ` )
    
    Storage
    .getLists()
    .forEach((list) => {
      const option = document.createElement('option')
      
            option.textContent = list.name
            
      editTaskForm
        .querySelector('.edit-popup-list')
          .appendChild(option)
      
    })
    
    for(let key in oldData){
      editTaskForm
        .querySelector(`.edit-popup-${key}`)
          .value = oldData[key]
      if(key == 'duedate' && oldData[key] !== 'No Date'){
        editTaskForm
        .querySelector(`.edit-popup-${key}`)
          .value = formatDate(oldData.duedate, 'yyyy-MM-dd')
      }
    }
    
    editTaskForm
      .querySelector('.edit-popup-save')
        .onclick = () => {
          UserInterface.saveChanges(taskDiv, oldData)
        }
    
    editTaskForm
      .querySelector('.edit-popup-cancel')
        .onclick = () => {
      UserInterface.closeEditTaskPopup(taskDiv)}
    
    editTaskPopup
    .appendChild(editTaskForm)
  }
  
  //ADD, DELETE, EDIT & SAVE
  
  static addTask(currentList, content){
    const tasksContainer = document.querySelector('#tasks-container')
    
    const data = UserInterface.getFormData('form')
    
    if(!data) return
    
     if(!UserInterface.validateData(data, 'new')) return

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
 
  static addList(normalLists, listName){
      
    if(Storage.checkForPreExistingList(listName) !== true){
        
        if(listName != ''){

        Storage.addList(listName),
          
          normalLists
          .appendChild(UserInterface.buildListTab(listName))
          
        UserInterface.closeNewListPopup()
      
        } else { alert('Try giving your list a name') }
      
    } else alert('I think you already have this list')
  }
  
  static deleteTask(taskDiv, task){
    Storage.deleteTask(task)
    taskDiv.remove()
    
    this.updateTaskCount()
    this.checkForEmptyDisplay()
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
          
          UserInterface.loadHome(UserInterface.currentList)
          
          
        }
        
      } })
  }
  
  static saveChanges(taskDiv, oldData){
    const data = UserInterface.getFormData('edit-form')
    
    if(this.validateData(data, oldData)){
    
    UserInterface.updateTask(
      taskDiv, 
      Storage.getTask(data))
    UserInterface.closeEditTaskPopup(
      taskDiv)
      
    UserInterface.loadHome(UserInterface.currentList)
      
    }
    
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
  
  // GET
  
  static getEditStatus(){
    const listsMenu = document.getElementById('lists-menu')
      
      if(listsMenu.getAttribute('data-edit-status') === 'edit'
      ){
        return true
      } else{
        return false
      }

  }
  
  static getFormData(extention){
    const form = document.querySelector(`#task-${extention}`)
    
    if(!form) return
    
      let data = {
        name: form[0].value,
        details: form[1].value,
        duedate: form[2].value,
        urgency: form[3].value,
        list: form[4].value
      }
      
      return data 
    
  }
  
  static getListFormData(){
    const listForm = document.querySelector('#list-form')
    
    if(!listForm) return
  
      return listForm[0].value
  }
  
 
  //OPEN AND CLOSE
  
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
  
  static openNewListPopup(){
    const popup = document.getElementById('list-form-popup')
    
    const listForm = document.querySelector('#list-form')
    
    if(!listForm)
    UserInterface.buildListForm()
    popup.style.display = 'block'
    
  }
  
  static closeNewListPopup(){
    
    const popup = document.querySelector('#list-form-popup')
    
    const listForm = document.querySelector('#list-form')
    
    if(listForm)
    listForm.remove()
    popup.style.display = 'none'
    
    UserInterface.updateTaskCount()


  }
  
  static openCreateTaskPopup(){
   UserInterface.buildTaskForm()
    document
    .getElementById('task-form-popup')
    .style.display = 'block';
  }
  
  static closeCreateTaskPopup(){
    const taskFormPopup = document.querySelector('#task-form-popup')
    
    const taskForm = document.querySelector('#task-form')
    
    if(taskForm)
    taskForm.remove()
    taskFormPopup.style.display = ''
      
    UserInterface.updateTaskCount()
  }
  
  static openEditTaskPopup(taskDiv){
    const addTaskButton = document.querySelector('main #add-task')
    
    const editTaskPopup = document.querySelector('#task-edit-popup')
    
    const editTaskForm = document.querySelector('#task-edit-form')
    
    if(!editTaskForm){
      UserInterface.buildEditTaskForm(taskDiv)
      addTaskButton.style.display = 'none'
    } else {
      editTaskForm.remove()
      addTaskButton.style.display = 'block'
    }
    
    editTaskPopup.style.display = 'block'
  }
  
  static closeEditTaskPopup(taskDiv){
    
    const editTaskPopup = document.querySelector('#task-edit-popup')
    
    const editTaskForm = document.querySelector('#task-edit-form')
    
    const editTaskButton = taskDiv.querySelector('#task-edit-button')
    
    if(!editTaskForm) return
    
    editTaskForm.remove()
    editTaskPopup.style.display = 'none'
    editTaskButton.style.display = 'block'
    
    UserInterface.updateTaskCount()
    
  }
  
  // INIT BUTTONS
  
  static initOpenMenuButton(){
    const openMenu = document.querySelector('header #open-menu')
    
    if(!openMenu) return
    
    openMenu.onclick = () => {
        UserInterface.changeMenuDisplay()
    }
    
  }
  
  static initAddTaskButton(){
    const main = document.querySelector('main');
    
    const addTaskButton = document.getElementById('add-task');
    
    if(!addTaskButton) return
    
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
        
        UserInterface.buildListForm()
          
      addListButton
      .onclick = () => {
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'none'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'none'
        
        listsMenu
        .setAttribute('data-edit-status', 'edit')
        
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
        
        if(!list) return
        
        UserInterface.editListsMenu()
        
        listsMenu
        .querySelector('#add-list')
        .style.display = 'none'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'none'
        
        listsMenu
        .setAttribute('data-edit-status', 'edit')
        
        listsMenu
        .querySelector('#cancel-button')
        .style.display = 'block'
        
        list
        .forEach(list => {
           if(list.hasAttribute('data-name')){
           
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
      
      if(!list) return
    
       UserInterface.cancelEditListsMenu()
       
       listsMenu
       .querySelector('#edit-lists')
       .style.display = 'block'
       
       listsMenu
      .setAttribute('data-edit-status', 'display')
       
       listsMenu
       .querySelector('#add-list')
       .style.display = 'block'
       
       listsMenu
       .querySelector('#cancel-button')
       .style.display = 'none'
       
       list
        .forEach(list => {
           if(list.hasAttribute('data-name')){
           
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
        
        if(!list) return
    
        UserInterface.cancelEditListsMenu()
      
        listsMenu
        .querySelector('#add-list')
        .style.display = 'block'
        
        listsMenu
        .querySelector('#edit-lists')
        .style.display = 'block'
        
        listsMenu
        .setAttribute('data-edit-status', 'display')
        
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
  
}
