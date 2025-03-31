import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
    return uuidv4();
};

export const makePlural = (count: number, word: string): string => {
    return count === 1 ? word : `${word}s`;
};