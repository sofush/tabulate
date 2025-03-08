import { workspace, ConfigurationTarget } from 'vscode';
import { State } from './state';
import * as util from './util';
import * as vscode from 'vscode';

export async function update(state: State) {
    const configuration = workspace.getConfiguration();

    let oldPatterns: { [pattern: string]: string } =
        await configuration.get('workbench.editor.customLabels.patterns') || {};

    let newPatterns: { [k: string]: string } = {};
    newPatterns = Object.entries(oldPatterns).reduce((map, [k, v]) => {
        const patternMatchesMarkFormat = util.isValidMarkFormat([k, v]);

        if (!patternMatchesMarkFormat) {
            map[k] = v;
        }

        return map;
    }, newPatterns);

    state.marks.forEach(mark => {
        newPatterns[mark.getGlobPattern()] = mark.getLabelContent();
    });

    const value = Object.entries(newPatterns).length === 0
        ? undefined
        : newPatterns;

    await configuration.update(
        'workbench.editor.customLabels.patterns',
        value,
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
