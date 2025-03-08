import { workspace, ConfigurationTarget } from 'vscode';
import { State } from './state';
import * as vscode from 'vscode';
import * as path from 'path';

export async function update(state?: State | undefined) {
    const configuration = workspace.getConfiguration();

    if (state === undefined) {
        return await configuration.update(
            'workbench.editor.customLabels.patterns',
            {},
            ConfigurationTarget.Workspace,
        );
    }

    const map: { [key: string]: string } = {};
    const patterns = state.marks.reduce((map, mark) => {
        const patternKey = `*/${mark.relativePath}`;
        map[patternKey] = `${mark.superscriptNumber()} ${path.win32.basename(mark.uri.fsPath)}`;
        return map;
    }, map);

    await configuration.update(
        'workbench.editor.customLabels.patterns',
        patterns,
        ConfigurationTarget.Workspace,
    );
}

export async function toggle(state: State) {
    const ed = vscode.window.activeTextEditor;

    if (!ed) {
        state.dbg?.appendLine(`Window has no active text editor.`);
        return;
    }

    state.toggle(ed);
};

export async function navigate(state: State, num: number) {
    const target = state.marks.find(mark => mark.num === num);

    if (target === undefined) {
        state.dbg?.appendLine(`Could not find mark with provided number: ${num}`);
        return;
    }

    const ed = vscode.window.visibleTextEditors.find(ed => ed.document.uri === target.uri);

    if (ed === undefined) {
        vscode.window.showTextDocument(target.uri);
    } else {
        vscode.window.showTextDocument(ed.document);
    }
}

export async function get() {
    const configuration = workspace.getConfiguration();
    return await configuration.get('workbench.editor.customLabels') || {};
}
