import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-filesystem',
    templateUrl: './association-filesystem.component.html',
    styleUrls: ['./association-filesystem.component.scss']
})
export class AssociationFilesystemComponent implements OnInit {
    association: any;
    error: string = "";
    $folder: any;
    selected_file: any;
    adding_file: boolean = false;

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params) => {
                let association_id = params['id'];
                let folder_id = params['folder_id'];
                this.api.get(`associations/${association_id}/`).subscribe(
                    association => {
                        this.association = association;
                        this.loadFolder(folder_id);
                    },
                    error => {
                        this.error = error;
                        console.log(error);
                    }
                );
            });
    };


    loadFolder(folder) {
        if (folder == null) {
            this.$folder = this.api.get(`associations/${this.association.id}/filesystem/root`)
        } else {
            this.$folder = this.api.get(`folder/${folder}`)
        }
    }

    openFolder(folder) {
        this.router.navigateByUrl(`associations/${this.association.id}/files/${folder.id}`);
    }

    selectFile(file) {
        if (this.selected_file == file) {
            this.selected_file = null;
        } else {
            this.selected_file = file;
        }
    }

    openModal(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
            _ => this.selected_file = null,
            _ => this.selected_file = null
        );
    }
}
