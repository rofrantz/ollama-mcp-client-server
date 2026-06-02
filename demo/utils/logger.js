export const styles = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    italic: '\x1b[3m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
};

export function debug(...args) {
    console.error(`${styles.bold}${styles.cyan}[MCP-SERVER][DEBUG]${styles.reset}`, ...args);
}
