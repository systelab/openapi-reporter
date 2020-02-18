import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AbstractTree } from 'systelab-components/widgets/tree/abstract-tree.component';
import { TreeNode } from 'primeng/components/common/treenode';

import { JamaRESTAPISpec, JamaRESTAPIAction } from '@model';
import { Tree } from '@angular/router/src/utils/tree';


@Component({
	selector: 'spec-changes-tree',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-tree-status.component.html',
	styleUrls: ['spec-changes-tree.component.scss']
})
export class SpecChangesTreeComponent extends AbstractTree implements OnInit, OnChanges  {

	@Input() public jamaSpec: JamaRESTAPISpec;

	constructor() {
		super();
	}

	public ngOnInit() {
		this.refresh();
	}

	public ngOnChanges() {
		this.refresh();
	}

	public nodeSelect(evt: any) {
		this.nodeSelected.emit(evt.node);
	}

	private refresh(): void {

		console.log('Refreshing changes tree...', this.jamaSpec);
		const newTreeNodes: TreeNode[] = [];

		newTreeNodes.push(this.buildItemsToAddNode());
		newTreeNodes.push(this.buildItemsToUpdateNode());
		newTreeNodes.push(this.buildItemsToDeleteNode());
		newTreeNodes.push(this.buildUnchangedItemsNode());

		this.tree = newTreeNodes;
	}

	private buildItemsToAddNode(): TreeNode {

		const childNodes: TreeNode[] = this.buildActionTypeItems(JamaRESTAPIAction.Create);
		const emptyNode: TreeNode = {
			label: 'No items to add',
			icon: 'fa-dot-circle-o',
			selectable: false
		};

		const itemsToAddNode: TreeNode = {
			label: 'Items to add (' + childNodes.length + ')',
			icon : 'fa-plus-square text-success',
			children: (childNodes.length > 0) ? childNodes : [emptyNode],
			selectable: false
		};

		return itemsToAddNode;
	}

	private buildItemsToUpdateNode(): TreeNode {

		const childNodes: TreeNode[] = this.buildActionTypeItems(JamaRESTAPIAction.Update);
		const emptyNode: TreeNode = {
			label: 'No items to update',
			icon: 'fa-dot-circle-o',
			selectable: false
		};

		const itemsToUpdateNode: TreeNode = {
			label: 'Items to update (' + childNodes.length + ')',
			icon : 'fa-2 fa-pencil-square text-primary',
			children: (childNodes.length > 0) ? childNodes : [emptyNode],
			selectable: false
		};

		return itemsToUpdateNode;
	}

	private buildItemsToDeleteNode(): TreeNode {

		const childNodes: TreeNode[] = this.buildActionTypeItems(JamaRESTAPIAction.Delete);
		const emptyNode: TreeNode = {
			label: 'No items to delete',
			icon: 'fa-dot-circle-o',
			selectable: false
		};

		const itemsToDeleteNode: TreeNode = {
			label: 'Items to delete (' + childNodes.length + ')',
			icon : 'fa2 fa-minus-square text-danger',
			children: (childNodes.length > 0) ? childNodes : [emptyNode],
			selectable: false
		};

		return itemsToDeleteNode;
	}

	private buildUnchangedItemsNode(): TreeNode {

		const childNodes: TreeNode[] = this.buildActionTypeItems(JamaRESTAPIAction.NoAction);
		const emptyNode: TreeNode = {
			label: 'No unchanged items',
			icon: 'fa-dot-circle-o',
			selectable: false
		};

		const unchangedItemsNode: TreeNode = {
			label: 'Unchanged items (' + childNodes.length + ')',
			icon : 'fa-check-square',
			children: (childNodes.length > 0) ? childNodes : [emptyNode],
			selectable: false
		};

		return unchangedItemsNode;
	}

	private buildActionTypeItems(actionType: JamaRESTAPIAction): TreeNode[] {

		const actionTypeNodes: TreeNode[] = [];

		if (this.jamaSpec.endpointsFolderAction === actionType) {
			actionTypeNodes.push({
				label: 'Endpoints',
				icon: 'fa-folder-open-o',
				selectable: false
			});
		}

		for (const endpointGroup of this.jamaSpec.endpointGroups) {

			if (endpointGroup.action === actionType) {
				actionTypeNodes.push({
					label: endpointGroup.name,
					icon: 'fa-folder-open-o',
					selectable: false
				});
			}

			for (const endpoint of endpointGroup.endpoints) {

				if (endpoint.action === actionType) {
					actionTypeNodes.push({
						label: endpoint.title,
						icon: 'fa-puzzle-piece',
						selectable: false
					});
				}

				for (const example of endpoint.examples) {
					if (example.action === actionType) {
						actionTypeNodes.push({
							label: example.title,
							icon: 'fa-font',
							selectable: false
						});
					}
				}
			}
		}


		if (this.jamaSpec.dataTypesFolderAction === actionType) {
			actionTypeNodes.push({
				label: 'Data Types',
				icon: 'fa-folder-open-o',
				selectable: false
			});
		}

		for (const dataType of this.jamaSpec.dataTypes) {

			if (dataType.action === actionType) {
				actionTypeNodes.push({
					label: dataType.title,
					icon: 'fa-puzzle-piece',
					selectable: false
				});
			}
		}

		return actionTypeNodes;
	}

}
