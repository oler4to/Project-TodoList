import Task from './Task.js'
import Project from './Project.js'
import TodoList from './TodoList.js'
import Storage from './Storage.js'

import { formatDate } from 'date-fns'

export default class UserInterface{
  static currentProject = 'All'
  
  static start(){
    
    Storage.onStartup()
    UserInterface.loadHome('All')
    UserInterface.loadNormalProjects()
    UserInterface.loadTimeBasedProjects()
    UserInterface.initAddTaskButton()
    UserInterface.initAddProjectButton()
    UserInterface.initEditProjectsButton()
    UserInterface.initCancelEditProjectsButton()
    UserInterface.initSaveChangesButton()
    
  }
  
  static loadHome(projectName){
    
    const tasksContainer = document.querySelector('#tasks-container');
    
    UserInterface.clearDisplay(tasksContainer)
    UserInterface.sectionHeader(projectName)
    UserInterface.loadTasks(tasksContainer, projectName)
    
  }
  
  static sectionHeader(projectName){
    const sectionHeader = document.getElementById('main-header');
    
          sectionHeader.textContent = projectName;
  }
  
  static clearDisplay(tasksContainer){
    tasksContainer.innerHTML = ''
  }
  
  static clearFormInput(ext){
    document
    .querySelector(`#task-${ext}`)[0].value = '';
    
    document
    .querySelector(`#task-${ext}`)[1].value = '';
    
    document
    .querySelector(`#task-${ext}`)[2].value = '';
    
    document
    .querySelector(`#task-${ext}`)[3].value = 'No Urgency';
    
    document
    .querySelector(`#task-${ext}`)[4].value = 'None';
    
  }
  
  static loadNormalProjects(){
    
    const normalProjects = document.querySelector('#normal-section');
    
          normalProjects.innerHTML = ''
    
    Storage.getTodo()
    .getProjects()
    .map((project) => {
      normalProjects.appendChild(UserInterface.createProjectTab(project.name))
    })
  }
  
  static loadTimeBasedProjects(){
    const timeBasedProjects = document.querySelector('#time-based-section');
    
          timeBasedProjects.innerHTML = ''
    
    let projectNames = ['Today', 'This Week', 'Overdue']
    
    for(let project of projectNames){
      timeBasedProjects.appendChild(
        UserInterface.createProjectTab(
          project))
    }
  }
  
  static loadTasks(tasksContainer, projectName){
    
    if(projectName == 'All'){
      
      Storage.getTodo()
      .getProjects()
      .map((project) =>{
  
        project
        .getTasks()
        .forEach( task => {
        tasksContainer.appendChild(
          UserInterface.createDOMTask(task))
          
        })
        
      })
      
    } else if(
      (projectName == 'Today') || 
      (projectName =='This Week') ||
      (projectName =='Overdue')){
        
      Storage
      .getTasksDue(projectName)
        .map((task) => {
          tasksContainer.appendChild(
            UserInterface.createDOMTask(task))
        })
        
    } else {
      
    Storage
    .getTodo()
      .getProject(projectName)
      .getTasks()
        .forEach((task) =>
          tasksContainer.appendChild(
           UserInterface.createDOMTask(task) ))
    }
    
    UserInterface.checkForEmptyDisplay()
  }
  
  static checkForEmptyDisplay(){
    const tasksContainer = document.querySelector('#tasks-container')
    
    if(tasksContainer.children.length < 1){
        tasksContainer.innerHTML += 
        ` <span> No Tasks Here </span> `
      }
  }
  
  static addNewTask(tasksContainer, data){
    
    if(Storage.checkForPreExistingTask(
    data.project, data.name) !== true){
      
      if(data.name !== ''){
        
      
      tasksContainer.insertBefore(
       UserInterface.createDOMTask(
        Storage.addTask(data)), 
        tasksContainer.firstElementChild)
      
      UserInterface.closeCreateTaskPopup()
      UserInterface.checkForEmptyDisplay()
      
      } else {
        alert('Maybe try giving your task a name?')
        
      }
    
    } else {
      alert("How about you create a task that doesn't already exist?'") 
    }
    
  }
  
  static createProjectTab(projectName){
    const projectsMenu =
    document.getElementById('projects-menu')
    
    const div = document.createElement('span');
          div.setAttribute('id', 'project-tab')
          
    if(projectName == 'None'){
      
      div.innerHTML = `← Back to Mainpage`;
      UserInterface.openProjectTab(div, 'All')
      
    } else {
      div.innerHTML = 
      `${projectName}
      <span class='project-task-count'>
      </span> 
      <button class='delete-project' style='display:none'>
      Delete
      </button>
      `
      
      div.setAttribute('data-name', projectName)
      
        if(
          (projectName == 'Today')||
          (projectName =='This Week')|| 
          (projectName =='Overdue')
          ){
            
            div
            .querySelector('.project-task-count')
            .textContent = Storage.getTasksDue(projectName).length
            
         } else {
            
            div
            .querySelector('.project-task-count')
            .textContent = Storage.getProject(projectName).getTasks().length
          }
      
      UserInterface.openProjectTab(div, projectName)
    }
    
    return div
  }
  
