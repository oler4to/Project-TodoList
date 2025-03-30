export default class Task{
  constructor(name, details, duedate, urgency, project)
    {
    this.name = name,
    this.details = details || 'No Details',
    this.duedate = duedate || 'No Date',
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

