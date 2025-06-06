const CONSOLE_STYLE = {
    prefix: '%c Elaina - EOG Mass report ',
    css: 'color: #ffffff; background-color: #f77fbe'
};

export const log = (message: string, ...args: string[]) => console.log(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
export const warn = (message: string, ...args: string[]) => console.warn(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);
export const error = (message: string, ...args: string[]) => console.error(CONSOLE_STYLE.prefix + '%c ' + message, CONSOLE_STYLE.css, '', ...args);