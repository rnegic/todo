import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
    return uuidv4();
};

export const makePlural = (count: number): string => {
    return count === 1 ? 'todo' : 'todos';
};