import chalk from "chalk";

const log = (data: any) => {
    console.log(chalk.blue(`[${new Date().toLocaleString()}] [INFO] `),
        typeof data == 'string' ? chalk.blueBright(data) : data);
}

const warn = (data: any) => {
    console.log(chalk.yellow(`[${new Date().toLocaleString()}] [WARN] `),
        typeof data == 'string' ? chalk.yellowBright(data) : data);
}

const error = (data: any) => {
    console.log(chalk.red(`[${new Date().toLocaleString()}] [ERROR] `),
        typeof data == 'string' ? chalk.redBright(data) : data);
}

export default { log, warn, error }