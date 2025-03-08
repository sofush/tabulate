import * as vscode from 'vscode';
import * as path from 'path';
import * as util from './util';

/**
 * Represents a `vscode.TextEditor` that can be navigated to.
 */
export class Mark {
    /**
     * The number which is used to navigate to this file (chosen by the user).
     */
    public num: number;

    /**
     * A URI to the file associated with this mark.
     */
    public uri: vscode.Uri;

    /**
     * The URI of the file represented as a relative path.
     */
    public relativePath: string;

    constructor(num: number, uri: vscode.Uri) {
        this.num = num;
        this.uri = uri;
        this.relativePath = util.uriToRelative(uri);
    }

    public getGlobPattern() {
        return `*/${this.relativePath}`;
    }

    public getLabelContent() {
        return `${this.superscriptNumber()} ${path.win32.basename(this.uri.fsPath)}`;
    }

    public superscriptNumber() {
        let n = this.num;
        let out = '';

        while (n > 0) {
            const digit = n % 10;
            n = Math.floor(n / 10);
            out = util.digitToSuperscript(digit) + out;
        }

        if (this.num < 0) {
            out = '⁻' + out;
        }

        return out;
    }
}
