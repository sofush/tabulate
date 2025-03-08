import * as vscode from 'vscode';
import * as core from './core';
import { State } from './state';

const state = new State();

export async function activate(context: vscode.ExtensionContext) {
	await core.update(state);

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
		vscode.commands.registerCommand('tabulate.clear', async _ => {
			state.clear();
			await core.update(state);
		}),
		vscode.window.tabGroups.onDidChangeTabGroups(async ev => {
			await core.update(state);
		}),
	];

	disps.forEach(d => context.subscriptions.push(d));
}

export async function deactivate() {
	state.clear();
	await core.update(state);
}
