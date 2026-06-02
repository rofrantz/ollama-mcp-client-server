const styles = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
};

export function debug(...args) {
    console.error(`${styles.bold}${styles.cyan}[MCP-SERVER][DEBUG]${styles.reset}`, ...args);
}