  static editStatus(){
    const projectsMenu = document.getElementById('projects-menu')
    
    const edit = document.HTMLButtonElement
      
      if(projectsMenu.getAttribute('data-status') !== 'edit'
      ){
        return true
      } else{
        return false
      }

  }
  
  static openProjectTab(tab, tabName){
    
    const main = document.querySelector('main')
      
    const timeTabs = ['Today', 'This Week', 'Overdue']
      
    if (timeTabs.includes(tabName) == true){
        
    tab.onclick = () => {
    if(UserInterface.editStatus() !== false){
            UserInterface.currentProject = tabName,
            UserInterface.loadHome(
              UserInterface.currentProject)
            main
            .querySelector('#add-task')
            .style.display = 'none'
       }
      
    }
      
    } else {
      
      tab.onclick = () => {
      if(UserInterface.editStatus() !== false){
        
        UserInterface.currentProject = tabName,
        UserInterface.loadHome(
          UserInterface.currentProject)
          
        main
        .querySelector('#add-task')
        .style.display = 'block'
      }
      
    }
  } 
    
}
  
  static updateTaskCount(){
    const normalProjects = document.querySelector('#normal-section')
    
    const timeBasedProjects = document.querySelector('#time-based-section')
    
    normalProjects
    .childNodes
      .forEach(project => {
        
        if(project.hasAttribute('data-name') == true){
          
          if(Storage.checkForPreExistingProject(project.getAttribute('data-name'))
          !== false)
          
          project
          .querySelector('.project-task-count')
          .textContent = Storage
          .getProject(project.getAttribute('data-name'))
          .getTasks().length
          
        }
      })
    
    timeBasedProjects
    .childNodes
      .forEach(project => {
        
          project
          .querySelector('.project-task-count')
          .textContent = Storage
          .getTasksDue(project.getAttribute('data-name'))
          .length
        
      })
    
  }
  
