import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, VideoService]
})
export class HomeComponent implements OnInit {

	public page_title: string; 
	public identity;
	public token;
	public videos: Video[];
	public page;
	public next_page;
	public prev_page;
	public number_pages;

	constructor(
		private _userService: UserService,
		private _videoService: VideoService,
		private _route: ActivatedRoute,
		private _router: Router
	) { 
		this.page_title = "inicio";
	}

	ngOnInit(): void {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		this.currentPageVideos();
		
	}

	currentPageVideos(){
		this._route.params.subscribe(params => {
			var page = +params['page'];
			if(!page){
				page = 1;
				this.prev_page = 1;
				this.next_page = 2;
			}	
			this.getVideos(page);
		});
	}

	getVideos(page){
		this._videoService.getVideos(this.token, page).subscribe(
			response => {
				this.videos = response.videos;
				if(response.videos.length == 0){
					this._router.navigate(['/inicio',1]);
				}
				var number_pages = [];
				for(var i =1; i <= response.total_pages; i++){
					number_pages.push(i);
				}
				this.number_pages = number_pages;
				if(page >= 2){
					this.prev_page = page -1;
				}else{
					this.prev_page =1
				}
				if(page < response.total_pages){
					this.next_page = page + 1;
				}else{
					this.next_page = response.total_pages;
				}
			},
			error => {
				console.log(error)
			}
		);
	}

	getThumb(url, size = null) {
		var video, results, thumburl;

		if (url === null) {
		  return '';
		}

		results = url.match('[\\?&]v=([^&#]*)');
		video   = (results === null) ? url : results[1];

		if(size != null) {
		  thumburl = 'http://img.youtube.com/vi/' + video + '/'+ size +'.jpg';
		}else{
		  thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
		}

		return thumburl;
	}
    
    deleteVideo(id){
    	this._videoService.delete(this.token, id).subscribe(
    		response => {
    			this.currentPageVideos();
    		},
    		error => {
    			console.log(error);
    		}
		);
    }

}
