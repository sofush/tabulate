import * as vscode from 'vscode';

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
