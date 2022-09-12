import chalk from "chalk";

export default class Logger {
    public static log = (data: any) => console.log(
        chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
        typeof data == 'string' ? chalk.blueBright(data) : data);

    public static warn = (data: any) => console.log(
        chalk.yellow(`[${new Date().toLocaleString()}] [WARN] `),
        typeof data == 'string' ? chalk.yellowBright(data) : data);

    public static error = (data: any) => console.log(
        chalk.red(`[${new Date().toLocaleString()}] [ERROR] `),
        typeof data == 'string' ? chalk.redBright(data) : data);
}