  static createDOMTask(t){
    const task = 
      Storage.getTask(t.project, t.name)
    
    const div = document.createElement('div')
    
          div.setAttribute('id', 'task')
          
      div.innerHTML = (
      ` <div>
      <span id='task-name'>${task.name}</span>
      <span id='task-duedate'>${task.getDate()}</span>
      <span id='task-expand'>+</span>
        </div>
        
        <div>
      <span id='task-details'>${task.details}</span>
      <span id='task-urgency'>${task.urgency}</span>
      <span id='task-project'>${task.project}</span>
      
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
     
     const deleteTaskButton = div.querySelector('#task-delete-button')
     
     deleteTaskButton.onclick = () => {
       UserInterface.deleteTask(
         task, div),
        UserInterface.updateTaskCount()
     }
     
     const editTaskButton = div.querySelector('#task-edit-button');
     
     editTaskButton.onclick = () => {
       UserInterface.editTask(div, task)
       editTaskButton.style.display = 'none'
     }

    
    return div
  
  }
  
  static deleteTask(task, taskDiv){
    const tasksContainer = document.querySelector('#tasks-container')
  
    Storage.deleteTask(task.project, task.name )
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
    .textContent = newTask.project
  }
  
  static addProject(normalProjects, projectName){
    
    const projectsMenu = document.getElementById('projects-menu')
      
    if(Storage.checkForPreExistingProject(projectName) !== true){
        
        if(projectName != ''){

        Storage.addProject(projectName),
          
          normalProjects
          .appendChild(UserInterface.createProjectTab(projectName))
          
        UserInterface.closeNewProjectPopup()
      
        } else { alert('Try giving your project a name') }
      
    } else alert('I think you already have this project')
  }
  
  static getFormInput(ext){
    const form = document.querySelector(`#task-${ext}`)
    
    let data = {
      name: form[0].value,
      details: form[1].value,
      duedate: form[2].value,
      urgency: form[3].value,
      project: form[4].value
    }
    
    return data 
    
  }
  
  static getProjectFormInput(){
    const projectForm = document.querySelector('#project-form')
  
    return projectForm[0].value
  }
  
  static createTask(currentProject, content){
    
    const tasksContainer = document.querySelector('#tasks-container')
    
    if(currentProject == 'All'){
      
      UserInterface.addNewTask(
        tasksContainer, content)
         
    } else if(currentProject == content.project && content.project != 'None'){
      
        UserInterface.addNewTask(
          tasksContainer, content)
    } else {
      Storage.addTask(content)
    }
    
  }
  
  static initAddTaskButton(){
    const addTaskButton = document.getElementById('add-task');
    
          addTaskButton.setAttribute('id', 'add-task');
          addTaskButton.innerHTML = '+';
          addTaskButton.style.display = 'block'
        
          
      addTaskButton.onclick = () => {
        UserInterface.openCreateTaskPopup()
      
      }
          
    
  }
  
  static initAddProjectButton(){
    const projectsMenu = document.getElementById('projects-menu');
    
    const addProjectButton = document.createElement('button');
    
          addProjectButton.setAttribute('id', 'add-project');
          addProjectButton.textContent = '+';
          addProjectButton.style.display = 'block'
        
        UserInterface.createProjectForm()
          
      addProjectButton
      .onclick = () => {
        
        projectsMenu
        .querySelector('#add-project')
        .style.display = 'none'
        
        projectsMenu
        .querySelector('#edit-projects')
        .style.display = 'none'
        
        projectsMenu
        .setAttribute('data-status', 'edit')
        
        UserInterface.openNewProjectPopup()
        
      }
      
    document
    .getElementById('projects-menu')
    .appendChild(addProjectButton)
  }
  
  static initEditProjectsButton(){
    const projectsMenu = document.getElementById('projects-menu')
    
    const editButton = document.createElement('button')
    
          editButton.setAttribute('id', 'edit-projects')
          editButton.textContent = 'Edit'
    
      editButton.onclick = () => {
        
        const project = document.querySelectorAll('#normal-section #project-tab')
        
        UserInterface.editProjectsMenu()
        
        projectsMenu
        .querySelector('#add-project')
        .style.display = 'none'
        
        projectsMenu
        .querySelector('#edit-projects')
        .style.display = 'none'
        
        projectsMenu
        .setAttribute('data-status', 'edit')
        
        projectsMenu
        .querySelector('#cancel-button')
        .style.display = 'block'
        
        project
        .forEach(project => {
           if(project.hasAttribute('data-name') === true){
           
           project
          .querySelector('.project-task-count')
          .style.display = 'none'
          
          if(project.getAttribute('data-name') !== UserInterface.currentProject ){
           project
          .querySelector('.delete-project')
          .style.display = 'block'
           }
           }
        })
      }
    
    document
    .getElementById('projects-menu')
    .appendChild(editButton)
    
  }
  
  static initCancelEditProjectsButton(){
    const projectsMenu = document.getElementById('projects-menu')
    
    
    const cancelButton = document.createElement('button');
          
          cancelButton.setAttribute('id', 'cancel-button');
          cancelButton.textContent = 'Cancel'
          cancelButton.style.display = 'none'
          
      cancelButton
      .onclick = () => {
        
      const project = document.querySelectorAll('#projects-menu #project-tab')
    
       UserInterface.cancelEditProjectsMenu()
       
       projectsMenu
       .querySelector('#edit-projects')
       .style.display = 'block'
       
       projectsMenu
      .setAttribute('data-status', 'display')
       
       projectsMenu
       .querySelector('#add-project')
       .style.display = 'block'
       
       projectsMenu
       .querySelector('#cancel-button')
       .style.display = 'none'
       
       project
        .forEach(project => {
           if(project.hasAttribute('data-name') === true){
           
           project
          .querySelector('.project-task-count')
          .style.display = 'block'
          
           project
          .querySelector('.delete-project')
          .style.display = 'none'
           }
        })
       
      }
    
    document
    .getElementById('projects-menu')
    .appendChild(cancelButton)
  }
  
  static initSaveChangesButton(){
    const projectsMenu = document.getElementById('projects-menu');
    
    
    const saveChangesButton = document.createElement('button')
          
          saveChangesButton.setAttribute('id', 'save-changes')
          saveChangesButton.textContent = 'Save Changes'
          saveChangesButton.style.display = 'none'
          
      saveChangesButton
      .onclick = () => {
        
        const project = document.querySelectorAll('#projects-menu #project-tab')
    
        UserInterface.cancelEditProjectsMenu()
      
        projectsMenu
        .querySelector('#add-project')
        .style.display = 'block'
        
        projectsMenu
        .querySelector('#edit-projects')
        .style.display = 'block'
        
        projectsMenu
        .setAttribute('data-status', 'display')
        
        projectsMenu
        .querySelector('#save-changes')
        .style.display = 'none'
        
        projectsMenu
        .querySelector('#cancel-button')
        .style.display = 'none'
        
        project
        .forEach(project => {
           if(project.hasAttribute('data-name') === true){
           
           project
          .querySelector('.project-task-count')
          .style.display = 'block'
          
           project
          .querySelector('.delete-project')
          .style.display = 'none'
           }
        })
        
      }
      
    document
    .getElementById('projects-menu')
    .appendChild(saveChangesButton)
  }
  
  static createProjectForm(){
    
    const projectsMenu = document.getElementById('projects-menu')
    
    const newProjectForm = document.createElement('form')
    
          newProjectForm.setAttribute('id', 'project-form')
          
      newProjectForm.innerHTML = ( `
      <h2 id='form-header'> New Project </h2>
      
      <div>
        <label>Name</label>
        <input type="text" name="project-name" required="true"/>
      </div>
        
      <button type="button" id="create-button">
      Add Project
      </button>
      
      <button type="button" id="cancel-button">
      Cancel
      </button>
      
      `)
      
      newProjectForm
      .querySelector('#create-button')
      .onclick = () => {
        const normalProjects = document.querySelector('#normal-section')
        
        UserInterface.addProject(
          normalProjects,
          UserInterface.getProjectFormInput())
        
        projectsMenu
        .querySelector('#add-project')
        .style.display = 'block'
        
        projectsMenu
        .querySelector('#edit-projects')
        .style.display = 'block'
        
        projectsMenu
        .setAttribute('data-status', 'display')
    }
    
      newProjectForm
      .querySelector('#cancel-button')
      .onclick = () => {
        UserInterface.closeNewProjectPopup()
        
        projectsMenu
        .querySelector('#add-project')
        .style.display = 'block'
        
        projectsMenu
        .querySelector('#edit-projects')
        .style.display = 'block'
        
        projectsMenu
        .setAttribute('data-status', 'display')
    }
    
    document
    .getElementById('project-form-popup')
    .appendChild(newProjectForm)
}

  static createTaskForm(){
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
      <label>Project</label>
      <select id="project-selection" name="task-project">
  
      </select>
    </div>
    
    
  <button type="button" id="create-button">
  Add Task
  </button>
  
  <button type="button" id="cancel-button"> Cancel
  </button>
  
    ` )
    
    Storage
    .getProjects()
    .forEach((project) => {
      const option = document.createElement('option')
      
            option.textContent = project.name;
            
      newTaskForm
      .querySelector('#project-selection')
      .appendChild(option)
      
    })
    
    newTaskForm
    .querySelector('#cancel-button')
    .onclick = () => {
      UserInterface.closeCreateTaskPopup()
    }
    
    newTaskForm
    .querySelector('#create-button')
    .onclick = () => {

      UserInterface.createTask(
        UserInterface.currentProject,
        UserInterface.getFormInput('form'))
        
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
      project: taskDiv.children[1].children[2].textContent,
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
    <label>Project</label>
    <select class='task-popup-project'>
    
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
    .getProjects()
    .forEach((project) => {
      const option = document.createElement('option')
      
            option.textContent = project.name
            
      popupContainer
      .querySelector('.task-popup-project')
      .appendChild(option)
      
    })
    
    popupContainer
      .querySelector('.task-popup-urgency').value = task.urgency;
    
    popupContainer
      .querySelector('.task-popup-project').value = task.project;
    
    popupContainer
      .querySelector('.popup-cancel-button')
        .onclick = () => {
      UserInterface.closeEditTaskPopup(taskDiv)}
  }
  
  static editProjectsMenu(){
    
    const normalProjects = document.getElementById('normal-section');
    
    const projectsMenu = document.getElementById('projects-menu');
    
    normalProjects
    .childNodes
    .forEach(project => {
      if(project.hasAttribute('data-name')){
        
        project
        .querySelector('.delete-project')
        .onclick = () => {
          Storage.deleteProject(project.getAttribute('data-name'))
        
          
       if(Storage.getProjects().length < 2){
          projectsMenu
          
          .querySelector('#add-project')
          .style.display = 'block';
          
          projectsMenu
          .querySelector('#cancel-button')
          .style.display = 'none';
          
          projectsMenu
          .querySelector('#save-changes')
          .style.display = 'none';
          
        } else {
          projectsMenu
          .querySelector('#save-changes')
          .style.display = 'block'
        }
        
        normalProjects
          .removeChild(project)
          
          
          UserInterface.loadTimeBasedProjects()
          UserInterface.updateTaskCount()
          
        }
        
      } })
  }
  
  static cancelEditProjectsMenu(){
    
    const normalProjects = document.getElementById('normal-section')
    
    normalProjects
    .childNodes
    .forEach(project => {
      if(project.hasAttribute('data-name')){
        
        project
        .querySelector('.project-task-count')
        .textContent = Storage.getProject(
          project.getAttribute('data-name'))
          .getTasks().length
        
      }
      
    })
  }
  
  static openNewProjectPopup(){
    const popup = document.getElementById('project-form-popup')
    
    popup.style.display = 'block'
  }
  
  static closeNewProjectPopup(){
    
    
    UserInterface.updateTaskCount()
    const popup = document.querySelector('#project-form-popup')
    
    const projectNameInput = document.querySelector('#project-form input')
    
    projectNameInput.value = ''
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
