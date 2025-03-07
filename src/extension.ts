import * as vscode from 'vscode';
import * as core from './core';
import { State } from './state';

export async function activate(context: vscode.ExtensionContext) {
	await core.update();
	const state = new State();

	const disps = [
		vscode.commands.registerCommand('tabulate.toggle', async _ => {
			await core.toggle(state);
			await core.update(state);
		}),
		vscode.commands.registerCommand('tabulate.navigate', async num => {
			if (typeof num === 'number') {
				await core.navigate(state, num);
			}
		}),
		vscode.window.tabGroups.onDidChangeTabGroups(async ev => {
			await core.update(state);
		}),
	];

	disps.forEach(d => context.subscriptions.push(d));
}

export async function deactivate() {
	await core.update();
}
