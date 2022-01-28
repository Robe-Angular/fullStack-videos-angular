import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

	public page_title: string;
	public user: User;
	public status:string;
	public error_response: string;
	public identity;

	constructor(
		private _userService: UserService,
		private _router: Router,
		private _route: ActivatedRoute
	) { 
		this.page_title = "Registro";
		this.user = new User(1,'','','','','ROLE_USER','');
		this.status = '';
		this.error_response = '';
	}

	ngOnInit(): void {
		console.log(this._userService.prueba());
		this.identity = this._userService.getIdentity();
		if(this.identity){
			this._router.navigate(['/inicio'])
		}
	}

	onSubmit(form){
		this._userService.register(this.user).subscribe(
			response => {
				if(response.status == 'success'){
					this.status = 'success';
					form.reset();
				}else{
					this.status = 'error';
					this.error_response = response.message;
					
				}
			},
			error => {
				console.log(error);
				this.status = 'error';
			}
		);
	}

}
