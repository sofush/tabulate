import * as vscode from 'vscode';
import { Mark } from './mark';
import { relative } from 'path';

export class State {
    public marks: Mark[];
    public dbg: vscode.OutputChannel | undefined;
    public root: vscode.Uri;

    constructor() {
        this.marks = [];
        this.root = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
            ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.parse('.');

        if (process.env.TABULATE_DEBUG === "true") {
            this.dbg = vscode.window.createOutputChannel('tabulate');
            this.dbg.show();
        }
    }

    public toggle(editor: vscode.TextEditor) {
        let mark: Mark | undefined = this.marks.find(mark => {
            const lhs = mark.uri.fsPath;
            const rhs = editor.document.uri.fsPath;
            const rel = relative(lhs, rhs);

            if (this.dbg !== undefined) {
                this.dbg.appendLine(`Comparing editor and mark path:`);
                this.dbg.appendLine(`\tMark path: ${lhs}`);
                this.dbg.appendLine(`\tEdit path: ${rhs}`);
                this.dbg.appendLine(`\tRelative path: ${rel}`);
            }

            return rel === '';
        });

        if (mark === undefined) {
            this.mark(editor);
        } else {
            this.unmark(editor);
        }

        this.print();
    }

    public mark(editor: vscode.TextEditor) {
        if (!this.checkEditor(editor)) { return; }

        this.dbg?.appendLine(`Marking file ${editor.document.uri.fsPath}`);

        const tabs = this.getAssociatedTabs(editor);

        if (tabs.length === 0) {
            this.dbg?.appendLine('Could not find any tab associated with the active text editor.');
            return;
        }

        this.dbg?.appendLine(`${tabs.length} tabs are associated with ${editor.document.fileName}`);

        this.sortMarks();
        let num = this.marks.length + 1;

        for (let i = 1; i <= this.marks.length; ++i) {
            if (this.marks[i - 1].num !== i) {
                num = i;
                break;
            }
        }

        const mark = new Mark(num, editor.document.uri);
        this.marks.push(mark);
    }

    public unmark(editor: vscode.TextEditor) {
        if (!this.checkEditor(editor)) { return; }

        this.marks = this.marks.filter(mark => {
            const keep = mark.uri !== editor.document.uri;

            if (!keep) {
                this.dbg?.appendLine(`Unmarking file ${mark.relativePath}`);
            }

            return keep;
        });

        const workbenchConfig = vscode.workspace.getConfiguration('tabulate');
        const shouldRenumber = workbenchConfig.get('renumberAutomatically');

        if (shouldRenumber) {
            this.renumber();
        }
    }

    public renumber() {
        this.sortMarks();

        let n = 0;
        this.marks.forEach(mark => mark.num = ++n);
    }

    public clear() {
        this.marks = [];
    }

    private checkEditor(editor: vscode.TextEditor): boolean {
        if (editor.document.isUntitled) {
            this.dbg?.appendLine('Cannot mark untitled document.');
            return false;
        }

        if (editor.document.uri.scheme === 'output') {
            this.dbg?.appendLine('Cannot mark editor with URI scheme "output".');
            return false;
        }

        return true;
    }

    private getAssociatedTabs(editor: vscode.TextEditor): vscode.Tab[] {
        return vscode.window.tabGroups.activeTabGroup.tabs.filter(tab => {
            if (tab.input instanceof vscode.TabInputText) {
                const lhs = tab.input.uri.fsPath;
                const rhs = editor.document.fileName;
                return relative(lhs, rhs);
            }
        });
    }

    private sortMarks() {
        this.marks.sort((a, b) => {
            return Math.sign(a.num - b.num);
        });
    }

    private print() {
        this.sortMarks();

        if (this.marks.length === 0) {
            this.dbg?.appendLine('No marks.');
            return;
        } else {
            this.dbg?.appendLine('Marks:');
        }

        this.marks.forEach(mark => {
            this.dbg?.appendLine(`\t${mark.num} => ${mark.relativePath}`);
        });
    }
}
