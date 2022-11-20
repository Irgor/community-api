import * as schedule from "node-schedule";
import Post from "@models/Post.model";
import { defaultCathError } from "@utils/requestHandling";
import { ErrorMessages } from "@utils/errorMessages";

const dateToCron = (date: Date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

export const schedulePost = async (date: Date, id: string) => {
    
    const cronDate = dateToCron(date);

    schedule.scheduleJob(cronDate, async () => {
        const post = await Post.findById(id).catch(error => {
            defaultCathError(ErrorMessages.GET_POST_ERROR, error);
        });
    
        if (post) {
            post.set({ isPublished: true });
            await post.save().catch(error => {
                defaultCathError(ErrorMessages.UPDATE_POST_ERROR, error);
            })
        }
    });

    return null;
}