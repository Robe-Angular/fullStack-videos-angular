import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css'],
  providers: [UserService, VideoService]
})
export class VideoDetailComponent implements OnInit {
public video: Video;
	public page_title: string;
	public identity;
	public token;
	public status: string;
	
	constructor(
		private _userService: UserService,
		private _videoService: VideoService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _sanitizer: DomSanitizer

	) { 
		this.page_title = 'Modificar este video';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(): void {
		
		this.getVideo();
	}

	getVideo(){
		this._route.params.subscribe(params => {
			var id = +params['id'];

			this._videoService.getVideo(this.token, id).subscribe(
				response => {
					if(response.status == 'success'){
						this.video = response.video;
					}else{
						this._router.navigate(['/inicio']);
					}
				},
				error => {
					this.status = "error";
					console.log(error);
				}
			);
		});
	}

	getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}


}
