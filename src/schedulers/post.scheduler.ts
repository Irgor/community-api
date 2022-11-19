import Post from "@models/Post.model";
import * as schedule from "node-schedule";
import { defaultCathError } from '@utils/requestHandling';
import { ErrorMessages } from '@utils/errorMessages';

const dateToCron = (date: Date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

export const schedulePost = async (title: string, tags: string[], description: string, date: Date, email: string, isPublic: boolean) => {
    
    const cronDate = dateToCron(date);

    schedule.scheduleJob(cronDate, async () => {
            
            const post = new Post({
                title,
                tags,
                description,
                email,
                isPublic,
                isPurchasable: false,
                likes: 0,
                likers: []
            })

            const createdPost = await post.save().catch(error => {
                defaultCathError(ErrorMessages.CREATE_POST_ERROR, error)
            });

            schedule.gracefulShutdown().then(() => process.exit(0))
            return createdPost;
        })

    return null;
}