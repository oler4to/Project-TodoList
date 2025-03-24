export default class Task{
  constructor(
    name, 
    details = 'No Details', 
    duedate = 'No Date', 
    urgency = 'Low', 
    project = 'None')
    {
    this.name = name,
    this.details = details,
    this.duedate = duedate,
    this.urgency = urgency,
    this.project = project
  }
  
  setName(taskName){
    this.name = taskName
  }
  setDetails(taskDetails){
    this.name = taskDetails
  }
  setDuedate(taskDuedate){
    this.name = taskDuedate
  }
  setUrgency(taskUrgency){
    this.name = taskUrgency
  }
  setProject(taskProject){
    this.name = taskProject
  }
  
  getName(){
    return this.name
  }
}

