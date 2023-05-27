export type IFrequency = {
    _id?: string,
    type: string,//task or greeting
    minutes?: number,
    hours?: number,
    days?: number,
    months?: number,
    weekdays?: string,
    monthdays?: string,
}
export type ITaskTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: ITask,
}
export type ITaskRefreshTrigger = {
    _id: string,
    key: string,
    status: string,
    cronString: string,
    created_at: Date,
    updated_at: Date
    task: ITask
}
export interface ITask{
    _id: string,
    task_title:string,
    task_detail:string,
    person:string,
    phone:string,

    message_id:string,
    whatsapp_status: string,
    whatsapp_timestamp: Date,
    task_status: string,
    task_timestamp: Date,

    autoRefresh:boolean,
    autostop:boolean,
   
    frequency:IFrequency,
    running_trigger:ITaskTrigger,
    refresh_trigger:ITaskRefreshTrigger,
    
    start_date: Date,
    next_run_date:Date,
    next_refresh_date:Date,
    created_at: Date,
    updated_at: Date
}


export type TaskBody = Request['body'] & ITask;