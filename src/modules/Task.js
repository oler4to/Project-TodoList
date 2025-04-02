import {formatDate} from 'date-fns'

export default class Task{
  constructor(name, details, duedate, urgency, project)
    {
    this.name = name,
    this.details = details || 'No Details',
    this.duedate = duedate || 'No Date',
    this.urgency = urgency,
    this.project = project
  }
  
  setFields(tName, tDetails, tDuedate, tUrgency){
      this.name = tName;
      this.details = tDetails;
      this.duedate = tDuedate;
      this.urgency = tUrgency;
  }
  
  getName(){
    return this.name
  }
  
  setDate(){
    if (this.duedate === ''){
      this.duedate = 'No Date'
    }
    
    if(this.duedate !== 'No Date'){
      this.duedate = formatDate(this.duedate, 'd MMMM yyyy')
      
    }
  }
  
  getDate(){
    this.setDate()
    return this.duedate
  }
}

