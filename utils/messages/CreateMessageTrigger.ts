import { MessageManager } from "../..";
import Frequency from "../../models/Frequency";
import Message from "../../models/messages/Message";
import MessageRefreshTrigger from "../../models/messages/MessageRefreshTrigger";
import MessageTrigger from "../../models/messages/MessageTrigger";
import {  IMessage } from "../../types/messages.type";
import { GetRefreshDateCronString } from "../GetRefreshDateCronString";
import { GetRunningDateCronString } from "../GetRunningDateCronString";
import { RefreshMessage } from "./RefreshMessage";
import { SendMessageWhatsapp } from "./SendMessageWhatsapp";
import cronParser from "cron-parser";


export  async function CreateMessageTrigger(message:IMessage) {
    if (message.frequency) {
        let frequency = await Frequency.findById(message.frequency._id)
        if (frequency) {
            let runstring = GetRunningDateCronString(frequency, message.start_date)
            let refstring = GetRefreshDateCronString(frequency, message.start_date)

            if (!message.running_trigger && !message.refresh_trigger && message.frequency) {
                if (runstring) {
                    let running_trigger = new MessageTrigger({
                        key: message._id + "," + "run",
                        status: "running",
                        cronString: runstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        message: message
                    })
                    await running_trigger.save()
                    await Message.findByIdAndUpdate(message._id,
                        {
                            running_trigger: running_trigger, next_run_date: cronParser.parseExpression(running_trigger.cronString).next().toDate()
                        }
                    )
                    if (running_trigger) {
                        MessageManager.add(running_trigger.key, runstring, () => { SendMessageWhatsapp(running_trigger.key) })
                        MessageManager.start(running_trigger.key)
                    }
                }
                if (refstring) {
                    let refresh_trigger = new MessageRefreshTrigger({
                        key: message._id + "," + "refresh",
                        status: "running",
                        cronString: refstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        message: message
                    })

                    await refresh_trigger.save()
                    await Message.findByIdAndUpdate(message._id,
                        {
                            refresh_trigger: refresh_trigger, next_refresh_date: cronParser.parseExpression(refresh_trigger.cronString).next().toDate()
                        })

                    if (refresh_trigger) {
                        MessageManager.add(refresh_trigger.key, refstring, () => { RefreshMessage(refresh_trigger.key) })
                        MessageManager.start(refresh_trigger.key)
                    }

                }
            }
        }
    }
}