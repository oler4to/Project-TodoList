import List from './List.js'

export default class TodoList{
  
  constructor(){
    this.lists = [],
    this.lists.push(new List('None')),
    this.lists.push(new List('Personal')),
    this.lists.push(new List('Work'))
    
  }
  
  setLists(lists){
    this.lists = lists
  }
  
  addList(list){
    if(this.lists.every((p) => p.name !== list.name)){
    this.lists.push(list)
    }
  }
  
  deleteList(listName){
    this.lists = this.lists.filter((list) => list.name !==
    listName)
  }
  
  getLists(){
    return this.lists
  }
  
  getList(listName){
    return this.lists.find((p) => p.name === listName)
  }
  
  getAllTasks(){
    const allTasks = new List('All Tasks')
    
    this.lists.map(
      list => { for( let task of list.tasks){
        allTasks.tasks.push(task)
      } })
    
    return allTasks
  }
}