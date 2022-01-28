import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

	public page_title: string;
	public user: User;
	public status:string;
	public error_response: string;
	public identity;
	public token;

	constructor(
		private _userService: UserService
	) { 
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.page_title = "Ajustes de usuario";
		this.user = new User(
			this.identity.sub,
			this.identity.name,
			this.identity.surname,
			this.identity.email,
			this.identity.name,
			'ROLE_USER','');
		this.status = '';
		this.error_response = '';
	}

	ngOnInit(): void {
	}

	onSubmit(form){
		this._userService.update(this.token, this.user).subscribe(
			response => {
				if(response && response.status == 'success'){
					this.status = 'success';
					this.identity.sub = this.user.id;
					this.identity.name = this.user.name;
					this.identity.surname = this.user.surname;
					this.identity.email = this.user.email;
					localStorage.setItem('identity', JSON.stringify(this.identity));
					localStorage.setItem('token', response.token);
					this.token = this._userService.getToken();
				}else{
					this.status = 'error';
				}
			},
			error => {
				this.status = 'error';
				console.log(error)
			}
 		);
	}
}
