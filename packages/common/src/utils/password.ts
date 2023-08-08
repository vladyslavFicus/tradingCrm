const generate = (): string => `A1#${Math.random().toString(36)}`.substr(0, 16);

export default generate;
