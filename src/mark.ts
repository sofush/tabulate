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

    public superscriptNumber() {
        let n = this.num;
        let out = '';

        while (n > 0) {
            const digit = n % 10;
            n = Math.floor(n / 10);

            switch (digit) {
                case 0:
                    out = '⁰' + out;
                    break;
                case 1:
                    out = '¹' + out;
                    break;
                case 2:
                    out = '²' + out;
                    break;
                case 3:
                    out = '³' + out;
                    break;
                case 4:
                    out = '⁴' + out;
                    break;
                case 5:
                    out = '⁵' + out;
                    break;
                case 6:
                    out = '⁶' + out;
                    break;
                case 7:
                    out = '⁷' + out;
                    break;
                case 8:
                    out = '⁸' + out;
                    break;
                case 9:
                    out = '⁹' + out;
                    break;
            }
        }

        if (this.num < 0) {
            out = '⁻' + out;
        }

        return out;
    }
}
