import * as vscode from 'vscode';
import { Mark } from './mark';

const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
    ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.parse('.');

const superscripts = [
    '⁰',
    '¹',
    '²',
    '³',
    '⁴',
    '⁵',
    '⁶',
    '⁷',
    '⁸',
    '⁹',
];

export const uriToRelative = (uri: vscode.Uri) => {
    let relativePath = uri.fsPath.replaceAll(rootPath.fsPath, '').replaceAll('\\', '/');

    if (relativePath.startsWith('/')) {
        relativePath = relativePath.substring(1);
    }

    return relativePath;
};

export const digitToSuperscript = (digit: number): string | undefined => {
    if (digit >= 0 && digit <= 9) {
        return superscripts[digit];
    }
};

export const isValidMarkFormat = (kv: [string, string]): boolean => {
    if (!kv[0].startsWith('*/')) {
        return false;
    }

    if (kv[1].length < 2) {
        return false;
    }

    const splits = kv[1].split(' ');

    if (splits.length < 2) {
        return false;
    }

    const numSuperscript = splits[0];
    const match = [...numSuperscript].find(ch => !superscripts.includes(ch));

    if (match !== undefined) {
        return false;
    }

    return true;
};
